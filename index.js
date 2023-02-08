const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p8qnexq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {

    const allProducts = client.db('earthyShop').collection('products')
    const allOrders = client.db('earthyShop').collection('orders')
    const allUsers = client.db('earthyShop').collection('users')

    try {
        app.get('/products', async (req, res) => {
            const query = {};
            const result = await allProducts.find(query).toArray();
            res.send(result)
        })

        app.post('/orders', async (req, res) => {
            const query = req.body;
            const result = await allOrders.insertOne(query);
            res.send(result)
        })

        app.get('/quantity', async (req, res) => {
            const email = req.query.email
            const query = {email: email};
            const result = await allOrders.find(query).toArray();
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const query = req.body;
            const result = await allUsers.insertOne(query);
            res.send(result)
        })

        app.put('/update', async (req, res) => {
            const id = req.body._id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    price: req.body.price,
                    quantity: req.body.quantity
                }
            }
            const result = await allOrders.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allOrders.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(console.log)



app.get('/', (req, res) => {
    res.send('Earthy Shop is running')
})

app.listen(port, () => {
    console.log(`Earthy Shop start on port ${port}`)
})