import { useContext, useEffect, useState } from "react";
import AuthContext from "../auth/authContext";
import apiClient from "../services/apiClient";

const useLesson = (route) => {
  const authContext = useContext(AuthContext);
  const courseId = route.params.courseId;
  const [error, setError] = useState(null); 
  const [lessonTitle, setLessonTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [codeExample, setCodeExample] = useState(null); 
  const [shortNotice, setShortNotice] = useState(null);
  const [quizQuestion, setQuizQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchLesson = async () => {
      const userId = authContext.user.id;
      try {
        const response = await apiClient.get('/lesson/content', {
          params: { courseId, userId }
        });
        const { lessonTitle, mainLesson,codeExample, shortNotice, quizQuestion } = response.data;

        setLessonTitle(lessonTitle);
        setShortNotice(shortNotice);
        setContent(mainLesson);
        setCodeExample(codeExample);
        setQuizQuestion(quizQuestion);
      } catch (error) {
        setError('Failed to fetch content. Please try again. ' + error.message);
      } finally {
        setLoading(false);
       
      }
    };

    fetchLesson(); 

    
  }, [route.params]);

  console.log(content,"from hook")
  return { 
    lessonTitle, 
    content, 
    codeExample,
    shortNotice, 
    setShortNotice, 
    quizQuestion, 
    loading, 
    error, 
    setError 
  };
};

export default useLesson;