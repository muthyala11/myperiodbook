const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = 3000;

const url = 'mongodb://0.0.0.0:27017';
const dbName = 'myperiodbook';

app.use(express.json());

// Handle login requests
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)

  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);

    // Find user by email
    const user = await db.collection('users').findOne({ email });

    // Verify password
    if (password == user.password) {
      res.send('Login successful');
    } else {
      res.status(401).send('Invalid credentials');
    }

    client.close();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});