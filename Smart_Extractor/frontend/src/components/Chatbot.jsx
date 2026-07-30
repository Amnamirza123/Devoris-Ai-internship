import { useState } from "react";
import "./chatbot.css";
import ReactMarkdown from "react-markdown";

function Chatbot() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sessionId] = useState(() => crypto.randomUUID());


  async function handleSend() {

    if (!message.trim() || loading) return;

    const userText = message;

    setMessage("");
    setLoading(true);


    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userText
      },
      {
        role: "assistant",
        content: ""
      }
    ]);


    try {

      const response = await fetch(
        "http://127.0.0.1:8000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            session_id: sessionId,
            message: userText,
            system_prompt:
              "You are a helpful AI assistant. Give clear and concise answers."
          })
        }
      );


      if (!response.ok) {
        throw new Error(
          "Server error " + response.status
        );
      }


      const reader = response.body.getReader();
      const decoder = new TextDecoder();


      while (true) {

        const {done, value} = await reader.read();


        if (done) break;


        const chunk = decoder.decode(
          value,
          {
            stream: true
          }
        );


        setMessages((prev)=>{

          const updated = [...prev];

          updated[updated.length - 1] = {
            role:"assistant",
            content:
              updated[updated.length - 1].content + chunk
          };

          return updated;

        });

      }


    } catch(error){

      console.log(error);


      setMessages((prev)=>{

        const updated=[...prev];

        updated[updated.length-1]={
          role:"assistant",
          content:"Error: "+error.message
        };

        return updated;

      });


    } finally {

      setLoading(false);

    }

  }



  return (

    <div className="chat-container">


      <div className="messages">

        {messages.map((msg,index)=>(

          <div
            key={index}
            className={
              msg.role==="user"
              ? "message user"
              : "message assistant"
            }
          >

            <ReactMarkdown>
              {msg.content}
            </ReactMarkdown>

          </div>

        ))}


        {loading && (
          <div className="message assistant">
            Thinking...
          </div>
        )}


      </div>



      <div className="input-area">

        <textarea
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          placeholder="Ask something..."
        />


        <button
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Send"}
        </button>


      </div>


    </div>

  );

}


export default Chatbot;