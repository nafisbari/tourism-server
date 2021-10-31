const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fkydx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri); // to see if the uri is showing the user id and pass
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log("DB Connected!") // to se if the connection is made.
        const database = client.db('tourism');
        const servicesCollection = database.collection('services');
        const orderCollection = database.collection('orders'); //To create db according to order


        //GET API of Services
        app.get('/services', async (req, res) => {

            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();

            res.send(services)
        })


        //POST API of Services
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result);
        })


        //POST API of orders
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);

        })
        //GET API of orders
        app.get('/orders', async (req, res) => {
            const userEmail = req.query.email;
            const result = await orderCollection.find({}).toArray();
            if (userEmail) {
                const newResult = result.filter(order => order.email === userEmail);
                res.send(newResult);
            } else {
                res.send(result);
            }

        })

        //get specific order using id
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const order = await orderCollection.findOne(query)

            console.log(id);
            res.send(order);
        })

        //GET My Order

        // app.get('/orders', async (req, res) => {
        //     const userEmail = req.query.email;
        //     console.log(userEmail);
        //     const cursor = orderCollection.find({});
        //     const result = await cursor.toArray({});
        //     if (userEmail) {
        //         const newResult = result.filter(myOrder => myOrder.email === userEmail);
        //         res.send(newResult);
        //     }
        //     else {
        //         res.send(result);

        //     }
        // });

        //delete  order api
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            console.log(result);

            console.log('deleting', id)
            res.json(result);
        });

        //update order api
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedStatus = {
                $set: {
                    status: status.status,
                }
            };
            const result = await orderCollection.updateOne(filter, updatedStatus, options);
            res.json(result);
        })

    }


    finally {
        //await client.close(); 
    }
};
run().catch(console.dir)





app.get('/', (req, res) => {
    res.send("Server is Running")
});

app.listen(port, () => {
    console.log('Server is Running at,', port)
});