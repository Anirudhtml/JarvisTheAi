import React from "react";
import "./chatDropBox.css";

function ChatDropBox({ setRecentChats, user, setSavedChats, savedChat }) {
  const truncateContent = (content, wordLimit = 15) => {
    const words = content.split(" ");
    if (words.length <= wordLimit) {
      return content;
    }
    return words.slice(0, wordLimit).join(" ") + "..."; 
  };

  const hanldeChatDisplay = async (id) => {
    try {
      const response = await fetch("https://jarvisbotai-41a438a5d58f.herokuapp.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: id, user }),
      });

      const data = await response.json();
      setRecentChats(data.chat.chats);
    } catch (err) {
      console.log("error occured while resetinfg the chat", err);
    }
  };

  const handleChatDelete = async (id) => {
    try {
      const response = await fetch("https://jarvisbotai-41a438a5d58f.herokuapp.com/chat/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: id, user }),
      });

      if (response.ok) {
        const updatedChats = savedChat.filter((chat) => chat._id !== id);
        setSavedChats(updatedChats);
      }
    } catch (err) {
      console.log("error occured while resetinfg the chat", err);
    }
  };

  return (
    <>
      {savedChat.map((chat) => (
        <div className="chatDropBox">
          <div
            onClick={() => handleChatDelete(chat._id)}
            className="deleteIconContainer"
          >
            <svg
              width="30px"
              height="20px"
              viewBox="-1.92 -1.92 27.84 27.84"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M21.0039 12C21.0039 16.9706 16.9745 21 12.0039 21H3.00463C3.00463 21 4.56382 17.2561 3.93982 16.0008C3.34076 14.7956 3.00391 13.4372 3.00391 12C3.00391 7.02944 7.03334 3 12.0039 3M20.1213 3.87868C21.2929 5.05025 21.2929 6.94975 20.1213 8.12132C18.9497 9.29289 17.0503 9.29289 15.8787 8.12132C14.7071 6.94975 14.7071 5.05025 15.8787 3.87868C17.0503 2.70711 18.9497 2.70711 20.1213 3.87868Z"
                  stroke="#ffffff"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </div>
          <div
            onClick={() => hanldeChatDisplay(chat._id)}
            className="savedChatContent"
          >
            <div className="chatTitle">
              <span>{chat.title}</span>
              <span id="subtitle">
                {chat.chats ? truncateContent(chat.chats[1].content) : chat.description}
              </span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default ChatDropBox;
