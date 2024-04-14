import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const port = 9000;

app.use(cors());



// Connect to MongoDB
mongoose
  .connect("mongodb+srv://parmeet2311:sunny1234@cluster0.dddni3k.mongodb.net/latestbook")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit the process if failed to connect to MongoDB
  });

// Define Schema
const sequenceSchema = new mongoose.Schema({
  currentLinkIndex: { type: Number, default: 0 },
});

// Define Model
const Sequence = mongoose.model("Sequence", sequenceSchema);

// Ensure the sequence document exists on startup
(async () => {
  try {
    let sequence = await Sequence.findOne({});
    if (!sequence) {
      await Sequence.create({ currentLinkIndex: 0 });
    }
  } catch (err) {
    console.error("Error finding or creating sequence:", err);
    process.exit(1); // Exit the process if failed to ensure the sequence document
  }
})();

// Route to get the next link
app.get("/", async (req, res) => {
  try {
    res.json("Hello Developers");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get the next link
app.post('/nextLink', async (req, res) => {
  try {
    let sequence = await Sequence.findOneAndUpdate({}, { $inc: { currentLinkIndex: 1 } }, { new: true });
    if (!sequence) {
      return res.status(404).json({ error: "Sequence document not found" });
    }
    const links = [
      "+918988880425", "+919216041313", "+919094160001", "+918699559516", "+919333441313",
      "+919216331313", "+918988880425", "+919216041313", "+919094160001", "+918699559516"
    ];
    const nextLink = links[sequence.currentLinkIndex % links.length];
    res.json({ nextLink });
  } catch (error) {
    console.error('Error fetching next link:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
