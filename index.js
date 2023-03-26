const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const jwt = require('jsonwebtoken');
var app = express();

app.use(cors());
app.use(express.json())

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.ncb6zkp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log("Connected correctly to server");

    const productCollection = client.db("salebazar").collection("products");

    app.post('/login',async(req,res)=>{
      const email = req.body;

      const token = jwt.sign(email, process.env.ACCESS_TOKEN);

      res.send({ token })
    })

    app.post('/uploadpd',async(req,res)=>{
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send({ success: 'Product Upload Successfully' })
    })


  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
