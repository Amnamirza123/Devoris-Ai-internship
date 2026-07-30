import { useState } from "react";
import "./Chatbot.css";
import ReactMarkdown from "react-markdown";

function Chatbot() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [tokenCount, setTokenCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [sessionId] = useState(() => crypto.randomUUID());


  async function handleSend() {

    if (!message.trim() || loading) return;


    const userText = message;


    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userText,
      },
    ]);


    setMessage("");
    setLoading(true);


    // create assistant message
    const assistantMessage = {
      role: "assistant",
      content: "",
    };


    setMessages((prev) => [
      ...prev,
      assistantMessage,
    ]);


    try {

      const response = await fetch(
        "https://smart-extractor-esws.onrender.com/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            session_id: sessionId,
            message: userText,
            system_prompt:
              "You are a helpful AI assistant. Give clear and concise answers.",
          }),
        }
      );


      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }


      const reader = response.body.getReader();

      const decoder = new TextDecoder("utf-8");


      while (true) {

        const { done, value } = await reader.read();


        if (done) break;


        const chunk = decoder.decode(
          value,
          {
            stream: true,
          }
        );


        setMessages((prev) => {

          const updated = [...prev];


          const lastIndex = updated.length - 1;


          if (
            updated[lastIndex].role === "assistant"
          ) {

            updated[lastIndex] = {
              ...updated[lastIndex],
              content:
                updated[lastIndex].content + chunk,
            };

          }


          return updated;

        });


        setTokenCount(
          (prev) =>
            prev + Math.ceil(chunk.length / 4)
        );

      }


    } catch (error) {


      console.error(
        "Chat Error:",
        error
      );


      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Error: " + error.message,
        },
      ]);


    } finally {

      setLoading(false);

    }

  }



  function handleKeyDown(e) {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      handleSend();

    }

  }



  return (

    <div className="chat-container">


      <div className="chat-header">


        <div className="brand">

          <span className="status-dot"></span>

          Smart Extractor AI

        </div>



        <div className="tokens">

          {tokenCount} tokens

        </div>


      </div>



      <div className="messages">


        {
          messages.length === 0 && (

            <div className="welcome">

              <h2>
                Smart Extractor
              </h2>

              <p>
                Ask anything and get a streamed AI response.
              </p>

            </div>

          )
        }



        {
          messages.map(
            (msg, index) => (

              <div
                key={index}
                className={
                  msg.role === "user"
                  ? "message user"
                  : "message assistant"
                }
              >


                {
                  loading &&
                  index === messages.length - 1 &&
                  msg.role === "assistant"

                  ?

                  <div>
                    {msg.content}
                  </div>

                  :

                  <ReactMarkdown>
                    {msg.content}
                  </ReactMarkdown>

                }



                {
                  loading &&
                  index === messages.length - 1 &&
                  msg.role === "assistant" && (

                    <span className="cursor">
                      ▊
                    </span>

                  )
                }


              </div>

            )
          )
        }


      </div>




      <div className="input-area">


        <textarea

          value={message}

          onChange={
            (e)=>setMessage(e.target.value)
          }

          onKeyDown={handleKeyDown}

          placeholder="Ask something..."

          rows="1"

        />



        <button

          onClick={handleSend}

          disabled={
            loading ||
            !message.trim()
          }

        >

          {
            loading
            ?
            "Thinking..."
            :
            "Send"
          }


        </button>


      </div>



    </div>

  );

}


export default Chatbot;