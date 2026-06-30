import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UserLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const {
  getMyChatPartners,
  getGroups,
  chats,
  groups,
  isUsersLoading,
  setSelectedUser,
  setSelectedGroup,
} = useChatStore();
  const { onlineUsers } = useAuthStore();

useEffect(() => {
  getMyChatPartners();
  getGroups();
}, [getMyChatPartners, getGroups]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0 && groups.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
         onClick={() => {
  setSelectedUser(chat);
  setSelectedGroup(null);
}}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"}`}>
              <div className="size-12 rounded-full">
                <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">{chat.fullName}</h4>
          </div>
        </div>
      ))}

      {groups.map((group) => (
  <div
    key={group._id}
    className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
   onClick={() => {
  setSelectedUser(null);
  setSelectedGroup(group);
}}
  >
    <div className="flex items-center gap-3">
   <div className="size-12 rounded-full overflow-hidden">
  <img
    src={group.image || "/groupavatar.jpg"}
    alt={group.name}
    className="w-full h-full object-cover"
  />
</div>

      <h4 className="text-slate-200 font-medium truncate">
        {group.name}
      </h4>
    </div>
  </div>
))}
    </>
  );
}
export default ChatsList;
