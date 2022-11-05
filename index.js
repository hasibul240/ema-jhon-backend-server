const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            console.log(page, size);

            const cursor = product_collection.find({});
            const products = await cursor.skip(page*size).limit(size).toArray();
            const count = await product_collection.estimatedDocumentCount();
            res.send({products, count});
        });

        app.post('/productsById', async (req, res) => {
            const ids = req.body;
            // const object_ids = ids.map(id => ObjectId(id));

            // const cursor = product_collection.find({_id: { $in: ids.map(id => ObjectId(id)) }});
            const products = await product_collection.find({_id: { $in: ids.map(id => ObjectId(id)) }}).toArray();
            res.send(products);
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