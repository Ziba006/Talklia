import { useState, useEffect, useRef} from "react";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { Users, Camera, X } from "lucide-react";

function CreateGroupModal() {
  const {
    isCreateGroupModalOpen,
    setCreateGroupModalOpen,
    allContacts,
    getAllContacts,
    createGroup,
  } = useChatStore();

  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupImage, setGroupImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isCreateGroupModalOpen) {
      getAllContacts();
    }
  }, [isCreateGroupModalOpen]);

  const handleCreateGroup = async () => {
  if (!groupName.trim()) {
    toast.error("Please enter a group name");
    return;
  }

  if (selectedMembers.length < 1) {
    toast.error("Select at least 2 members");
    return;
  }

  const group = await createGroup({
    name: groupName,
    members: selectedMembers,
     image: groupImage,
  });

  if (!group) return;

  setGroupName("");
  setSelectedMembers([]);
  setGroupImage(null);
  setCreateGroupModalOpen(false);
};

const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    toast.error("Please select an image");
    return;
  }

  const reader = new FileReader();

  reader.onloadend = () => {
    setGroupImage(reader.result);
  };

  reader.readAsDataURL(file);
};

const removeImage = () => {
  setGroupImage(null);

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};

  if (!isCreateGroupModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="w-[420px] max-h-[80vh] overflow-y-auto bg-[#10271e] rounded-xl p-6 border border-cyan-500/20">

        <h2 className="text-xl font-semibold mb-5"  >
          Create Group
        </h2>

<div className="flex justify-center mb-5">
  <div className="relative">

<div className="w-24 h-24 rounded-full border-2 border-cyan-500 overflow-hidden bg-slate-800">
  <img
    src={groupImage || "/groupavatar.jpg"}
    alt="Group Preview"
    className="w-full h-full object-cover"
  />
</div>

    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      className="absolute bottom-0 right-0 bg-cyan-600 rounded-full p-2 hover:bg-cyan-700"
    >
      <Camera size={18} />
    </button>

    {groupImage && (
      <button
        type="button"
        onClick={removeImage}
        className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1"
      >
        <X size={14} />
      </button>
    )}

    <input
      type="file"
      ref={fileInputRef}
      className="hidden"
      accept="image/*"
      onChange={handleImageChange}
    />
  </div>
</div>
        <input
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group name"
          className="w-full bg-slate-800 rounded-lg p-3 mb-5"
        />

        <h3 className="mb-3 text-slate-300">
          Select Members
        </h3>

      {allContacts.map((user) => (
  <label
    key={user._id}
    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 cursor-pointer"
  >
    <input
      type="checkbox"
      checked={selectedMembers.includes(user._id)}
      onChange={(e) => {
        if (e.target.checked) {
          setSelectedMembers([...selectedMembers, user._id]);
        } else {
          setSelectedMembers(
            selectedMembers.filter((id) => id !== user._id)
          );
        }
      }}
      className="checkbox checkbox-sm checkbox-info"
    />

    <img
      src={user.profilePic || "/avatar.png"}
      alt={user.fullName}
      className="w-10 h-10 rounded-full"
    />

    <span>{user.fullName}</span>
  </label>
))}

        <div className="flex gap-3 mt-6">
  <button
    onClick={() => setCreateGroupModalOpen(false)}
    className="flex-1 bg-slate-700 rounded-lg py-2"
  >
    Cancel
  </button>

  <button
    className="flex-1 bg-cyan-600 rounded-lg py-2 hover:bg-cyan-700" 
    onClick={handleCreateGroup}
  >
    Create
  </button>
</div>

      </div>
    </div>
  );
}

export default CreateGroupModal;