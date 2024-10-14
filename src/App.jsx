import { useEffect, useState } from "react";
import SideBar from "./components/sidebar/sidebar";
import Header from "./components/header/header";
import { useUser } from "@clerk/clerk-react";
import ChatBox from "./components/chatBoxMain/chatBoxMain";
import "./App.css";

function App() {
  const { isSignedIn, user } = useUser();
  const [chatName, setChatName] = useState("Name Chat");
  const [recentChats, setRecentChats] = useState([]);
  const [savedChats, setSavedChats] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch("https://jarvisbotai-41a438a5d58f.herokuapp.com/userData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }),
      });

      const data = await response.json();
      if (data.ok) {
        console.log(data);
        setRecentChats(data.chatHistory);
        setSavedChats(data.savedChats);
        setChatName(data.chatName);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const saveChat = async () => {
    try {
      const response = await fetch("https://jarvisbotai-41a438a5d58f.herokuapp.com/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, title: chatName }),
      });
  
      const savedChatData = await response.json();
      console.log(savedChatData)
      if (savedChatData.ok) {
        setSavedChats((prevSavedChats) => [
          ...prevSavedChats,
          { _id: savedChatData.id, title: chatName, description: savedChatData.description },
        ]);
      } else {
        console.error("Error saving chat:", savedChatData.message);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  useEffect(() => {
    if (!isSignedIn) {
      setIsSidebarVisible(false);
    } else {
      setIsSidebarVisible(true);
      fetchUserData();
    }
  }, [isSignedIn, user]);

  const handleChatSave = (e) => {
    e.preventDefault();
    saveChat();
  };

  function handleChatName(e) {
    if (e.target.value.length > 0) {
      setChatName(e.target.value);
    }
  }

  return (
    <>
      <div className="App">
        <SideBar
          user={user}
          setChatName={setChatName}
          setRecentChats={setRecentChats}
          setSavedChats={setSavedChats}
          savedChat={savedChats}
          isSidebarVisible={isSidebarVisible}
          setIsSidebarVisible={setIsSidebarVisible}
        />
        <div className={`chatBox ${isSidebarVisible ? "" : "expanded"}`}>
          <div className="Header">
            <div className="nameChatContainer">
              <div>
                <svg
                  onClick={isSignedIn ? toggleSidebar : ""}
                  width="20px"
                  height="20px"
                  viewBox="-3.2 -3.2 22.40 22.40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  transform={`rotate(${isSidebarVisible ? "0" : "180"})`}
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
                      d="M8.70714 13.2929L3.41424 8.00001L8.70714 2.70712L7.29292 1.29291L0.585815 8.00001L7.29292 14.7071L8.70714 13.2929Z"
                      fill="#c2c2c2"
                    ></path>{" "}
                    <path
                      d="M15.2071 13.2929L9.91424 8.00001L15.2071 2.70712L13.7929 1.29291L7.08582 8.00001L13.7929 14.7071L15.2071 13.2929Z"
                      fill="#c2c2c2"
                    ></path>{" "}
                  </g>
                </svg>
              </div>
              <form
                onSubmit={(e) => {
                  handleChatSave(e);
                }}
                className="nameChat"
              >
                <input
                  onChange={(e) => handleChatName(e)}
                  className="nameChat"
                  placeholder={chatName}
                />
              </form>
              <div className="gptVersion">
                <p>JARVIS 5.0</p>
              </div>
            </div>
            <Header />
          </div>

          <ChatBox
            recentChats={recentChats}
            user={user}
            setIsSidebarVisible={setIsSidebarVisible}
          />
        </div>
      </div>
    </>
  );
}

export default App;
