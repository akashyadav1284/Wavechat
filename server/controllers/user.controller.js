import User from "../models/User.model.js";

export const checkWaveId = async (req, res) => {
  try {
    const { waveId } = req.query;

    if (!waveId) {
      return res.status(400).json({ message: "WaveID is required" });
    }

    let normalized = waveId.trim().toLowerCase();
    if (!normalized.startsWith("@")) normalized = `@${normalized}`;

    const existing = await User.findOne({ waveId: normalized });
    res.json({ available: !existing, waveId: normalized });
  } catch (error) {
    console.error("Check waveId error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [
        { waveId: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
      ],
    }).select("-password");

    res.json(users);
  } catch (error) {
    console.error("Search users error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, profilePic } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (name) updateData.name = name;
    if (profilePic) updateData.profilePic = profilePic;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
