import React, { useState } from "react";
import "./App.css";
import Block from "./component/Block";
import Chat from "./component/Chat";

interface ChatRoom {
  id: number;
  name: string;
  members: number;
  content: string;
}

function App() {
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(
    null
  );

  // Sample data for chat rooms
  const chatRooms: ChatRoom[] = [
    {
      id: 1,
      name: "General Chat",
      members: 10,
      content: "Welcome to General Chat!",
    },
    {
      id: 2,
      name: "Tech Talk",
      members: 25,
      content: "Discuss all things tech here.",
    },
    {
      id: 3,
      name: "Gaming Zone",
      members: 15,
      content: "Chat about your favorite games!",
    },
  ];

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      <div style={{ flex: 1 }}>
        <Block
          chatRooms={chatRooms}
          onSelectChatRoom={setSelectedChatRoom}
          selectedChatRoomId={selectedChatRoom?.id || null}
        />
      </div>
      <div style={{ flex: 2 }}>
        <Chat selectedChatRoom={selectedChatRoom?.id || null} />
      </div>
    </div>
  );
}

export default App;
