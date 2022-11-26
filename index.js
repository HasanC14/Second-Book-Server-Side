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
    const OrderCollection = client.db("SecondBook").collection("Orders");
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
    //Category Specific Books
    app.get("/CategoryBooks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { Category_id: id };
      const result = await ProductCollection.find(query).toArray();
      res.send(result);
    });
    //All Seller
    app.get("/AllSeller", async (req, res) => {
      const query = { role: "seller" };
      const result = await UsersCollection.find(query).toArray();
      res.send(result);
    });
    //All Buyer
    app.get("/AllBuyer", async (req, res) => {
      const query = { role: "buyer" };
      const result = await UsersCollection.find(query).toArray();
      res.send(result);
    });
    //Seller Products
    app.get("/SellerProducts", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = { SellerEmail: req.query.email };
      }
      const cursor = ProductCollection.find(query).sort({
        Time: -1,
      });
      const product = await cursor.toArray();
      res.send(product);
    });
    //Admin Route
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await UsersCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });
    //Buyer Route
    app.get("/users/buyer/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await UsersCollection.findOne(query);
      res.send({ isBuyer: user?.role === "buyer" });
    });
    //Seller Route
    app.get("/users/seller/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await UsersCollection.findOne(query);
      res.send({ isSeller: user?.role === "seller" });
    });
    //Delete User
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await UsersCollection.deleteOne(query);
      res.send(result);
    });

    //Verify Seller
    app.patch("/seller/verify/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const UpdatedDoc = {
        $set: {
          Verify: "true",
        },
      };
      const result = await UsersCollection.updateOne(
        filter,
        UpdatedDoc,
        option
      );
      res.send(result);
    });
    //Advertise A Product
    app.patch("/product/ad/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const UpdatedDoc = {
        $set: {
          advertise: "true",
        },
      };
      const result = await ProductCollection.updateOne(
        filter,
        UpdatedDoc,
        option
      );
      res.send(result);
    });
    //Cancel Advertisement
    app.patch("/product/adcancel/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const UpdatedDoc = {
        $set: {
          advertise: "false",
        },
      };
      const result = await ProductCollection.updateOne(
        filter,
        UpdatedDoc,
        option
      );
      res.send(result);
    });
    //Delete Product
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ProductCollection.deleteOne(query);
      res.send(result);
    });
    //Seller Verification Checking
    app.get("/seller", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = { email: req.query.email };
      }
      const user = await UsersCollection.findOne(query);
      res.send(user);
    });
    //Place Order
    app.post("/placeorder", async (req, res) => {
      const order = req.body;
      const result = await OrderCollection.insertOne(order);
      res.send(result);
    });
    //Book product
    app.patch("/product/booked/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const UpdatedDoc = {
        $set: {
          Booked: "true",
        },
      };
      const result = await ProductCollection.updateOne(
        filter,
        UpdatedDoc,
        option
      );
      res.send(result);
    });
    //Buyer Orders
    app.get("/BuyerOrders", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = { BuyerEmail: req.query.email };
      }
      const cursor = OrderCollection.find(query).sort({
        Time: -1,
      });
      const product = await cursor.toArray();
      res.send(product);
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
