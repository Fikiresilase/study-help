require('dotenv').config();
const config = require('config');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const aiResponse = require('../utils/aiResponse');
const Course = require('../models/Course');
const User = require('../models/User');


const generateLessonContentWithAI = async (courseName, lessonTitle) => {
  try {
    const prompt = `
      Course Name: ${courseName}
      Lesson Title: ${lessonTitle}
      Return a raw, valid JSON string with the following fields according to the lesson title and the course mentioned above:
      - "mainLesson": Detailed lesson content with practical examples and context (20-50 words).
      - "codeExample": Practical code example with practical examples and context .
      - "shortNotice": Short summary of the key takeaway (max 20 words).
      - "quizQuestion": One practical quiz question on hands-on coding (max 20 words).
      Example: {"mainLesson": "example content...", "shortNotice": "key takeaway...", "quizQuestion": "question..."}
      Do not include any programming code (e.g., Python import json or json.dumps or backtics), markdown, or extra text outside the JSON string. Return only the raw JSON string.
    `;

    const responseText = await aiResponse(prompt); 

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      const jsonMatch = responseText.match(/json\.dumps\(\s*({[\s\S]*?})\s*\)/) || responseText.match(/{[\s\S]*}/);
      if (jsonMatch) {
        try { 
          const jsonString = jsonMatch[1] || jsonMatch[0];
          parsedResponse = JSON.parse(jsonString);
        } catch (fallbackError) {
          console.error('Fallback parsing failed:', fallbackError.message);
          throw new Error('Invalid response format from API');
        }
      } else {
        console.error('No valid JSON found in response:', responseText);
        throw new Error('Invalid response format from API');
      }
    }

    const { mainLesson, shortNotice,codeExample, quizQuestion } = parsedResponse;
    if (!mainLesson || !shortNotice || !quizQuestion || !codeExample) {
      console.error('Incomplete JSON response:', parsedResponse);
      throw new Error('Incomplete response from API');
    }

    return { mainLesson,codeExample, shortNotice, quizQuestion };
  } catch (error) {
    console.error('Error generating lesson content:', error.message);
    return { error: error.message };
  }
};


const getLessonContent = async (req, res) => {
  const { courseId, userId } = req.query;

  if (!courseId || !userId) { 
    return res.status(400).json({ error: 'Both courseId and userId are required.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const userCourse = user.enrolledCourses.find(c => c.courseId == courseId); 
    if (!userCourse) {
      return res.status(405).json({ error: 'Course not found.' }); 
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    let lesson;
    if (userCourse.completedLessons.length > 0) {
      let index = userCourse.completedLessons.length - 1;
      if (!index < course.lessons.length) lesson = 'You have completed the course'; 
      else lesson = course.lessons[index].title;
    } else {
      lesson = course.lessons[0].title;
    }

    const result = await generateLessonContentWithAI(course.title, lesson);
    if (result.error) {
      return res.status(500).json({ error: result.error });
    }
    console.log(result)

    return res.status(200).json({
      lessonTitle: lesson,  
      mainLesson: result.mainLesson,
      codeExample: result.codeExample,
      shortNotice: result.shortNotice,
      quizQuestion: result.quizQuestion,
    });
  } catch (error) {
    console.error('Error fetching lesson content:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

const validateAnswer = async (req, res) => {
  const { answer, question } = req.body;

  if (!answer || !question) {
    return res.status(400).json({ error: 'Both answer and question are required.' });
  }

  try {
    const prompt = `
      Check the following code for the question "${question}" and point out syntax and logical errors.
      Evaluate the snippet's quality out of 10 and explain your metrics.
      Code: ${answer}
    `;

    const result = await aiResponse(prompt); 
    res.status(200).send(result); 
  } catch (error) {
    console.error('Error validating answer:', error.message);
    res.status(500).send('Model exhausted. Try again later.');
  }
};

module.exports = { getLessonContent, validateAnswer };