import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const port = 9000;

app.use(cors());

// Connect to MongoDB


mongoose
  .connect(
    "mongodb+srv://solutions1313temp:solutions1313@cluster0.njjxldt.mongodb.net/latestbook"
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

// Function to get the next link
const getNextLink = async () => {
  try {
    let sequence = await Sequence.findOne({});
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
    console.log("sequence.currentLinkIndex", sequence.currentLinkIndex);
    sequence.currentLinkIndex = (sequence.currentLinkIndex + 1) % links.length;
    await sequence.save();
    return nextLink;
  } catch (error) {
    console.error("Error fetching next link:", error);
    return null;
  }
};

// Route to get the next link
app.get("/", async (req, res) => {
  try {
    res.json("Hello Developers");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get the next link
app.post("/nextLink", async (req, res) => {
  try {
    const nextLink = await getNextLink();
    res.json({ nextLink });
  } catch (error) {
    console.error("Error fetching next link:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/cron", async (req, res) => {
  const nextLink = await getNextLink();
  res.send({ message: "Updated phone number", nextLink });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
