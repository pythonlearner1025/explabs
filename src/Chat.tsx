import { Token } from "./types";
import "./styles/playground.css";
import { createEffect, createSignal, onMount, onCleanup } from "solid-js";

function constructMessage(tokens: Token[]): string {
    return tokens.map(token => token.text).join('');
}

function Chat({ type, messages }) {
    const [freeScroll, setFreeScroll] = createSignal(true)
    let msgCount = 0;
    let chatRef;

    createEffect(() => {
        messages();
        if (chatRef && freeScroll()) {
            chatRef.scrollTop = chatRef.scrollHeight;
        }

        if (messages().length > msgCount) {
            setFreeScroll(false) 
        } 

        msgCount = messages().length
    });

    const handleScroll = () => {
        setFreeScroll(false)
    }

    return (
     <div class={type === 'baseline' ? 'chat-baseline' : 'chat-control'}>
        <div class="chat-header">{type === 'baseline' ? "Baseline" : "Control"}</div>
        <div ref={chatRef} onWheel={handleScroll} class={type === 'baseline' ? 'chat-baseline-inner' : 'chat-control-inner'}>
            {messages().map(message => {
                return (
                    <div class="message">
                        <div class="message-role">{message.role == "assistant" ? "AI" : "You"}</div>
                        <div class="message-content">{message.role === "user" ? message.content : constructMessage(message.tokens)}</div>
                    </div>
                );
            })}
        </div>
     </div>
    );
}

export default Chat;