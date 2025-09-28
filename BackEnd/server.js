const express = require("express");
const http = require('http');
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { spawn } = require("child_process");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { authenticateToken } = require("./middleware/auth");

require("dotenv").config();

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error('❌ Critical Error: JWT_SECRET environment variable is required!');
  process.exit(1);
}

const app = express();
const server = http.createServer(app); 

const port = 5050;

// Enhanced CORS configuration for security
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In production, you should specify your frontend domains
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5000', 
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5000',
      'https://yourdomain.com' // Replace with your production domain
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn('CORS blocked request from:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));

// Additional Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
      cb(null, `audio-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/SmartSummary", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.once("open", () => {
  console.log("✅ MongoDB Connected Successfully");
});

// Define Schemas and Models
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema);

const NoteSchema = new mongoose.Schema({
  email: String,
  title: String,
  content: String,
  summary: String,
  markdown: String,
  duration: String,
  score: { type: Number, default: 80 },
  createdAt: { type: Date, default: Date.now }
});
const Note = mongoose.model("Note", NoteSchema);

console.log("🔐 JWT Secret Key Loaded Successfully!");

// Health Check Endpoint - No Authentication Required
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    service: "SmartSummary API"
  });
});

const upload = multer({ 
  storage: storage,
  limits: { 
      fileSize: 50 * 1024 * 1024 // 50MB max file size
  },
  fileFilter: (req, file, cb) => {
      // Accept audio files only
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-wav'];
      if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
      } else {
          cb(new Error('Invalid file type. Only audio files are allowed.'));
      }
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD, // Use App Password
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email Transporter Error:", error);
  } else {
    console.log("✅ Email Transporter Ready");
  }
});

// ✅ Registration API
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("❌ User already exists!");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).send({ message: "✅ User registered successfully!", token });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// ✅ Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ err: "❌ User not found!" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(400).json({ err: "❌ Invalid password!" });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "✅ Login successful!", token, email });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ err: "Internal Server Error" });
  }
});

app.post("/upload", authenticateToken, upload.single("audio"), (req, res) => {
  // Validate file
  if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
  }

  const filePath = req.file.path;
  console.log("Processing file:", filePath);

  // Changed from python3 to python for Windows compatibility
  const pythonProcess = spawn("python", ["transcript.py", filePath]);

  let transcriptionResult = "";
  let errorOutput = "";

  // Collect output
  pythonProcess.stdout.on("data", (data) => {
      transcriptionResult += data.toString();
  });

  // Collect errors
  pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
      console.error("Transcription Error:", data.toString());
  });

  // Handle process completion
  pythonProcess.on("close", (code) => {
      // Always attempt to delete the file
      fs.unlink(filePath, (err) => { 
          if (err) console.error("Error deleting file:", err); 
      });

      // Handle transcription result
      if (code !== 0) {
          return res.status(500).json({ 
              error: "Transcription failed", 
              details: errorOutput 
          });
      }

      // Send successful response
      res.json({ 
          transcription: transcriptionResult.trim(),
          success: true
      });
  });
});




// Forgot Password
const resetTokens = new Map();
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found!" });
  const token = crypto.randomBytes(32).toString("hex");
  resetTokens.set(token, email);
  const resetLink = `http://localhost:5000/reset-password/${token}`;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset",
      
      html: `
      <b>
        <h1>Reset Your Password🔓</h1>
        <p>We received a request to reset your password. Please click below to change your password.</p>
        
        <p>
          <a href="${resetLink}" style="
            background-color: #007bff;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
            font-size: 16px;
          ">🔃 Click Here to Reset Password</a>
        </p>
        <br></br>
        <p>If you didn't request this, please ignore this email or contact us.</p>

        <p style="text-align: center;">
          <img src="cid:mail-gif" alt="You Got Mail" style="width: 450px; height: auto;">
        </p>
  
        <p>Happy Meetings!</p>
      </b>
    `,
    attachments: [{
      filename: 'you-got-mail-email.gif',
      path: "C:/Users/91942/Desktop/SmartSummary/BackEnd/you-got-mail-email.gif",
      cid: 'mail-gif',
      contentDisposition: 'inline'
    }]
    });
    res.json({ message: "Password reset link sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending email" });
  }
});

// Reset Password
app.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  const email = resetTokens.get(token);
  if (!email)
    return res.status(400).json({ message: "Invalid or expired token!" });
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.updateOne({ email }, { password: hashedPassword });
  resetTokens.delete(token);
  res.json({ message: "Password reset successful!" });
});




app.post("/summarize", authenticateToken, async (req, res) => {
  const { text, title, duration } = req.body; // Remove email from req.body since we'll use authenticated user's email

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    // Use Python for summarization
    const pythonProcess = spawn("python", ["summarize.py", text,"textrank","7","bullets"]);
    let summary = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
        summary += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
        console.error(`Summarization Error: ${data}`);
    });

    pythonProcess.on("close", async (code) => {
      if (code !== 0) {
          return res.status(500).json({ 
              error: "Error processing summary", 
              details: errorOutput 
          });
      }

      try {
        // Store in MongoDB using authenticated user's email
        const newNote = new Note({
          email: req.user.email, // Use authenticated user's email
          title: title || "Untitled Meeting",
          content: text,
          summary: summary.trim(), // Just trim the direct summary string
          markdown: summary.trim(), // Use the trimmed summary
          duration: duration || "N/A",
          score: Math.floor(Math.random() * 21) + 80
        });
          
        await newNote.save();
          
        
        // Return success response
        res.json({ 
          success: true, 
          summary: summary.trim(),
          message: "Summary generated and saved successfully" 
        });
          
      } catch (dbError) {
        console.error("Database Error:", dbError);
        res.status(500).json({ 
          error: "Failed to save summary to database", 
          details: dbError.message 
        });
      }
    }); 
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ 
      error: "Something went wrong", 
      details: error.message 
    });
  }
});
app.post("/send-email", authenticateToken, async (req, res) => {
  const { emails, meetingNotes } = req.body;

  if (!emails || emails.length === 0) {
    return res.status(400).json({ message: "Email list is empty" });
  }

  const mailOptions = {
    from: process.env.EMAIL,
    to: emails.join(", "),
    subject: "Meeting Notes",
    text: meetingNotes,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Emails sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error sending emails", error });
  }
});





      


// Endpoint to get all notes for authenticated user only
app.get("/notes", authenticateToken, async (req, res) => {
  try {
    // Get notes only for authenticated user
    const notes = await Note.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// Endpoint to get a single note by ID (authenticated user only)
app.get("/notes/:id", authenticateToken, async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      email: req.user.email // Ensure user owns this note
    });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ error: "Failed to fetch note" });
  }
});

// Endpoint to update a note (authenticated user only)
app.post("/notes/update", authenticateToken, async (req, res) => {
  try {
    const { id, title, markdown } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: "Note ID is required" });
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, email: req.user.email }, // Ensure user owns this note
      { 
        title: title,
        markdown: markdown 
      },
      { new: true } // Return the updated document
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Failed to update note" });
  }
});

// Endpoint to delete a note (authenticated user only)
app.post("/notes/delete", authenticateToken, async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: "Note ID is required" });
    }

    const deletedNote = await Note.findOneAndDelete({ 
      _id: id, 
      email: req.user.email // Ensure user owns this note
    });
    
    if (!deletedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

// Global error handler
app.use((err, req, res, next) => { 
  console.error(err.stack);
  res.status(500).json({ 
      error: "Something went wrong!", 
      details: err.message 
  });
});

// Start server
const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;