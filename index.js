const express = require('express');
const app =express();
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const cors = require('cors');


app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d8yzbln.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

const toysCollection = client.db("toysDB").collection("toys");
const blogsCollection = client.db("toysDB").collection("blogs");
const customerCollection = client.db("toysDB").collection("customer");



app.get('/add', async(req,res)=>{
  const cursor = toysCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})



app.get('/add/:id', async(req,res)=>{
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await toysCollection.findOne(query);
  res.send(result);
})

app.get('/mytoys', async(req,res)=>{
  let query ={};
  if(req.query?.email){
    query= {email: req.query.email}
  }
  const result = await toysCollection.find(query).toArray();
  res.send(result);
})
app.get('/mytoys/:id', async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)};
  const result = await toysCollection.findOne(query);
  res.send(result);
})
// 
app.patch('/mytoys/:id', async(req,res)=>{
  const id = req.params.id;
  const filter ={_id: new ObjectId(id)};
  const updateToy =req.body;
  const Toy = {
    $set: {
      price:updateToy.price, 
      available:updateToy.available, 
      description:updateToy.description
    },
  };
  const result = await toysCollection.updateOne(filter,Toy);
  res.send(result);
})

app.delete('/mytoys/:id', async(req, res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await toysCollection.deleteOne(query);
  res.send(result);
})

    app.post('/add', async(req, res)=>{
      const user = req.body;
      console.log(user);
      const result = await toysCollection.insertOne(user)
      res.send(result);
    })
    /***  blog **/

    app.get('/blogs', async(req,res)=>{
      const cursor = blogsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
   })

   app.get('/customer', async(req,res)=>{
    const cursor = customerCollection.find();
    const result = await cursor.toArray();
    res.send(result);
   })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
  res.send('server is running')
})


app.listen(port,()=>{
  console.log(`server is runnig on ${port}`);
})