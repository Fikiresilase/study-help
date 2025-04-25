const router = require('express').Router();
const Course = require('../models/Course'); 

router.get('/', async (req, res) => {
  try {
   
    const courses = await Course.find();

    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error.message); 
    res.status(500).json({ error: 'Error fetching courses' });
  }
});

module.exports = router;
