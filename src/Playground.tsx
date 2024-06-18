import { createSignal, createEffect, onMount, onCleanup } from "solid-js";
import { Message, Token, Trait } from "./types.ts";
import { parseToken, parseErrorMsg } from "./utils";

function constructMessage(tokens: Token[]): string {
  return tokens.map((token) => token.text).join("");
}

function traitsTag(traits: Trait[]) {
  return (
    <div class="flex flex-row pr-1 pt-1 pb-1 w-full flex-wrap">
      {traits
        .filter((trait) => trait.coeff > 0)
        .map((trait) => (
          <div class="h-fit flex flex-row mr-2 mb-2 bg-gray-100 py-1 px-1 rounded select-none">
            <div class="text-xs items-center flex font-bold">
              <svg class="mr-1" viewBox="0 0 100 100" width="1em" height="1em">
                <circle cx="40" cy="40" r="40" fill={trait.color} />
              </svg>
              {trait.desc}
              {trait.name}
            </div>
            <div class="text-xs ml-0.5 font-bold">
              {Math.floor(Math.min(Math.max(0, trait.coeff), 1) * 100)}%
            </div>
          </div>
        ))}
    </div>
  );
}
function Chat({ character, type, messages, onShrunk, setRef }) {
  const [chatInnerRef, setChatInnerRef] = createSignal(null);
  const [chatOuterRef, setChatOuterRef] = createSignal(null);

  createEffect(() => {
    if (chatInnerRef()) {
      chatInnerRef().scrollTop = chatInnerRef().scrollHeight;
    }
  });

  createEffect(() => {
    setRef(chatOuterRef());
  });

  return (
    <div
      class={`w-full h-full overflow-hidden`}
      ref={setChatOuterRef}
    >
      <div ref={setChatInnerRef} class="h-[98%] overflow-y-auto">
        {character().id in messages() &&
          messages()[character().id].map((message) => {
            return (
              <div class="flex flex-col p-2 text-left max-w-full">
                {message.role === "error" ? (
                  <div>
                    <div class="font-bold text-base mb-1">AI</div>
                    <div class="text-sm text-red-500">{message.content}</div>
                  </div>
                ) : (
                  <div>
                    <div class="font-bold text-base mb-1">
                      {message.role === "assistant" ? character().name : "You"}
                    </div>
                    {type === "control" && message.role === "assistant" ? (
                      traitsTag(message.traits)
                    ) : (
                      <div></div>
                    )}
                    <div class="text-sm break-all">
                      {message.role === "user"
                        ? message.content
                        : constructMessage(message.tokens)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

function Playground({ playId, clearPlayground, character }: { playId: string, clearPlayground: (id: string) => void, character: any }) {
  const [baselineMessage, setBaselineMessage] = createSignal({ [character().id]: [] });
  const [controlMessage, setControlMessage] = createSignal({ [character().id]: [] });

  const [broke, setBroke] = createSignal(false);

  let textarea;
  const handleBeforeUnload = (event: any) => {
    handleResetPlayground();
    return "You have unsaved changes! Are you sure you want to leave?";
  };

  createEffect(() => {
    console.log("CHARACTER CHANGE");
    console.log(character().name);
  });

  onMount(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
  });

  // Cleanup before component unmounts
  onCleanup(() => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  });

  const handleResetPlayground = () => {
    fetch(`${import.meta.env.VITE_ENDPOINT}/clear`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playId,
      }),
    });
    setBaselineMessage({
      ...baselineMessage(),
      [character().id]: [],
    });
    setControlMessage({
      ...controlMessage(),
      [character().id]: [],
    });
    clearPlayground(crypto.randomUUID());
  };

  const addMessage = (role: string, content: string, traits: Trait[]) => {
    const msgToAdd: Message = {
      role: role,
      content: role == "user" ? content : "",
      tokens: [],
      traits,
    };
    setBaselineMessage({
      ...baselineMessage(),
      [character().id]: !(character().id in baselineMessage())
        ? [msgToAdd]
        : [...baselineMessage()[character().id], msgToAdd],
    });
    setControlMessage({
      ...controlMessage(),
      [character().id]: !(character().id in controlMessage())
        ? [msgToAdd]
        : [...controlMessage()[character().id], msgToAdd],
    });
  };

  const handleSubmit = async (event: any = null) => {
    var prompt = textarea.value;
    if (event) {
      event.preventDefault();
      prompt = event.target.value.trim();
      event.target.value = "";
    }

    const traits: Trait[] = Object.values(character().traits);
    addMessage("user", prompt, traits);
    addMessage("assistant", "", traits);
    if (prompt != null) {
      try {
        const [controlResponse, baselineResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_ENDPOINT}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              playId,
              prompt,
              type: "control",
              character: character(),
            }),
          }),
          fetch(`${import.meta.env.VITE_ENDPOINT}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              playId,
              prompt,
              type: "baseline",
              character: character(),
            }),
          }),
        ]);
        textarea.value = "";


        const baselineReader = baselineResponse?.body?.getReader();
        const controlReader = controlResponse.body?.getReader();
        const decoder = new TextDecoder("utf-8");

        async function readStream(
          reader: ReadableStreamDefaultReader<Uint8Array> | undefined,
          messages: any,
          setter: any
        ) {
          if (!reader) {
            return;
          }
          const { done, value } = await reader.read();
          if (done) {
            return;
          }
          const decodedValue = decoder.decode(value, { stream: true });
          const chunks = decodedValue.split("\n");
          for (const chunk of chunks) {
            const tokenObj = parseToken(chunk);
            const msg = messages()[character().id];
            if (tokenObj !== null) {
              if (tokenObj.error) {
                const errorMsg = {
                  role: "error",
                  content: parseErrorMsg(tokenObj.error),
                  tokens: [],
                  traits: [],
                };
                setter({ ...messages(), [character().id]: [...msg.slice(0, -1), errorMsg] });
                setBroke(true);
                console.log(errorMsg);
                return;
              }
              const newMsg = {
                role: "assistant",
                content: "",
                tokens: [...msg[msg.length - 1].tokens, { text: tokenObj.data, corrs: [] }],
                traits,
              };
              setter({ ...messages(), [character().id]: [...msg.slice(0, -1), newMsg] });
            }
          }
          await readStream(reader, messages, setter);
        }
        await Promise.all([
          readStream(controlReader, controlMessage, setControlMessage),
          readStream(baselineReader, baselineMessage, setBaselineMessage),
        ]);
      } catch (error) {
        console.log("ERROR");
        console.error("Error streaming response:", error);
        const errorMsg = {
          role: "system",
          content: "Error",
          tokens: [],
          traits: [],
        };
        setControlMessage({ ...controlMessage(), [character().id]: [...controlMessage()[character().id], errorMsg] });
        setBaselineMessage({ ...baselineMessage(), [character().id]: [...baselineMessage()[character().id], errorMsg] });
        setBroke(true);
      } finally {
      }
    }
  };

  const [leftShrunk, setLeftShrunk] = createSignal(false); // Add state for left Chat collapsed status
  const [rightShrunk, setRightShrunk] = createSignal(false); // Add state for right Chat collapsed status
  const [chatRef, setChatRef] = createSignal(null);

  console.log(controlMessage());

  return (
    <div class="flex flex-col h-full">
      <div class="flex flex-row h-full w-full overflow-hidden" ref={setChatRef}>
        <div class="flex-1 overflow-y-auto h-full">
          <Chat
            character={character}
            type={"control"}
            messages={controlMessage}
            onShrunk={(b) => setRightShrunk(b)}
            setRef={setChatRef}
          />
        </div>
        <div class="flex-1 overflow-y-auto h-full">
          <Chat
            character={character}
            type={"baseline"}
            messages={baselineMessage}
            onShrunk={(b) => setLeftShrunk(b)}
            setRef={setChatRef}
          />
        </div>
      </div>
      <div class="bg-white border-t border-gray-300 p-4">
        <div class="relative">
          <textarea
            ref={textarea}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSubmit();
              }
            }}
            class="w-full px-4 py-2 text-base text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 resize-none"
            placeholder="Type your message..."
            disabled={broke()}
            rows={2}
            style={{ height: "auto", overflow: "hidden" }}
          />
          <button
            class="absolute top-0 right-0 mt-2 mr-2 px-4 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              handleSubmit();
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Playground;