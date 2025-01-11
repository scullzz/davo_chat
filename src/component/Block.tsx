import React, { useState } from "react";

interface ChatRoom {
  id: number;
  name: string;
  members: number;
  content: string;
}

interface BlockProps {
  chatRooms: ChatRoom[];
  onSelectChatRoom: (chatRoom: ChatRoom) => void;
  selectedChatRoomId: number | null; // ID of the selected chat room
}

const Block: React.FC<BlockProps> = ({
  chatRooms,
  onSelectChatRoom,
  selectedChatRoomId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

  const handleAddRoom = () => {
    if (newRoomName.trim()) {
      console.log("Room Created:", newRoomName);
      // Add your API call or logic here to save the new room
      setIsModalOpen(false);
      setNewRoomName("");
    } else {
      alert("Please enter a room name");
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
                selectedChatRoomId === chatRoom.id ? "#007BFF" : "#fff", // Change background for selected room
              color: selectedChatRoomId === chatRoom.id ? "#fff" : "#000", // Adjust text color
            }}
          >
            <h3 style={{ margin: "0 0 10px" }}>{chatRoom.name}</h3>
            <p style={{ margin: "0" }}>
              Members: <strong>{chatRoom.members}</strong>
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
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
            <input
              type="text"
              placeholder="Room Name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              style={{
                width: "90%", // Уменьшена ширина, чтобы инпут не касался краёв
                padding: "10px", // Унифицированное поле сверху, снизу, справа, слева
                margin: "10px auto", // Отступы сверху и снизу, центрирование по горизонтали
                border: "1px solid #ddd",
                borderRadius: "5px",
                display: "block", // Центрирует инпут внутри контейнера
              }}
            />

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
