const express = require('express');
var cors = require('cors');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const key_secret = "MCRIc$Mdyar@mg$tJ?8LCKnSak5Cb$k?Aji@eB"

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;
const uri = "mongodb://localhost:27017";

//let collection;

async function getClient() {
    const client = new MongoClient(uri);
    return client.connect()
}

async function getUserCollection() {
    return getClient().then(client => {
        return client.db("dbtest").collection("users");
    })
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.send({statut: 0, error: "non autorisé"})
    }

    jwt.verify(token, key_secret, (err, user) => {
        if (err) {
            res.send({statut: 0, error: "invalide"})
        }
        req.user = user;
        next();
    });
}

app.get('/get-contacts', authenticateToken, async (req, res) => {
    try {
        let collection = await getUserCollection();
        const user = await collection.findOne({ _id: new ObjectId(`${req.user.id}`) });
        res.json(user.contacts || []);;
    } catch (error) { console.error(error); }
});

app.post('/add-contacts', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone } = req.body;
        const contactId = new ObjectId();
        await addContact(userId, contactId, name, phone);
    } catch (error) { console.error(error); }
    res.send("envoyé")
})

app.post('/rem-contacts', authenticateToken, async (req, res) => {
    let contactId = req.body._id;
    let userId = req.user.id;
    try {
        await removeContact(contactId, userId);
    } catch (error) { console.error(error); }
    res.send("supprimé")
})

app.post('/register', async (req, res) => {
    let collection = await getUserCollection();
    let name = req.body.name;
    let password = req.body.password;
    try {
        const result = await collection.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        //console.log(result)
        if(result){
            res.send({statut: 0, error: "existe deja"})
            return
        }
        bcrypt.hash(password, saltRounds).then(async function (hash) {
            await addUser(name, hash);
        });
    } catch (error) { console.error(error); }
    res.send({statut: 1, error: "ok"})
})

app.post('/login', async (req, res) => {
    let collection = await getUserCollection();
    let name = req.body.name;
    let password = req.body.password;
    try {
        const result = await collection.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if(!result){
            res.send({statut: 0, error: "Nom incorrect"})
            return
        }
        const isPasswordValid = await bcrypt.compare(password, result.password);
        if (!isPasswordValid) {
            res.send({ statut: 0, error: "Mot de passe incorrect" });
            return;
        }
        const accessToken = jwt.sign({ id: result._id }, key_secret);
        res.send({statut: 1, accessToken})
    } catch (error) { console.error(error); }
    //res.send("register")
})

async function addContact(userId, contactId, name, phone) {
    let collection = await getUserCollection();
    try {
        const newContact = {
            contactId: contactId,
            name: name,
            phone: phone
        };
        await collection.updateOne(
            { _id: new ObjectId(`${userId}`) },
            { $push: { contacts: newContact } }
        );
    } catch (error) { console.error(error); }
}

async function addUser(name, password) {
    let collection = await getUserCollection();
    try {
        const user = { name: name, password: password };
        await collection.insertOne(user);
    } catch (error) { console.error(error); }
}

async function removeContact(contactId_, userId) {
    let collection = await getUserCollection();
    try {
        await collection.updateOne(
            { _id: new ObjectId(`${userId}`) },
            { $pull: { contacts: { contactId: new ObjectId(`${contactId_}`) } } }
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
}

app.listen(port, () => {
    console.log("serveur : " + port);
});
