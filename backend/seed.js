const fs = require('fs');
const mongoose = require('mongoose');
const Course = require('./models/course'); // Adjust the path as necessary


// MongoDB connection setup
mongoose
  .connect('mongodb://localhost/authDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Array of course IDs and their corresponding image filenames
const courseData = [
  { courseId: '6750cd5cc95096c071a5acb7', imagePath: './assets/React.png' },
  { courseId: '6750cd5cc95096c071a5acbb', imagePath: './assets/node.jpg' },
  { courseId: '6750cd5cc95096c071a5acbf', imagePath: './assets/flutter.png' }
];

// Function to upload images for the courses
const uploadImages = async () => {
  for (const { courseId, imagePath } of courseData) {
    try {
      // Read the image file and convert it to a Buffer
      const imageBuffer = fs.readFileSync(imagePath);

      // Find the course by ID and update the image field with the Buffer
      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        { image: imageBuffer },
        { new: true } // Return the updated document
      );

      if (updatedCourse) {
        console.log(`Image uploaded for course ID: ${courseId}`);
      } else {
        console.log(`Course with ID ${courseId} not found.`);
      }
    } catch (error) {
      console.error(`Error uploading image for course ID ${courseId}:`, error);
    }
  }
};

// Run the upload process
uploadImages();
