import React from 'react'
import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore.js';
import BorderAnimatedContainer from '../components/BorderAnimatedContainer.jsx';

import ProfileHeader from '../components/ProfileHeader.jsx';
import ActiveTabSwitch from '../components/ActiveTabSwitch.jsx';
import ChatList from '../components/ChatList.jsx';
import ContactList from '../components/ContactList.jsx';
import ChatContainer from '../components/ChatContainer.jsx';
import NoConversationPlaceholder from '../components/NoConversationPlaceholder.jsx';
import CreateGroupModal from "../components/CreateGroupModal.jsx";
import { UsersRound } from "lucide-react";

function ChatPage() {
  const {
  activeTab,
  selectedUser,
  selectedGroup,
  setCreateGroupModalOpen,
  getGroups,
} = useChatStore();

useEffect(() => {
  getGroups();
}, []);

  return (
  <div className="relative w-full max-w-6xl h-[calc(100vh-2rem)] md:h-[800px]">

  <BorderAnimatedContainer>
  <div className="flex w-full h-full overflow-hidden rounded-xl">

    {/* Left side */}
  <div
  className={`
    ${
      selectedUser  || selectedGroup
        ? "hidden md:flex"
        : "flex"
    }
    w-full md:w-80
    bg-green-950/80
    backdrop-blur-sm
    flex-col
  `}
>
  <ProfileHeader />
  <ActiveTabSwitch />


<div className="px-4 pt-4">
 <button
  onClick={() => setCreateGroupModalOpen(true)}
  className="w-full rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 transition p-3 flex items-center justify-center gap-2 text-cyan-300 font-medium"
>
  <UsersRound size={20} />
  Create Group
</button>
</div>

  <div className="flex-1 overflow-y-auto p-4 space-y-2">
    {activeTab === "chats" ? <ChatList /> : <ContactList />}
  </div>
</div>

    {/* Right side */}
   <div
  className={`
    ${
      selectedUser  || selectedGroup
        ? "flex"
        : "hidden md:flex"
    }
    flex-1
    flex-col
    bg-[#0f1a14]/60
    backdrop-blur-sm
  `}
>
  {selectedUser  || selectedGroup ? <ChatContainer /> : <NoConversationPlaceholder />}
</div>
  </div>
</BorderAnimatedContainer>

<CreateGroupModal />
   </div>
  )
}

export default ChatPage
