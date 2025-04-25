const router = require('express').Router()
const User = require('../models/User')
const Course = require('../models/Course')


router.get('/', async (req, res) => {
  const { userID } = req.query;
  
  if (!userID) {
    return res.status(400).send({ message: 'No userID provided' });
  }

  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const { _id, username, email, enrolledCourses } = user;
    const courseIds = enrolledCourses.map(course => course.courseId);
    const courses = await Course.find({ _id: { $in: courseIds } }).select('title image');

    const formattedCourses = courses.map(course => ({
      courseId: course._id.toString(),
      title: course.title,
      image: course.image,
    }));

    res.status(200).send({
      _id,
      username,
      email,
      courses: formattedCourses,
    });
  } catch (err) {
    console.error('Error fetching user courses:', err);
    res.status(500).send({ message: 'Server error' });
  }
});


router.get('/course', async (req, res) => {

    const { userID } = req.query
    const user = await User.findById(userID)
    const course = user.enrolledCourses

    res.send(course)

})
router.get('/course/track', async (req, res) => {
    const { userID, courseId } = req.query
    
    const user = await User.findById(userID)
    const course = user.enrolledCourses.find(c => c.courseId == courseId)
    if (!course) { 
        user.enrolledCourses.push({courseId,completedLessons:[]})
        await user.save()
        const track = 0
        const progress=0
        res.status(200).send({track,progress})
    } 

    const userCourse = await Course.findById(courseId)
    const totalLessons = userCourse.lessons.length

    const track = course.completedLessons.length - 1
    const progress = track / totalLessons
   
    
    res.status(200).send({track,progress})
   
    
})
router.put('/course/completedLesson', async (req, res) => {
    const { userID, courseId, track } = req.body
    console.log(track)
    try {
        const user = await User.findById(userID)
        const course = await Course.findById(courseId)

        if (!user && !course) res.status(400).send({ message: "bad request" })
        
        const lesson = course.lessons.length > track+1 ? course.lessons[track + 1] : null
        
        console.log(course.lessons,"hello")
        //add lesson in the user's completion status track
        if (lesson)
            user.enrolledCourses.find(c => c.courseId == courseId).completedLessons.push(lesson.title)
     
        const updatedUser = await user.save()
        res.status(200).send(updatedUser.enrolledCourses)
       

        
    }
    catch (error) { 
        res.status(500).send({"message": "server error"})
        console.log(error)
    } 
    
})

module.exports = router