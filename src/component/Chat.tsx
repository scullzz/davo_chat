import React, { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";

export interface GetAllMessagesResponse {
  success: boolean;
  data: {
    activeChat: ActiveChat[];
    messages: Message[];
  };
  timestamp: string;
  error: string | null;
  pagination: Pagination | null;
}

export interface ActiveChat {
  id: string;
  topicId: string;
  status: string;
  clientId: string;
  operatorId: string;
  consultationId: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedBy: string | null;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface Message {
  id: string;
  content: string;
  fileId: string | null;
  chatId: string;
  repliedMessageId: string | null;
  tgMsgId: string | null;
  authorId: string;
  firstname: string | null;
  lastname: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedBy: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  author: Author;
  repliedMessage: Message | null; // Recursive relationship for replied messages
  file: File | null; // Assuming file structure exists
}

export interface Author {
  id: string;
  approvedAt: string | null;
  blockedAt: string | null;
  shiftStatus: string | null;
  telegramId: string | null;
  username: string | null;
  kcUserId: string | null;
  email: string | null;
  phone: string;
  firstname: string | null;
  lastname: string | null;
  userId: string;
  doctorId: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedBy: string | null;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
}

export interface NewMessageRequest {
  content: string;
  consultationId: string;
}

const chatId = "678131707b89f45207cf3b9a";
const consultId = "ee7b97e2-6bee-4d06-b5c6-e2de644f44eb";
const jwt =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MmIzYjJkYTQ4MDg5MWNhYjdlMTY3NyIsImlzX3ZlcmlmaWVkIjpmYWxzZSwiY3JlYXRlZF9hdCI6IjIwMjQtMTEtMDZUMDk6NDc6MjUuMTg4WiIsInJvbGUiOiJ1c2VyIiwiaXNfZGVsZXRlZCI6ZmFsc2UsImNyZWF0ZWRfYnkiOm51bGwsImxhbmciOm51bGwsInBob25lX251bWJlciI6Ijk5ODkwOTkyMzEyNiIsImZpcnN0X25hbWUiOm51bGwsImxhc3RfbmFtZSI6bnVsbCwiYmlydGhfZGF0ZSI6bnVsbCwiZmlsZV9wYXRoIjpudWxsLCJ2ZXJpZmljYXRpb25fYXR0ZW1wdCI6IjEiLCJibG9ja2VkX2F0IjpudWxsLCJhdHRlbXB0X2NvdW50IjowLCJnZW5kZXIiOm51bGwsImJsb29kX2dyb3VwX2lkIjpudWxsLCJwYXNzd29yZCI6IiQyYiQxMCRrdFp4Q0dheldiVUVpSWJBZzJ3UzZPdkRpMDZWL2QydndPdlhJWnZ1U2lKZHhTMkJLSzNIMiIsImlhdCI6MTczMDg4NjQ3OH0.jxXgva6skpliWDcmcaiFc3kfbTe_Vwto5QqQ9CCnjqM";
const socket: Socket = io("http://10.10.12.70:3000", {
  extraHeaders: {
    authorization: jwt,
  },
  query: {
    chatId,
    consultation: consultId,
  },
});

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");

  const getAllMessages = async (): Promise<void> => {
    try {
      const response = await fetch(
        "http://10.10.12.70:3000/api/chat/all-messages?limit=10&page=1",
        {
          headers: {
            Authorization: jwt,
            "Content-Type": "application/json",
          },
        }
      );
      const obj: GetAllMessagesResponse = await response.json();
      setMessages(obj.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    const handleMessage = () => {
      //  console.log("ishlaid wqqqqqqq");

      //  setMessages((prevMessages) => [...prevMessages, newMessage]);
      getAllMessages();
    };

    socket.on("connect", () => {
      console.log("Socker connect");
    });

    socket.on("chat", handleMessage);

    getAllMessages();
  }, []);

  const sendMessage = async (): Promise<void> => {
    if (!message) return;

    const newMessage: NewMessageRequest = {
      content: message,
      consultationId: consultId,
    };

    try {
      await fetch("http://10.10.12.70:3000/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt,
        },
        body: JSON.stringify(newMessage),
      });
      await getAllMessages();
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Chat</h1>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
      <ul style={styles.messageList}>
        {messages.map((msg, index) => (
          <li key={index} style={styles.messageItem}>
            <strong>
              {msg.author?.firstname + " " + msg.author?.lastname}
            </strong>
            : {msg.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    color: "#333",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  messageList: {
    listStyleType: "none",
    padding: 0,
    marginTop: "20px",
  },
  messageItem: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  image: {
    marginTop: "10px",
    maxWidth: "100px",
    borderRadius: "5px",
  },
};

export default Chat;
