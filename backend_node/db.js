require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.main_db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
 }).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Failed to connect to MongoDB", err);
});

const { Schema } = mongoose;

// Define the user schema
const userSchema = new Schema({
  username: {
    type: String,
     trim: true,
    required: true
  },
  password: {
    type: String,
     trim: true,
    required: true
  },
  firstname: {
    type: String,
     trim: true,
    required: true
  },
  lastname: {
    type: String,
     trim: true,
    required: true
  }
});

// Define the user model
const user = mongoose.model('User', userSchema);

module.exports = { user};
