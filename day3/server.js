require("dotenv").config()

const mongoose = require("mongoose")
const express = require ("express")
const bcrypt = require ("bcrypt")
const app = express()

app.use(express.json()); 

mongoose.connect(process.env.Mongo_URI ) //this line tells mangoose to open a connection and take mango URi from env file
    .then(() => console.log ('Sucess'))
    .catch ((err) => console.log ("connection Error:" , err))
const userSchema = new mongoose.Schema({
   username : {type: String , required : true },
   useremail : {type: String , required :  true},
   password : {type : String , required : true}

})

const User = mongoose.model ('User', userSchema)


app.post('/register' , async (req , res) => {
    const hashedPassword = await bcrypt.hash(req.body.password ,10)

 const newUser = await User.create({
    username : req.body.username,
    useremail : req.body.useremail,
    password : hashedPassword
 })
 res.status(201).json({
    id: newUser._id,
    username: newUser.username,
    useremail: newUser.useremail,
  });

})
const jwt = require('jsonwebtoken');

app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ useremail: req.body.useremail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id, useremail: user.useremail },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

app.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.user.useremail}`, user: req.user });
});

app.listen (3000, () => {
    console.log ("This is running on port 3000");
})
