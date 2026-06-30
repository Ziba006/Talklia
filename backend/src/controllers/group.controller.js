import Group from "../models/Group.js";
import cloudinary from "../lib/cloudinary.js";

// Create a new group
export const createGroup = async (req, res) => {
  try {
    const { name, members, image } = req.body;

    if (!name || !members || members.length === 0) {
      return res.status(400).json({
        message: "Group name and members are required",
      });
    }

    // Add the logged-in user (admin) if not already included
    const allMembers = [...new Set([...members, req.user._id.toString()])];

    let imageUrl = "";

if (image) {
  const upload = await cloudinary.uploader.upload(image);
  imageUrl = upload.secure_url;
}

    const group = await Group.create({
      name,
      admin: req.user._id,
       image: imageUrl,
      members: allMembers,
    });

    res.status(201).json(group);
  } catch (error) {
    console.error("Create Group Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all groups of logged-in user
export const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user._id,
    })
      .populate("members", "fullName profilePic")
      .populate("admin", "fullName profilePic");

    res.status(200).json(groups);
  } catch (error) {
    console.error("Get Groups Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};