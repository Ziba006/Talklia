import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";

function AddMembersModal() {
  const {
    isAddMembersModalOpen,
    setAddMembersModalOpen,
    selectedGroup,
    allContacts,
    getAllContacts,
    addMembersToGroup,
  } = useChatStore();

  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    if (isAddMembersModalOpen) {
      getAllContacts();
    }
  }, [isAddMembersModalOpen]);

  if (!isAddMembersModalOpen || !selectedGroup) return null;

  // Hide users already in the group
  const availableContacts = allContacts.filter(
    (contact) =>
      !selectedGroup.members.some(
        (member) => member._id === contact._id
      )
  );

  const handleAddMembers = async () => {
    if (selectedMembers.length === 0) return;

    await addMembersToGroup(
      selectedGroup._id,
      selectedMembers
    );

    setSelectedMembers([]);
    setAddMembersModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">

      <div className="w-[420px] max-h-[80vh] overflow-y-auto bg-[#10271e] rounded-xl p-6 border border-cyan-500/20">

        <h2 className="text-xl font-semibold mb-5">
          Add Members
        </h2>

        {availableContacts.map((user) => (
          <label
            key={user._id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedMembers.includes(user._id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedMembers([
                    ...selectedMembers,
                    user._id,
                  ]);
                } else {
                  setSelectedMembers(
                    selectedMembers.filter(
                      (id) => id !== user._id
                    )
                  );
                }
              }}
              className="checkbox checkbox-info checkbox-sm"
            />

            <img
              src={user.profilePic || "/avatar.png"}
              className="w-10 h-10 rounded-full"
            />

            <span>{user.fullName}</span>
          </label>
        ))}

        <div className="flex gap-3 mt-6">

          <button
            onClick={() => setAddMembersModalOpen(false)}
            className="flex-1 bg-slate-700 rounded-lg py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleAddMembers}
            className="flex-1 bg-cyan-600 rounded-lg py-2 hover:bg-cyan-700"
          >
            Add
          </button>

        </div>

      </div>

    </div>
  );
}

export default AddMembersModal;