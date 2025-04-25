const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const lessonRoutes = require('./routes/lesson');
const course = require('./routes/course');
const user = require('./routes/user')
const chat = require('./routes/chatAi')

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect('mongodb://localhost/authDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/auth', authRoutes);
app.use('/lesson', lessonRoutes);
app.use('/courses', course);
app.use('/user', user)
app.use('/chat',chat)
 
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   