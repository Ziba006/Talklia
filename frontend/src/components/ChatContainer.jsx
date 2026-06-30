import React from "react";
import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader.jsx";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder.jsx";
import MessageInput from "./MessageInput.jsx";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton.jsx";

function ChatContainer() {
  const {
    selectedUser,
    selectedGroup,
    messages,
    getMessagesByUserId,
    getGroupMessages,
    isMessagesLoading,
    subscribeToMessages,
    subscribeToGroupMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      getMessagesByUserId(selectedUser._id);
      subscribeToMessages();
    }

    if (selectedGroup) {
      getGroupMessages(selectedGroup._id);

      const socket = useAuthStore.getState().socket;

      socket.emit("joinGroup", selectedGroup._id);

      subscribeToGroupMessages();
    }

    return () => {
      if (selectedGroup) {
        const socket = useAuthStore.getState().socket;
        socket.emit("leaveGroup", selectedGroup._id);
      }

      unsubscribeFromMessages();
    };
  }, [
    selectedUser,
    selectedGroup,
    getMessagesByUserId,
    getGroupMessages,
    subscribeToMessages,
    subscribeToGroupMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full min-h-0">
      <ChatHeader />
      <div className="flex-1 min-h-0 px-3 md:px-6 py-4 md:py-8 overflow-y-auto">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
            {messages.map((msg) => {
              const isMine =
                String(msg.senderId?._id || msg.senderId) ===
                String(authUser._id);

              return (
                <div
                  key={msg._id}
                  className={`chat ${isMine ? "chat-end" : "chat-start"}`}
                >
                  <div
                    className={`chat-bubble relative  max-w-[80%] md:max-w-md ${
                      isMine
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-800 text-slate-200"
                    }`}
                  >
                    {selectedGroup && !isMine && (
                      <p className="text-xs font-semibold text-cyan-300 mb-1">
                        {msg.senderId.fullName}
                      </p>
                    )}
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Shared"
                        className="rounded-lg h-40 md:h-48 w-full object-cover"
                      />
                    )}
                    {msg.text && (
                      <p className="mt-2 text-sm md:text-base">{msg.text}</p>
                    )}
                    <p className="text-[10px] md:text-xs mt-1 opacity-75 flex items-center gap-1">
                      {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef}></div>
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder
            name={selectedUser?.fullName || selectedGroup?.name}
          />
        )}
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer;
