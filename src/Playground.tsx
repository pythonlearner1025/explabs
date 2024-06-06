import { createSignal, createEffect, onMount, onCleanup } from "solid-js";
import Chat from "./Chat";
import { Message, ControlInput } from "./types.ts";
import { defaultCell } from "./constants.ts";
import {parseToken}  from "./utils"
import TextareaAutosize from "solid-textarea-autosize"
import "./styles/playground.css";

function Playground({ playId, clearPlayground, ctrlInput }: { playId: string, clearPlayground : (id: string) => void, ctrlInput:any }) {
  const [baselineMessage, setBaselineMessage] = createSignal([])  
  const [controlMessage, setControlMessage] = createSignal([])  
  const [prompt, setPrompt] = createSignal('')

  let textarea;
  const handleBeforeUnload = (event: any) => {
//    event.preventDefault();
 //   event.returnValue = ""; // Standard for most browsers
    handleResetPlayground()
    return "You have unsaved changes! Are you sure you want to leave?";
  };

  onMount(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
  });

  // Cleanup before component unmounts
  onCleanup(() => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  });

  const handleResetPlayground = () => {
    fetch(`http://localhost:4000/clear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            playId,
        }),
        }
    )
    setBaselineMessage([])
    setControlMessage([])
    clearPlayground(crypto.randomUUID())
  }

  const addMessage = (role: string, content: string) => {
    const msgToAdd : Message = {
        "role": role, 
        "content": role == 'user' ? content : '',
        "tokens": []
    }
    setBaselineMessage([...baselineMessage(), msgToAdd])
    setControlMessage([...controlMessage(), msgToAdd])
  }

  const handlePromptSubmit = async (event: any) => {
    event.preventDefault();

    // add message
    const prompt = event.target.value.trim();
    event.target.value = ''
    textarea.style.height = '18px';
    setPrompt('')
    addMessage("user", prompt)
    addMessage("assistant", "")

    if (prompt !== "") {
      try {
        console.log({
            playId,
            prompt,
            type: 'baseline',
            vecs: [],
          })
        const [baselineResponse, controlResponse] = await Promise.all([
             fetch(`http://localhost:4000/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  playId,
                  prompt,
                  type: 'baseline',
                  vecs: [],
                }),
              }),
              fetch(`http://localhost:4000/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  playId,
                  prompt,
                  type: 'control',
                  vecs: Object.values(ctrlInput().vectors),
                }),
            })
        ]);
  
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
            console.log(messages());
            const msg = messages()
            if (tokenObj !== null) {
               const newMsg = {
                role: "assistant",
                content: "",
                tokens: [...msg[msg.length-1].tokens, {text: tokenObj.data, corrs: []}] 
               }
               setter([...msg.slice(0, -1), newMsg]) 
            }
          }
          await readStream(reader, messages, setter);
        }
        await Promise.all([
          readStream(baselineReader, baselineMessage, setBaselineMessage),
          readStream(controlReader, controlMessage, setControlMessage),
        ]);
      } catch (error) {
        console.error("Error streaming response:", error);
      } finally {
      }
    }
  };

const handleSubmit = async (prompt: string) => {
    textarea.style.height = '18px';
    setPrompt('')
    addMessage("user", prompt)
    addMessage("assistant", "")
    if (prompt !== "") {
      try {
        console.log({
            playId,
            prompt,
            type: 'baseline',
            vecs: [],
          })
        const [baselineResponse, controlResponse] = await Promise.all([
             fetch(`http://localhost:4000/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  playId,
                  prompt,
                  type: 'baseline',
                  vecs: [],
                }),
              }),
              fetch(`http://localhost:4000/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  playId,
                  prompt,
                  type: 'control',
                  vecs: Object.values(ctrlInput().vectors),
                }),
            })
        ]);
  
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
            console.log(messages());
            const msg = messages()
            if (tokenObj !== null) {
               const newMsg = {
                role: "assistant",
                content: "",
                tokens: [...msg[msg.length-1].tokens, {text: tokenObj.data, corrs: []}] 
               }
               setter([...msg.slice(0, -1), newMsg]) 
            }
          }
          await readStream(reader, messages, setter);
        }
        await Promise.all([
          readStream(baselineReader, baselineMessage, setBaselineMessage),
          readStream(controlReader, controlMessage, setControlMessage),
        ]);
      } catch (error) {
        console.error("Error streaming response:", error);
      } finally {
      }
    }
  };

  return (
    <div class="playground-container">
      <div class="header-container">
        <div class="header-title">Playground</div>
        <div class="header-model">
          Llama-3-8B-Instruct
        </div>
      </div>
      <div class="chats-container">
        <Chat type={'baseline'} messages={baselineMessage} />
        <Chat type={'control'} messages={controlMessage} />
      </div>
      <div class="message-send">
        <div class="message-send-container">
            <TextareaAutosize
            ref={textarea}
            value={prompt()}
            onChange={(event) => {
              setPrompt(event.target.value)
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                  handlePromptSubmit(event);
              }
            }}
            maxRows={18}
            class="prompt-input"
            placeholder="Enter your message here"
            /> 
            <div class="send-button" onClick={()=>{handleSubmit(prompt())}}>
                <svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 495.003 495.003" xml:space="preserve">
                    <g id="XMLID_51_">
                    <path id="XMLID_53_" d="M164.711,456.687c0,2.966,1.647,5.686,4.266,7.072c2.617,1.385,5.799,1.207,8.245-0.468l55.09-37.616 l-67.6-32.22V456.687z"/>
                    <path id="XMLID_52_" d="M492.431,32.443c-1.513-1.395-3.466-2.125-5.44-2.125c-1.19,0-2.377,0.264-3.5,0.816L7.905,264.422 c-4.861,2.389-7.937,7.353-7.904,12.783c0.033,5.423,3.161,10.353,8.057,12.689l125.342,59.724l250.62-205.99L164.455,364.414 l156.145,74.4c1.918,0.919,4.012,1.376,6.084,1.376c1.768,0,3.519-0.322,5.186-0.977c3.637-1.438,6.527-4.318,7.97-7.956 L494.436,41.257C495.66,38.188,494.862,34.679,492.431,32.443z"/>
                    </g>
                </svg>
            </div>
        </div>
    </div>
    </div>
  );
}

export default Playground;
