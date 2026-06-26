import React from 'react'
import { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore';
import ChatHeader from "./ChatHeader.jsx";
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder.jsx';
import MessageInput from './MessageInput.jsx';
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton.jsx';

function ChatContainer() {

  const {selectedUser, messages, getMessagesByUserId, isMessagesLoading, subscribeToMessages, unsubscribeFromMessages} = useChatStore();

  const {authUser} = useAuthStore();
   const messageEndRef = useRef(null);

useEffect(()=>{
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    return()=> unsubscribeFromMessages();

}, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

useEffect(()=>{
  if(messageEndRef.current){
    messageEndRef.current.scrollIntoView({behavior: "smooth"});
  }
},[messages]);

  return (
    
    <div className="flex flex-col h-full">
    <ChatHeader/>
    <div className="flex-1 px-3 md:px-6 py-4 md:py-8 overflow-y-auto">
      {messages.length > 0 && !isMessagesLoading? (
     <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
        {messages.map(msg => (
          <div key={msg._id}
            className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            >
               <div
                  className={`chat-bubble relative  max-w-[80%] md:max-w-md ${
                    msg.senderId === authUser._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img src={msg.image} alt="Shared"  className="rounded-lg h-40 md:h-48 w-full object-cover" />
                  )}
                  {msg.text && <p className="mt-2 text-sm md:text-base">{msg.text}</p>}
              <p className="text-[10px] md:text-xs mt-1 opacity-75 flex items-center gap-1">
                       {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                   </p>
                  </div>
            </div>
        ))}
        <div ref={messageEndRef}></div>

      </div>): isMessagesLoading ? <MessagesLoadingSkeleton/> :
      (< NoChatHistoryPlaceholder name={selectedUser.fullName}/>)}
    </div>

    <MessageInput/>
    </div>

 
  )
}

export default ChatContainer
