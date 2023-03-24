const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = 3000;

const url = 'mongodb://0.0.0.0:27017';
const dbName = 'myperiodbook';

app.use(express.json());

// login route with express
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)

  try {
    // connecting to mongo
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);

    // find and verify password
    const user = await db.collection('users').findOne({ email });
    if (password == user.password) {
      res.send('Login successful');
    } else {
      res.status(401).send('username or password incorrect');
    }

    client.close();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// signup route with express
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)

  try {
    // connecting to mongo
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);

    // check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      res.status(409).send('User already exists');
      return;
    }

    // create new user
    const newUser = { email, password };
    const result = await db.collection('users').insertOne(newUser);
    console.log(`A new user was created with the _id: ${result.insertedId}`);
    res.send('Signup successful');

    client.close();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});