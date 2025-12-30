import { v4 as uuidv4 } from "uuid";
import { getDb } from "../db/connection.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../utils/jwt.js";

export const register = async (req, res) => {
    try {
        const { email, password, full_name } = req.body;

        // Validate input
        if (!email || !password || !full_name) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const db = getDb();

        // Check if user exists
        const existing = await db.execute({
            sql: "SELECT id FROM users WHERE email = ?",
            args: [email],
        });

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Create user
        const userId = uuidv4();
        const hashedPassword = await hashPassword(password);

        await db.execute({
            sql: "INSERT INTO users (id, email, password, full_name) VALUES (?, ?, ?, ?)",
            args: [userId, email, hashedPassword, full_name],
        });

        // Generate tokens
        const accessToken = generateAccessToken({ userId, email });
        const refreshToken = generateRefreshToken({ userId });

        // Store refresh token
        const tokenId = uuidv4();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        await db.execute({
            sql: "INSERT INTO refresh_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)",
            args: [tokenId, userId, refreshToken, expiresAt.toISOString()],
        });

        res.status(201).json({
            user: {
                id: userId,
                email,
                full_name,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: "Registration failed" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Email and password are required" });
        }

        const db = getDb();

        // Find user
        const result = await db.execute({
            sql: "SELECT id, email, password, full_name FROM users WHERE email = ?",
            args: [email],
        });

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = result.rows[0];

        // Verify password
        const isValid = await comparePassword(password, user.password);

        if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
        });
        const refreshToken = generateRefreshToken({ userId: user.id });

        // Store refresh token
        const tokenId = uuidv4();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await db.execute({
            sql: "INSERT INTO refresh_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)",
            args: [tokenId, user.id, refreshToken, expiresAt.toISOString()],
        });

        res.json({
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed" });
    }
};

export const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: "Refresh token required" });
        }

        const db = getDb();

        // Verify token exists and not expired
        const tokenResult = await db.execute({
            sql: "SELECT user_id, expires_at FROM refresh_tokens WHERE token = ?",
            args: [refreshToken],
        });

        if (tokenResult.rows.length === 0) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }

        const tokenData = tokenResult.rows[0];

        if (new Date(tokenData.expires_at) < new Date()) {
            // Token expired, delete it
            await db.execute({
                sql: "DELETE FROM refresh_tokens WHERE token = ?",
                args: [refreshToken],
            });
            return res.status(401).json({ error: "Refresh token expired" });
        }

        // Verify JWT signature
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }

        // Get user
        const userResult = await db.execute({
            sql: "SELECT id, email FROM users WHERE id = ?",
            args: [tokenData.user_id],
        });

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: "User not found" });
        }

        const user = userResult.rows[0];

        // Generate new access token
        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
        });

        res.json({ accessToken });
    } catch (error) {
        console.error("Refresh error:", error);
        res.status(500).json({ error: "Token refresh failed" });
    }
};

export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) {
            const db = getDb();
            await db.execute({
                sql: "DELETE FROM refresh_tokens WHERE token = ?",
                args: [refreshToken],
            });
        }

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ error: "Logout failed" });
    }
};
