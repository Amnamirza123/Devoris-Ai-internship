import "./Sidebar.css";

export default function Sidebar(){

    const chats=[
        "Explain AI",
        "Python Notes",
        "Resume Review",
        "Machine Learning",
        "FastAPI"
    ];

    return(
        <div className="sidebar">

            <button className="new-chat">
                + New Chat
            </button>

            <h4>Recent Chats</h4>

            {chats.map((chat,index)=>(
                <div className="chat-item" key={index}>
                    {chat}
                </div>
            ))}

        </div>
    )
}