import { useEffect, useState } from "react";
import "./App.css";
import Block from "./component/Block";
import Chat from "./component/Chat";

// Определяем интерфейс того, что возвращает API
interface ChatRoom {
  chatId: string;
  createdAt: string;
  id: string;
  operatorId: string;
  status: number;
  userId: string;
}

function App() {
  const [userData, setUserData] = useState<string>("");
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(
    null
  );

  // Запрос всех чатов
  const getAllRooms = async () => {
    try {
      const response = await fetch("https://dev.davoai.uz/api/consultation", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")?.toString() || "",
        },
      });

      if (response.ok) {
        const res = await response.json();
        console.log(res);
        setChatRooms(res);
      } else {
        console.log("Response was not OK:", response);
      }
    } catch (err) {
      console.log("Error fetching chat rooms:", err);
    }
  };

  // Запрос для получения токена на основе user_id
  const handleUser = async () => {
    try {
      const response = await fetch("https://dev.davoai.uz/api/auth/get-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userData }),
      });

      if (response.ok) {
        const res = await response.json();
        localStorage.setItem("token", "Bearer " + res.access_token);
      } else {
        console.log("Response was not OK:", response);
      }
    } catch (err) {
      console.log("Error fetching token:", err);
    }
  };

  // При первом рендере загружаем все чаты
  useEffect(() => {
    getAllRooms();
  }, []);

  // Когда получили массив чатов, по умолчанию выбираем первый, если ничего не выбрано
  useEffect(() => {
    if (chatRooms.length > 0 && !selectedChatRoom) {
      setSelectedChatRoom(chatRooms[0]);
      localStorage.setItem("consultId", chatRooms[0].id);
    }
  }, [chatRooms, selectedChatRoom]);

  const changeConsultId = (room: ChatRoom) => {
    setSelectedChatRoom(room);
    localStorage.setItem("consultId", room.id);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
      }}
    >
      {/* Блок ввода User ID + Assign */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <h3>Enter User ID</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            width: "100%",
          }}
        >
          <input
            type="text"
            placeholder="User ID"
            value={userData}
            onChange={(e) => setUserData(e.target.value)}
            style={{
              flex: "1",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          />
          <button
            onClick={handleUser}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              whiteSpace: "nowrap",
            }}
          >
            Assign
          </button>
        </div>
      </div>

      {/* Блок с чатами и самим чатом */}
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <Block
            chatRooms={chatRooms}
            onGetAll={getAllRooms}
            onSelectChatRoom={changeConsultId} // При клике выбираем чат
            selectedChatRoomId={selectedChatRoom?.chatId || null}
          />
        </div>
        <div style={{ flex: 2 }}>
          <Chat selectedChatRoom={selectedChatRoom?.chatId || null} />
        </div>
      </div>
    </div>
  );
}

export default App;
