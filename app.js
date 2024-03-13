const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();

app.use(express.json());

//database connection
let client = null;
let db;
async function connectDB() {
  if (!client) {
    try {
      client = new MongoClient("mongodb://localhost:27017/crud");
      await client.connect();
      console.log("connected..");
    } catch (error) {
      console.log("not connected ..");
      throw error;
    }
  }
  return client.db();
}

//CREATE a data
app.post("/create-data", async (req, res) => {
  db = await connectDB();
  const data = await db
    .collection("data_collection")
    .insertOne({ text: req.body.text });
  res.json(data);
});

//READ the data
app.get("/fetchall", async (req, res) => {
  db = await connectDB();
  const data = await db
    .collection("data_collection")
    .find()
    .toArray(function (err, items) {
      res.send(items);
    });
  res.send(data);
});

//UPDATE the data
app.put("/update-data/:id", async (req, res) => {
  await db
    .collection("data")
    .findOneAndUpdate(
      { _id: new mongodb.ObjectId(req.params.id) },
      { $set: { text: req.body.text } }
    );
  res.send("updated successfully");
});

//DELETE the data
app.delete("/delete-data/:id", async (req, res) => {
  await db.collection("data").deleteOne({ _id: req.params.id });
  res.send("Successfully deleted!");
});

app.listen(3000, async () => {
  try {
    await connectDB();
    console.log("server is running..");
  } catch (error) {
    console.log("server not running..");
    throw error;
  }
});
