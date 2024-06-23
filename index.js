const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');


const app = express();
const port = 8080;


app.use(bodyParser.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mithleshgupta241@gmail.com', 
        pass: 'gskr qpyt nppl vaem', 
    },
})


app.post('/api/sendOTP', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email address is required' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

   
    const mailOptions = {
        from: 'mithleshgupta241@gmail.com', 
        to: email, 
        subject: 'Your OTP for Verification', 
        text: `Your OTP is ${otp}. Use this code to verify your email.`, 
    };

    try {
        
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

const mongoURI = 'mongodb+srv://mithleshgupta241:Kj7RLT9urcDDW49n@cluster0.fnmns6a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your MongoDB connection URI
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB'));
db.on('error', (err) => console.error('MongoDB connection error:', err));

const Tour = mongoose.model('Tour', {
    title: String,
    description: String,
    price: String,
    city: String,
    category: String,
    date: String,
    timeSlot: String,
    meetingPoint: String,
});

app.post('/api/saveTour', (req, res) => {
    const tourData = req.body;
    const newTour = new Tour(tourData);
    newTour.save()
        .then(() => res.status(200).json({ message: 'Tour saved successfully' }))
        .catch(err => res.status(400).json({ error: err.message }));
});

app.get('/api/getRatings', (req, res) => {
    Tour.find()
        .then(tours => res.json(tours))
        .catch(err => res.status(400).json({ error: err.message }));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
