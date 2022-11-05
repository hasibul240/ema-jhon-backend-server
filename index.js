const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

//name: ema-jhon-db
// pass 4lgENfSWrbd24LdV


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3njemyu.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const product_collection = client.db("ema-jhon").collection("products");
        
        app.get('/products', async (req, res) => {

            const page = req.query.page;
            const size = req.query.size;
            console.log(page, size);

            const cursor = product_collection.find({});
            const products = await cursor.toArray();
            const count = await product_collection.estimatedDocumentCount();
            res.send({products, count});
        });

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});