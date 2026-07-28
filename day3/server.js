
//BACKEND


require("dotenv").config(); /* it loads the variables in .env */

const express = require("express"); 
const mongoose = require("mongoose");
const cors = require("cors"); /* coz my frontend and backend has diff links it tells server to allow frontend to talk to backend */

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.Mongo_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Connection Error:', err));

app.use('/', authRoutes);
app.use('/tasks', taskRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});