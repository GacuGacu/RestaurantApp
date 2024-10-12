// Import necessary modules
require('./UserDetails'); // Import user model

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const WebSocket = require('ws');

const app = express();
const wss = new WebSocket.Server({ port: 8080 }); // Create WebSocket server

const mongoURL = process.env.MONGO_URL; // Load from environment variables
const JWT_SECRET = process.env.JWT_SECRET; // Load from environment variables
app.use(express.json());

const User = mongoose.model("UserInfo"); // User model

// Connect to MongoDB
mongoose.connect(mongoURL)
    .then(() => {
        console.log("Connected to MongoDB successfully");
    })
    .catch(e => {
        console.error("Error connecting to MongoDB:", e);
    });

// Basic route to check server status
app.get("/", (req, res) => {
    res.send({ status: "Server started" });
});

// User registration
app.post('/register', async (req, res) => {
    const { username, email, password, friends = [], currentRequests = [] } = req.body;
    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail) {
        return res.send({ data: "Email is already used, please try to log in." });
    }
    if (existingUsername) {
        return res.send({ data: "Username is occupied!" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    try {
        await User.create({
            username,
            email,
            password: encryptedPassword,
            friends,
            currentRequests,
        });
        res.send({ status: "OK", data: "User Created" });
    } catch (error) {
        res.send({ status: "Error", data: error.message });
    }
});

// User login
app.post("/login", async (req, res) => {
    const { email, password, webkey } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
        return res.send({ data: "User doesn't exist." });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (passwordMatch) {
        const token = jwt.sign({ email: existingUser.email }, JWT_SECRET);
        clientsNameID.set(existingUser.email, { webkey });

        return res.send({ status: "OK", data: token });
    } else {
        return res.send({ status: "WPASS", data: "Incorrect password." });
    }
});

// Fetch user data
app.post("/user-data", async (req, res) => {
    const { token } = req.body;
    try {
        const decodedUser = jwt.verify(token, JWT_SECRET);
        const userData = await User.findOne({ email: decodedUser.email });
        res.send({ status: "OK", data: userData });
    } catch (error) {
        res.send({ error: error.message });
    }
});

// Search for a user
app.post('/search', async (req, res) => {
    const { searchQuery } = req.body;
    const foundUser = await User.findOne({ username: searchQuery });
    if (!foundUser) {
        return res.send({ data: "User doesn't exist." });
    }
    return res.send({ status: "OK", data: foundUser });
});

// Add friend
app.post('/add-friend', async (req, res) => {
    try {
        const { friendlyUsername, adder } = req.body;
        const foundUser = await User.findOne({ username: friendlyUsername });

        if (foundUser.currentRequests.includes(adder)) {
            return res.send({ status: 401, data: "Friend request has already been sent!" });
        }
        if (foundUser.friends.includes(adder)) {
            return res.send({ status: 401, data: "You already are friends!" });
        }

        await User.updateOne(
            { _id: foundUser._id },
            { $addToSet: { currentRequests: adder } }
        );

        if (clientsNameID.has(foundUser.email)) {
            const clientId = clientsNameID.get(foundUser.email);
            const clientSocket = clients.get(clientId.webkey);
            clientSocket.send(JSON.stringify({ message: "friendReq" }));
        }
        return res.send({ status: "OK", data: "Friend request sent successfully!" });
    } catch {
        return res.send({ status: 400, data: "Something went wrong!" });
    }
});

// Reject friend request
app.post('/reject-friend', async (req, res) => {
    try {
        const { me, friend } = req.body;
        const meUser = await User.findOne({ username: me });
        const friendUser = await User.findOne({ username: friend });

        await User.updateOne({ _id: meUser._id }, { $pull: { currentRequests: friendUser.username } });
        return res.send({ status: "OK", data: "Request rejected" });
    } catch (error) {
        console.error('Error updating user data:', error);
        return res.send({ status: 500, data: "Internal server error" });
    }
});

// Accept friend request
app.post('/accept-friend', async (req, res) => {
    const { me, friend } = req.body;

    const meUser = await User.findOne({ username: me });
    const friendUser = await User.findOne({ username: friend });

    try {
        await Promise.all([
            User.updateOne({ _id: meUser._id }, { $addToSet: { friends: friend } }),
            User.updateOne({ _id: friendUser._id }, { $addToSet: { friends: me } }),
            User.updateOne({ _id: meUser._id }, { $pull: { currentRequests: friend } }),
        ]);
        return res.send({ status: "OK", data: "Friend request accepted" });
    } catch (error) {
        console.error('Error updating user data:', error);
        return res.send({ status: 500, data: "Internal server error" });
    }
});

// Delete account
app.post('/delete-account', async (req, res) => {
    const { me } = req.body;

    const meUser = await User.findOne({ username: me });
    try {
        const deletedUser = await User.findByIdAndDelete(meUser._id);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// WebSocket implementation
const clients = new Map();
const clientsNameID = new Map();

function generateUniqueId() {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substr(2, 5);
    return timestamp + randomString;
}

wss.on('connection', (ws) => {
    const clientId = generateUniqueId();
    clients.set(clientId, ws);
    ws.send(JSON.stringify({ clientId }));

    ws.on('message', (message) => {
        console.log(`Received message from client ${clientId}:`, message);
    });

    ws.on('close', () => {
        console.log(`Client ${clientId} disconnected`);
        clients.delete(clientId);
        clientsNameID.delete(clientId);
    });
});

// Start the server
app.listen(5001, () => {
    console.log("Node.js server started on port 5001");
});
