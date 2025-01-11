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
  author?: Author;
  repliedMessage: Message | null; // Recursive relationship for replied messages
  file: File | null; // Assuming file structure exists
}

export interface Author {
  id?: string;
  approvedAt?: string | null;
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
  messages: Message[];
  consultationId: string;
}

export interface ChatProps {
  selectedChatRoom: string | null; // Accept number or null for selectedChatRoom
}

const Chat: React.FC<ChatProps> = ({ selectedChatRoom }) => {
  // const chatId = "678131707b89f45207cf3b9a";
  const chatId = selectedChatRoom;
  console.log(chatId);
  const consultId = localStorage.getItem("consultId")?.toString() || "";
  const jwt = localStorage.getItem("token")?.toString() || "";
  const socket: Socket = io("http://10.10.12.62:3000", {
    extraHeaders: {
      authorization: jwt,
    },
    query: {
      chatId: chatId,
      consultation: consultId,
    },
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");

  const getAllMessages = async (): Promise<void> => {
    try {
      const response = await fetch(
        "http://10.10.12.62:3000/api/chat/all-messages?limit=10&page=1",
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
      console.log("YES");
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
      consultationId: consultId,
      messages: [
        {
          content: message,
          id: "",
          fileId: null,
          chatId: chatId || "",
          repliedMessageId: null,
          tgMsgId: null,
          authorId: "",
          firstname: null,
          lastname: null,
          isDeleted: false,
          deletedAt: null,
          createdAt: "",
          updatedAt: "",
          deletedBy: null,
          createdBy: null,
          updatedBy: null,
          author: undefined,
          repliedMessage: null,
          file: null,
        },
      ],
    };

    try {
      await fetch("http://10.10.12.62:3000/api/chat/message", {
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
