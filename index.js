const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
//var jwt = require("jsonwebtoken");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@back-prac-2-admin.sldkkq5.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const UsersCollection = client.db("SecondBook").collection("Users");
    const ProductCollection = client.db("SecondBook").collection("Products");
    const CategoriesCollection = client
      .db("SecondBook")
      .collection("Categories");

    //All Categories
    app.get("/categories", async (req, res) => {
      let query = {};
      const Categories = await CategoriesCollection.find(query).toArray();
      res.send(Categories);
    });
    //Add User
    app.post("/addUser", async (req, res) => {
      const User = req.body;
      const result = await UsersCollection.insertOne(User);
      res.send(result);
    });
    //Add Product
    app.post("/addProduct", async (req, res) => {
      const User = req.body;
      const result = await ProductCollection.insertOne(User);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
