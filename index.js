const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

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
        //const orderCollection = database.collection('orders'); //To create db according to order


        //GET API of Services
        app.get('/services', async (req, res) => {

            const cursor = servicesCollection.find({});
            services = await cursor.toArray();

            res.send(services)
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