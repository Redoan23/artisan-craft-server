const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000



app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.qlopamb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();

        const artCollection = client.db('artisanDB').collection('artisan')

        app.get('/artisan', async (req, res) => {
            const cursor = artCollection.find()
            const array = await cursor.toArray()
            res.send(array)
        })

        app.get('/artisan/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await artCollection.findOne(query)
            res.send(result)
        })

        app.get('/artisan/arts/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const cursor = artCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/artisan/arts/check/:subcategory', async (req, res) => {
            const name = req.params.subcategory
            const query = { subcategoryName: name }
            const cursor = artCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/', async (req, res) => {
            const data = req.body
            console.log(data)
            const result = artCollection.insertOne(data)
            res.send(result)
        })

        app.put('/artisan/:id', async (req, res) => {
            const id = req.params.id
            const data = req.body
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {

                    photo: data.photo,
                    itemName: data.itemName,
                    subcategoryName: data.subcategoryName,
                    description: data.description,
                    price: data.price,
                    rating: data.rating,
                    customization: data.customization,
                    status: data.status,
                }
            }
            const result = await artCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

        app.delete('/artisan/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await artCollection.deleteOne(query)
            res.send(result)
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




app.get('/', (req, res) => {
    res.send('The server is running')
})

app.listen(port, () => {
    console.log(`this is running on the port ${port}`)
})