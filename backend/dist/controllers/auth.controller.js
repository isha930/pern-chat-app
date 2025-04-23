import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";  // <-- Add this import at the top of your file

export const signup = async (req, res) => {
    try {
        console.log("Signup Request Received:", req.body);
        const { fullName, username, password, confirmPassword, gender } = req.body;
        // 🛑 Validate input fields
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ error: "Please fill in all fields" });
        }
        // 🛑 Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }
        // 🛑 Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }
        // 🔒 Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);
        // 🖼️ Profile Picture based on Gender
        const profilePic = gender === "male"
            ? `https://avatar.iran.liara.run/public/boy?username=${username}`
            : `https://avatar.iran.liara.run/public/girl?username=${username}`;
        // 👤 Create new user
        const newUser = await prisma.user.create({
            data: {
                fullName,
                username,
                password: hashedPassword,
                gender,
                profilePic,
            },
        });console.log("User Created", newUser);

        // 🔥 Generate JWT Token
        await generateToken(newUser.id, res); // Add await here
        // ✅ Send JSON Response
        res.status(201).json({
            id: newUser.id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic,
            message: "Signup successful!",
        });
    }
    catch (error) {
        console.error("Signup Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
        console.log("Login Request Received:", req.body);
        const { username, password } = req.body;

        // 🛑 Validate Input
        if (!username || !password) {
            return res.status(400).json({ error: "Please enter both username and password" });
        }

        // 🔍 Find user
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // 🔐 Compare password
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // 🔥 Generate JWT Token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // 🍪 Set token in HttpOnly cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        // ✅ Send user info (no token in response)
        res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
            message: "Login successful!",
        });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const logout = async (req, res) => {
    try {
        // 🔥 Clear JWT Cookie
        res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
        // ✅ Send JSON Response
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.error("Logout Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getMe = async (req, res) => {
    try {
        console.log("GetMe Request Received:", req.user);
        // 🔍 Find user in database
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // ✅ Send JSON Response
        res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });
    }
    catch (error) {
        console.error("GetMe Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
