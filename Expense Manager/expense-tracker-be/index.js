const express = require("express");
const app = express();
const cors = require("cors");
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const Transaction = require("./models/Transaction");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

//mongoDB
//Name of the project: MongoMayuresh
// username: iammayureshkshirsagar2000
// password: 49cHc2R8I5TENAHj
// const uri = "mongodb+srv://iammayureshkshirsagar2000:49cHc2R8I5TENAHj@mayureshcluster1.cazu15s.mongodb.net/?retryWrites=true&w=majority&appName=MayureshCluster1";

app.use(express.json());
app.use(cors());

app.post("/api/transaction", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const { price, name, description, datetime } = req.body;
  const transaction = await Transaction.create({
    price,
    name,
    description,
    datetime,
  });
  res.json(transaction);
  console.log(transaction);
});

app.get("/api/transactions", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const transactions = await Transaction.find();
  res.json(transactions);
});

app.delete("/api/transactions/:id", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const { id: transid } = req.params;
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: transid });
    if (!transaction) {
      res.status(404).json({ msg: `no transaction with id: ${transid}` });
    }
    res.status(200).json({ transaction });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

app.listen(3002, () => console.log("server is listening on port 3002"));
