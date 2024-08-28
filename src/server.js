const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session'); // Import express-session
const flash = require('connect-flash');

dotenv.config();

// Import routes
const userRoute = require('./routes/userRoute');
const otpRoute = require('./routes/otpRoute');
const projectRoute = require('./routes/projectRoute');
const emailRoute = require('./routes/emailRoute');
const bidRoute = require('./routes/bidRoute');
const stripePayment = require('./routes/stripePayment');

const app = express();

const port = process.env.PORT || 8080;
const MongoURL = process.env.MONGO_URL;

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

// Configure session and flash middleware
app.use(session({
  secret: 'your_secret_key', // Replace with a secure random string
  resave: false,
  saveUninitialized: false,
}));

app.use(flash());

// Define routes
app.use('/api', userRoute);
app.use('/api', otpRoute);
app.use('/api', projectRoute);
app.use('/api', emailRoute);
app.use('/api', bidRoute);
app.use('/stripe', stripePayment);

// Connect to MongoDB
mongoose
  .connect(MongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error('Connection failed:', err);
  });

app.listen(port, () => {
  console.log(`Server is active on port ${port}`);
});

module.exports = app;
