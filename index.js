const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const port = process.env.PORT || 5055;

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kmkzt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("amanaExpress").collection("products");
    const orderCollection = client.db("amanaExpress").collection("orders");

    app.get('/products', (req, res) => {
        collection.find()
            .toArray((err, product) => {
                res.send(product);
            })
    })
    app.get('/orders', (req, res) => {
        const queryEmail = req.query.email;
        orderCollection.find({ email: queryEmail })
            .toArray((err, items) => {
                res.send(items);
            })
    })
    app.get('/:id', (req, res) => {
        const id = req.params.id
        collection.find({ _id: ObjectId(id) })
            .toArray((err, item) => {
                res.send(item[0]);
            })
    })

    app.post('/addProduct', (req, res) => {
        const newProduct = req.body
        collection.insertOne(newProduct)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        orderCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.delete('/delete/:id', (req, res) => {
        // console.log(req.params.id);
        collection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
                // res.redirect('http://localhost:3000')
                console.log(result);
            })
    })

});

app.listen(port)