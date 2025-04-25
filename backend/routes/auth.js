require('dotenv').config();
const config = require('config');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/User');

const router = express.Router();
const jwtkey=config.get('jwtKey')
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
 
  const { email, password } = req.body;
   
  
   try {
     const user = await User.findOne({ email: email });  
     const validPassword = await bcrypt.compare(password, user.password)
     
     if (user && validPassword) {
       console.log( config.get('jwtKey'))
       const token = jwt.sign({ id: user._id }, config.get('jwtKey.jwtSecretKey'))
       res.send(token)
     }
    
  }    
   catch (error) {  
     console.log(error,jwtkey)
     res.status(400).json({message:'Email or password is incorrect'})
  }
  
})   

module.exports = router;
