import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversation, messageReceived, clearMessages } from "../redux/chatSlice";
import { initSocket, getSocket } from "../services/socket";
import { useAuth } from "../hooks/useAuth";

export default function Chat() {
  const { userId: otherUserId } = useParams();
  const dispatch = useDispatch();
  const { token, user } = useAuth();
  const { messages } = useSelector((state) => state.chat);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    dispatch(clearMessages());
    dispatch(fetchConversation(otherUserId));

    const socket = initSocket(token);
    socket.emit("join-room", { otherUserId });

    socket.on("receive-message", (msg) => {
      dispatch(messageReceived(msg));
    });

    socket.on("typing", ({ senderId }) => {
      if (senderId === otherUserId) setIsTyping(true);
    });
    socket.on("stop-typing", ({ senderId }) => {
      if (senderId === otherUserId) setIsTyping(false);
    });

    return () => {
      socket.off("receive-message");
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, [otherUserId, dispatch, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const socket = getSocket();
    socket.emit("send-message", { receiverId: otherUserId, message: text });
    socket.emit("stop-typing", { receiverId: otherUserId });
    setText("");
  };

  const handleChange = (e) => {
    setText(e.target.value);
    const socket = getSocket();
    socket.emit("typing", { receiverId: otherUserId });
    clearTimeout(window.__typingTimeout);
    window.__typingTimeout = setTimeout(() => {
      socket.emit("stop-typing", { receiverId: otherUserId });
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col h-[80vh]">
      <div className="bg-white border border-gray-100 rounded-t-xl px-5 py-3 shadow-sm">
        <p className="font-semibold text-gray-800">Private Session Chat</p>
        {isTyping && <p className="text-xs text-primary-600">typing...</p>}
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 border-x border-gray-100 px-5 py-4 space-y-3">
        {messages.map((m) => {
          const mine = m.senderId === user?.id || m.senderId?._id === user?.id;
          return (
            <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                  mine ? "bg-primary-600 text-white" : "bg-white border border-gray-200 text-gray-800"
                }`}
              >
                {m.message}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="bg-white border border-gray-100 rounded-b-xl p-3 shadow-sm flex gap-2">
        <input
          value={text}
          onChange={handleChange}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="submit"
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-full text-sm font-medium transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
