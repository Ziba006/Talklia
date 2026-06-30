import React from 'react'
import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore';
import {  ArrowLeft } from "lucide-react";

function ChatHeader() {
    const {
    selectedUser,
    selectedGroup,
    setSelectedUser,
    setSelectedGroup,
  } = useChatStore();

    const { onlineUsers } = useAuthStore();

    const isOnline = selectedUser
      ? onlineUsers.includes(selectedUser._id)
      : false;

      const chatInfo = selectedUser
  ? {
      name: selectedUser.fullName,
      image: selectedUser.profilePic,
    }
  : {
      name: selectedGroup?.name,
        image: selectedGroup?.image,
    };

    useEffect(() =>{
     
      const handleEscKey = (event) =>{
        if(event.key === "Escape")  {
        setSelectedUser(null);
        setSelectedGroup(null);
      };
      }
      window.addEventListener("keydown", handleEscKey)

      return()=> window.removeEventListener("keydown", handleEscKey)
    }, [setSelectedUser, setSelectedGroup])

  return (
    <div className="sticky top-0 z-20 flex justify-between items-center bg-green-900/90 backdrop-blur-md border-b border-slate-700/50 px-3 md:px-6 py-3 md:py-4">
      <div className="flex items-center space-x-3">
        <div className={`avatar ${isOnline ? "online": "offline"}`}>
        <div className="w-12 md:w-12 rounded-full overflow-hidden">
  <img
    src={chatInfo.image || (selectedGroup ? "/groupavatar.jpg" : "/avatar.png")}
    alt={chatInfo.name}
    className="w-full h-full object-cover"
  />
</div>
        </div>
      <div  className="min-w-0">
        <h3 className="text-slate-200 font-medium text-sm md:text-base truncate">{chatInfo.name}</h3>
        <p className="text-slate-400 text-xs md:text-sm">{selectedUser ? (isOnline ? "Online" : "Offline") : "Group"}</p>
        </div>
     </div>

        <button
        onClick={() => {
      setSelectedUser(null);
      setSelectedGroup(null);
}}
       className="md:hidden p-2 rounded-full hover:bg-green-800 transition"
      >
        <ArrowLeft size={22} />
      </button>
    </div>
  )
}

export default ChatHeader
