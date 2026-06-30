import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  groups: [],
  activeTab: "chats",
  selectedUser: null,
  selectedGroup: null,
  isCreateGroupModalOpen: false,
  isUsersLoading: false,
  isMessagesLoading: false,
  isGroupInfoModalOpen: false,
  isAddMembersModalOpen: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  setSelectedGroup: (selectedGroup) => set({ selectedGroup }),

  setCreateGroupModalOpen: (value) =>
  set({ isCreateGroupModalOpen: value }),

  setGroupInfoModalOpen: (value) =>
  set({ isGroupInfoModalOpen: value }),

  setAddMembersModalOpen: (value) =>
  set({ isAddMembersModalOpen: value }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  createGroup: async (groupData) => {
  try {
    const res = await axiosInstance.post("/groups/create", groupData);
       await get().getGroups();

    toast.success("Group created successfully!");

    return res.data;
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to create group"
    );
    return null;
  }
},

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getGroups: async () => {
  try {
    const res = await axiosInstance.get("/groups");
    set({ groups: res.data });
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to load groups"
    );
  }
},

   getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  getGroupMessages: async (groupId) => {
  set({ isMessagesLoading: true });

  try {
    const res = await axiosInstance.get(`/group-messages/${groupId}`);
    set({ messages: res.data });
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to load group messages"
    );
  } finally {
    set({ isMessagesLoading: false });
  }
},

  sendMessage: async(messageData) => {
    const {selectedUser, messages} = get();
    const {authUser} = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`

    const optimisticMessage = {
      _id: tempId,
      senderId:authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    }
    set({messages: [...messages, optimisticMessage]});

    try{
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({messages: messages.concat(res.data)});
    }catch (error){
      set({messages:messages});
      toast.error(error.response?.data?.message || "Something went wrong");
  }
  },

  sendGroupMessage: async (messageData) => {
  const { selectedGroup, messages } = get();
  const { authUser } = useAuthStore.getState();

  const tempId = `temp-${Date.now()}`;

  const optimisticMessage = {
    _id: tempId,
    senderId: authUser._id,
    groupId: selectedGroup._id,
    text: messageData.text,
    image: messageData.image,
    createdAt: new Date().toISOString(),
    isOptimistic: true,
  };

  set({ messages: [...messages, optimisticMessage] });

  try {
    const res = await axiosInstance.post(
      `/group-messages/send/${selectedGroup._id}`,
      messageData
    );

    set({
      messages: messages.concat(res.data),
    });
  } catch (error) {
    set({ messages });

    toast.error(
      error.response?.data?.message || "Failed to send message"
    );
  }
},
  
  subscribeToMessages: () => {
    const {selectedUser, isSoundEnabled} = get();
    if(!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if(!isMessageSentFromSelectedUser) return;

      const currentMessages = get().messages
      set({messages: [...currentMessages, newMessage]});

      if(isSoundEnabled){
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime=0;
        notificationSound.play().catch((e) => console.log("Audio play failed", e));
      }
    })
  },

  subscribeToGroupMessages: () => {
  const { selectedGroup, isSoundEnabled } = get();

  if (!selectedGroup) return;

  const socket = useAuthStore.getState().socket;

  socket.on("newGroupMessage", (newMessage) => {
  const messageGroupId =  newMessage.groupId._id || newMessage.groupId;
  if (messageGroupId !== selectedGroup._id) return;

    const currentMessages = get().messages;

    set({
      messages: [...currentMessages, newMessage],
    });

    if (isSoundEnabled) {
      const notificationSound = new Audio("/sounds/notification.mp3");
      notificationSound.currentTime = 0;
      notificationSound.play().catch(() => {});
    }
  });
},

  unsubscribeFromMessages: ()=> {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("newGroupMessage");
  },

  addMembersToGroup: async (groupId, members) => {
  try {
    const res = await axiosInstance.patch(
      `/groups/${groupId}/add-members`,
      { members }
    );

    // Update selected group immediately
    set({ selectedGroup: res.data });

    // Refresh group list
    await get().getGroups();

    toast.success("Members added successfully!");

    return res.data;
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to add members"
    );
  }
},

leaveGroup: async (groupId) => {
  try {
    await axiosInstance.patch(`/groups/${groupId}/leave`);

    await get().getGroups();

    set({
      selectedGroup: null,
      messages: [],
    });

    toast.success("You left the group");

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to leave group"
    );
  }
},
}));