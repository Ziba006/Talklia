import Group from "../models/Group.js";
import GroupMessage from "../models/GroupMessage.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from "../lib/socket.js"; // adjust path if different

// Get all messages of a group
export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Check user belongs to group
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.some(
      (member) => member.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: "Not a group member" });
    }

    const messages = await GroupMessage.find({ groupId })
      .populate("senderId", "fullName profilePic")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get Group Messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send a message to a group
export const sendGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { text, image } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.some(
      (member) => member.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: "Not a group member" });
    }

    let imageUrl = "";

    if (image) {
      const upload = await cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url;
    }

    const message = await GroupMessage.create({
      senderId: req.user._id,
      groupId,
      text,
      image: imageUrl,
    });

    const populatedMessage = await message.populate(
      "senderId",
      "fullName profilePic"
    );

    io.to(groupId).emit("newGroupMessage", populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Send Group Message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};