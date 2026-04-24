import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { name, waveId, password } = req.body;

    if (!name || !waveId || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    let normalizedWaveId = waveId.trim().toLowerCase();
    if (!normalizedWaveId.startsWith("@")) normalizedWaveId = `@${normalizedWaveId}`;

    const waveIdRegex = /^@[a-z0-9._]+$/;
    if (!waveIdRegex.test(normalizedWaveId)) {
      return res.status(400).json({ message: "WaveID can only contain letters, numbers, dots, or underscores" });
    }

    if (normalizedWaveId.length < 3 || normalizedWaveId.length > 30) {
      return res.status(400).json({ message: "WaveID must be between 3 and 30 characters" });
    }

    const existingUser = await User.findOne({ waveId: normalizedWaveId });
    if (existingUser) {
      return res.status(400).json({ message: "This WaveID is already taken. Try another one!" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, waveId: normalizedWaveId, password: hashedPassword });
    await newUser.save();

    // Generate token — also set cookie for same-origin, return in body for cross-origin
    const token = generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      profilePic: newUser.profilePic,
      waveId: newUser.waveId,
      status: newUser.status,
      createdAt: newUser.createdAt,
      token, // ← returned for cross-origin clients (Vercel ↔ Render)
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { waveId, password } = req.body;

    if (!waveId || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let normalizedWaveId = waveId.trim().toLowerCase();
    if (!normalizedWaveId.startsWith("@")) normalizedWaveId = `@${normalizedWaveId}`;

    const user = await User.findOne({ waveId: normalizedWaveId });
    if (!user) return res.status(400).json({ message: "Invalid WaveID or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid WaveID or password" });

    // Generate token — also set cookie for same-origin, return in body for cross-origin
    const token = generateToken(user._id, res);

    res.json({
      _id: user._id,
      name: user.name,
      profilePic: user.profilePic,
      waveId: user.waveId,
      status: user.status,
      createdAt: user.createdAt,
      token, // ← returned for cross-origin clients (Vercel ↔ Render)
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error("Check auth error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
