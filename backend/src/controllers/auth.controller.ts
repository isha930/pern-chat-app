import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const signup = async (req: Request, res: Response) => {
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
		});

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
	} catch (error: any) {
		console.error("Signup Error:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const login = async (req: Request, res: Response) => {
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
		await generateToken(user.id, res); // Add await here

		// ✅ Send JSON Response
		res.status(200).json({
			id: user.id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
			message: "Login successful!",
		});
	} catch (error: any) {
		console.error("Login Error:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const logout = async (req: Request, res: Response) => {
	try {
		// 🔥 Clear JWT Cookie
		res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });

		// ✅ Send JSON Response
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error: any) {
		console.error("Logout Error:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getMe = async (req: Request, res: Response) => {
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
	} catch (error: any) {
		console.error("GetMe Error:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
