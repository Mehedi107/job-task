import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.blfnk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );

    const taskCollection = client.db('donezo').collection('tasks');
    const userCollection = client.db('donezo').collection('users');

    // Save user info API endpoint
    app.post('/api/users', async (req, res) => {
      try {
        const userData = req.body;
        console.log(userData);
        // Check if user already exists
        const existingUser = await userCollection.findOne({
          email: userData.email,
        });

        if (existingUser) {
          return res.send({ message: 'User already exists' });
        }

        // Insert the new user
        const result = await userCollection.insertOne(userData);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // Create a new task
    app.post('/tasks', async (req, res) => {
      try {
        const result = await taskCollection.insertOne(req.body);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // Get all tasks for a user
    app.get('/tasks/:userEmail', async (req, res) => {
      try {
        const query = { email: req.params.userEmail };
        const tasks = await taskCollection.find(query).toArray();
        res.send(tasks);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // Update a task
    app.patch('/tasks/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: req.body, // This allows updating any field that's sent in the request
        };
        const result = await taskCollection.updateOne(filter, updateDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Failed to update task', error });
      }
    });

    // Delete a task
    app.delete('/tasks/:taskId', async (req, res) => {
      try {
        const taskId = req.params.taskId;
        const query = { _id: new ObjectId(taskId) };
        const result = await taskCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
