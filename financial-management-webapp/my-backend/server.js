const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const { exec } = require('child_process');
const User = require('../db/User');
const Transaction = require('../db/Transaction')
const app = express();
const port = 3000;

const path = require('path');
const mongoose = require('mongoose');

// Enable CORS for all origins
app.use(cors());
app.use(bodyParser.json()); // To parse JSON body

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

mongoose.connect('mongodb+srv://KevinG:gkw82bsd@financial-management.alzcrxd.mongodb.net/?retryWrites=true&w=majority&appName=Financial-Management', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

app.get('/transactions', async (req, res) => {
    try {
        const { user } = req.query; // Get the user ID from the query string
        const transactions = await Transaction.find({ user });
        res.status(200).json(transactions);
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

  
app.delete('/transactions/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        await transaction.remove();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error('Error deleting transaction:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});


app.post('/transactions', async (req, res) => {
    try {
        const { text, amount, category, user } = req.body;

        const newTransaction = new Transaction({ text, amount, category, user });


        const transaction = await newTransaction.save();

        res.status(201).json({
            success: true,
            data: transaction,
            msg: 'User registered successfully'
        });
    } catch (err) {
        console.error('Error during adding transaction:', err);
        res.status(500).send('Server error');
    }
});


app.post('/SignUp', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({ email, password });
        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error('Error during signup:', err); // More detailed error logging
        res.status(500).send('Server error');
    }
});

app.post('/SignIn', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(400).json({ success: false, msg: 'Invalid credentials' });
        }

        const isMatch = (password === user.password); // For simplicity, not hashed. Hash your passwords in production!

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        res.json({ success: true, userId: user._id });
    } catch (err) {
        console.error('Error during signin:', err); // More detailed error logging
        res.status(500).send('Server error');
    }
});

  
// app.post('/data', (req, res) => {
//     console.log('Received data:', req.body); // Log data to terminal
//     res.json({ message: 'Data received successfully', receivedData: req.body }); // Respond with data
// });

app.post('/data', (req, res) => {
    const userData = req.body; // This is the data you want to send to Python

    console.log('Received data:', req.body); // Log data to terminal

    // Convert the data to a JSON string
    const dataString = JSON.stringify(userData);
    console.log(dataString)
    // Path to the Python script
    const scriptPath = path.join(__dirname, 'model.py');
    

    // Execute the Python script
    exec(`python ${scriptPath} '${dataString}'`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error executing script:', error);
            return res.status(500).json({ message: 'Failed to train model', error: error.message });
        }
        console.log('Script output:', stdout);
        res.json({ message: 'Model trained and saved successfully', scriptOutput: stdout });
    });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
