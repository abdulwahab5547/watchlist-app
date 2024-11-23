import express, { Router, json } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import User, { findOne, findById} from './models/user.model.js';
import cors from 'cors';
const app = express();
const router = Router();
import pkg from 'body-parser';
const { json: _json } = pkg;
import token from 'jsonwebtoken';
const { sign, verify } = token;
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware

app.use(json());

app.use(cors({
    origin: ["https://watchlist-ivory-two.vercel.app", "http://localhost:3000"],
    methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true
}));

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid or expired token' });
      req.user = user;
      next();
  });
}

// Routes
router.post('/signup', async (req, res) => {
  const { name, email, password} = req.body;
  try {
    const newUser = new User({name, email, password});
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = generateToken(user);

        res.status(200).json({ token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Watchlist feature
app.post("/api/watchlist", async (req, res) => {
    try {
      // Extract and verify the token from the Authorization header
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const decoded = verify(token, process.env.SECRET_KEY);
      if (!decoded || !decoded.id) {
        return res.status(401).json({ message: "Invalid token" });
      }
  
      // Find user by ID
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Extract movie details from the request body
      const { id, contentType, title, release_date, overview, poster_path, genre } = req.body;
  
      if (!id || !contentType || !title) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      // Check if the movie/show already exists in the watchlist
      const existingItem = user.watchlist.find((item) => item.id === id);
      if (existingItem) {
        return res.status(400).json({ message: "Item already exists in watchlist" });
      }
  
      // Add the new item to the watchlist
      user.watchlist.push({ id, contentType, title, release_date, overview, poster_path, genre });
      await user.save();
  
      res.status(200).json({ message: "Item added to watchlist!" });
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      res.status(500).json({ message: "Server error" });
    }
  });  


app.get("/api/watchlist", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).send({ message: "Unauthorized" });

        // Verify token
        const decoded = verify(token, process.env.SECRET_KEY);
        if (!decoded || !decoded.id) return res.status(401).send({ message: "Invalid token" });

        // Find user by ID
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).send({ message: "User not found" });

        // Return user's watchlist
        res.status(200).send({ watchlist: user.watchlist });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
});

// Removing a movie/TV show from watchlist

app.delete("/api/watchlist", async (req, res) => {
    try {
      // Extract and verify the token from the Authorization header
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const decoded = verify(token, process.env.SECRET_KEY);
      if (!decoded || !decoded.id) {
        return res.status(401).json({ message: "Invalid token" });
      }
  
      // Find the user by ID
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Extract item ID and content type from the request body
      const { id, contentType } = req.body;
      if (!id || !contentType) {
        return res.status(400).json({ message: "Invalid request payload" });
      }
  
      // Remove the item from the watchlist by matching `id` and `contentType`
      user.watchlist = user.watchlist.filter(
        (item) => !(item.id === Number(id) && item.contentType === contentType)
      );
  
      // Save the updated user document
      await user.save();
  
      res.status(200).json({ message: "Item removed from watchlist" });
    } catch (error) {
      console.error("Error removing item from watchlist:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  

app.patch('/api/update-avatar', async (req, res) => {
    try {
        // Extract token from Authorization header
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).send({ message: "Unauthorized" });

        // Verify token
        const decoded = verify(token, process.env.SECRET_KEY);
        if (!decoded || !decoded.id) return res.status(401).send({ message: "Invalid token" });

        // Find user by ID from the decoded token
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).send({ message: "User not found" });

        // Get avatar from the request body
        const { avatar } = req.body; // assuming you're sending avatar number in the request body

        if (typeof avatar !== 'number') {
            return res.status(400).json({ message: 'Avatar must be a number' });
        }

        // Update the avatar field of the user
        user.avatar = avatar;
        await user.save();

        // Return updated avatar info
        return res.status(200).json({ message: 'Avatar updated successfully', avatar: user.avatar });
    } catch (error) {
        console.error('Error updating avatar:', error);
        return res.status(500).send({ message: 'Error updating avatar' });
    }
});

router.get("/profile", async (req, res) => {
    try {
      // Extract token from Authorization header
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).send({ message: "Unauthorized" });

      // Verify token
      const decoded = verify(token, process.env.SECRET_KEY);
      if (!decoded || !decoded.id) return res.status(401).send({ message: "Invalid token" });
      
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).send({ message: "User not found" });
  
      // Send the user profile (name and avatar)
      res.status(200).json({
        name: user.name,
        avatar: user.avatar, // Assuming avatar is stored as an integer (ID) referencing an avatar
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

// Example routes
app.get('/', (req, res) => res.send('Hello World!'));
app.get('/something', (req, res) => res.send('Hello something something!'));

// Final middleware: mount the router
app.use('/api', router);

// Generatetoken function
function generateToken(user) {
    return sign({ id: user.id}, SECRET_KEY, {
        expiresIn: '14d',
    });
}

// Connect to MongoDB and start server
const uri = process.env.MONGODB_URL;
mongoose.connect(uri, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

const port = process.env.PORT || 5000; 
app.listen(port, () => console.log(`Server running on port ${port}`));