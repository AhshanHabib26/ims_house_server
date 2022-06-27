const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//MiddleWare
app.use(cors());
app.use(express.json());

//
//

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.4zes16q.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function ims_house(){
    try{

        await client.connect()

        const userItemsCollection = client
      .db("IMSCollection")
      .collection("addedItem");

      app.post("/additem", async (req, res) => {
        const additem = req.body;
        const result = await userItemsCollection.insertOne(additem);
        res.send(result);
      });

      app.get("/item", async (req, res) => {
        const query = {};
        const item = userItemsCollection.find(query);
        const result = await item.toArray();
        res.send(result);
      });

      app.delete("/item/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await userItemsCollection.deleteOne(query);
        res.send(result);
      });

      app.get("/item/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await userItemsCollection.findOne(query);
        res.send(result);
      });

      app.put("/item/:id", async (req, res) => {
        const id = req.params.id;
        const updatedItem = req.body;
        const itemFilter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updatedDoc = { $set: updatedItem };
  
        const result = await userItemsCollection.updateOne(
          itemFilter,
          updatedDoc,
          options
        );
        res.send(result);
      });
      

    }

    finally{

    }
}
ims_house().catch(console.dir())

app.get("/", (req, res) => {
  res.send("I Am Ahshan Habib!");
});

app.listen(port);
