import React, { useState } from "react";

interface ChatRoom {
  chatId: string;
  createdAt: string;
  id: string;
  operatorId: string;
  status: number;
  userId: string;
}

interface BlockProps {
  chatRooms: ChatRoom[];
  onSelectChatRoom: (chatRoom: ChatRoom) => void;
  onGetAll: () => void;
  selectedChatRoomId: string | null; // ID of the selected chat room
}

const Block: React.FC<BlockProps> = ({
  chatRooms,
  onSelectChatRoom,
  onGetAll,
  selectedChatRoomId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddRoom = async () => {
    try {
      const response = await fetch("http://10.10.12.62:5001/api/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")?.toString() || "",
        },
        body: JSON.stringify({}), // Ваши данные
      });

      // response.ok === false при статусе 400, 500 и т.п.
      if (!response.ok) {
        // Можно вывести дополнительную информацию об ошибке
        const errorMessage = await response.text();
        alert(`Ошибка: ${response.status} ${errorMessage}`);
        return;
      }

      // Если всё хорошо:
      onGetAll();
      setIsModalOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(String(error));
      }
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Chat Rooms</h1>
        <button
          style={{
            backgroundColor: "#007BFF",
            color: "white",
            padding: "10px 8px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setIsModalOpen(true)} // Open the modal
        >
          Add Room
        </button>
      </div>

      <div>
        {chatRooms.map((chatRoom) => (
          <div
            key={chatRoom.id}
            onClick={() => onSelectChatRoom(chatRoom)} // Handle click to select chat room
            style={{
              border: "1px solid #ddd",
              borderRadius: "5px",
              padding: "10px",
              margin: "10px 0",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              backgroundColor:
                selectedChatRoomId === chatRoom.chatId ? "#007BFF" : "#fff", // Change background for selected room
              color: selectedChatRoomId === chatRoom.chatId ? "#fff" : "#000", // Adjust text color
            }}
          >
            <h3 style={{ margin: "0 0 10px" }}>{chatRoom.chatId}</h3>
            <p style={{ margin: "0" }}>
              Operator: <strong>{chatRoom.operatorId}</strong>
              User: <strong>{chatRoom.userId}</strong>
            </p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "5px",
              width: "400px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2>Create New Room</h2>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#ddd",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddRoom}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#007BFF",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Block;
