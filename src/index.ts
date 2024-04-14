import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const port = 9000;

app.use(cors());

// Connect to MongoDB


mongoose
  .connect(
    "mongodb+srv://parmeet2311:sunny1234@cluster0.dddni3k.mongodb.net/latestbook"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Define Schema
const sequenceSchema = new mongoose.Schema({
  currentLinkIndex: Number,
});

// Define Model
const Sequence = mongoose.model("Sequence", sequenceSchema);

// Check if the sequence document exists, if not, create it
Sequence.findOne({})
  .then((sequence) => {
    if (!sequence) {
      Sequence.create({ currentLinkIndex: 0 });
    }
  })
  .catch((err) => {
    console.error("Error finding or creating sequence:", err);
  });

// Route to get the next link
app.get("/", async (req, res) => {
  try {
    res.json("Hello Developers");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/nextLink', async (req, res) => {
  try {
    let sequence = await Sequence.findOne({}).maxTimeMS(20000); // Increase timeout to 20 seconds
    const links = [
      "+918988880425", //1
      "+919216041313", //2
      "+919094160001", //3
      "+918699559516", //4
      "+919333441313", //5
      "+919216331313", //6
      "+918988880425", //7
      "+919216041313", //8
      "+919094160001", //9
      "+918699559516", //10
    ];
    const nextLink = links[sequence.currentLinkIndex];
    sequence.currentLinkIndex = (sequence.currentLinkIndex + 1) % links.length;
    await sequence.save();
    res.json({ nextLink });
  } catch (error) {
    console.error('Error fetching next link:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
