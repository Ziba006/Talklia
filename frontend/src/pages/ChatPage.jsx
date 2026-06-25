import React from 'react'
import { useChatStore } from '../store/useChatStore.js';
import BorderAnimatedContainer from '../components/BorderAnimatedContainer.jsx';

import ProfileHeader from '../components/ProfileHeader.jsx';
import ActiveTabSwitch from '../components/ActiveTabSwitch.jsx';
import ChatList from '../components/ChatList.jsx';
import ContactList from '../components/ContactList.jsx';
import ChatContainer from '../components/ChatContainer.jsx';
import NoConversationPlaceholder from '../components/NoConversationPlaceholder.jsx';

function ChatPage() {
  const { activeTab } = useChatStore();
  const { selectedUser } = useChatStore();

  return (
  <div className="relative w-full max-w-6xl h-[calc(100vh-2rem)] md:h-[800px]">

  <BorderAnimatedContainer>
  <div className="flex w-full h-full overflow-hidden rounded-xl">

    {/* Left side */}
  <div
  className={`
    ${
      selectedUser
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

  <div className="flex-1 overflow-y-auto p-4 space-y-2">
    {activeTab === "chats" ? <ChatList /> : <ContactList />}
  </div>
</div>

    {/* Right side */}
   <div
  className={`
    ${
      selectedUser
        ? "flex"
        : "hidden md:flex"
    }
    flex-1
    flex-col
    bg-[#0f1a14]/60
    backdrop-blur-sm
  `}
>
  {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
</div>
  </div>
</BorderAnimatedContainer>

   </div>
  )
}

export default ChatPage
