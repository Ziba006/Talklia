import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

function GroupInfoModal() {
  const {
    selectedGroup,
    isGroupInfoModalOpen,
    setGroupInfoModalOpen,
     setAddMembersModalOpen,
     leaveGroup,
  } = useChatStore();

  const { authUser } = useAuthStore();

  if (!isGroupInfoModalOpen || !selectedGroup) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="w-[420px] bg-[#10271e] rounded-xl border border-cyan-500/20 p-6">

        <div className="flex flex-col items-center">

          <img
            src={selectedGroup.image || "/avatar.png"}
            alt={selectedGroup.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-cyan-500"
          />

          <h2 className="text-xl font-semibold mt-3">
            {selectedGroup.name}
          </h2>

        </div>

        <div className="mt-6">

          <h3 className="text-slate-300 mb-3">
            Members ({selectedGroup.members.length})
          </h3>

          <div className="space-y-3 max-h-64 overflow-y-auto">

            {selectedGroup.members.map((member) => (
              <div
                key={member._id}
                className="flex items-center gap-3"
              >
                <img
                  src={member.profilePic || "/avatar.png"}
                  className="w-10 h-10 rounded-full"
                />

                <div>
                  <p>{member.fullName}</p>

                  {member._id === selectedGroup.admin._id && (
                    <p className="text-xs text-cyan-400">
                      Admin
                    </p>
                  )}
                </div>
              </div>
            ))}

          </div>

             <button
            onClick={() => {
              setGroupInfoModalOpen(false);
              setAddMembersModalOpen(true);
            }}
            className="w-full mt-6 bg-cyan-600 rounded-lg py-2 hover:bg-cyan-700"
          >
            Add Members
          </button>

       <button
        onClick={async () => {
          await leaveGroup(selectedGroup._id);
          setGroupInfoModalOpen(false);
        }}
        className="w-full mt-3 bg-red-600 rounded-lg py-2 hover:bg-red-700"
      >
        Leave Group
      </button>

          <button
            onClick={() => setGroupInfoModalOpen(false)}
            className="w-full mt-3 bg-slate-700 rounded-lg py-2"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}

export default GroupInfoModal;