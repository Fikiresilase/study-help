const express = require('express');
const { getLessonContent } = require('../controllers/lesson');
const {validateAnswer} =  require('../controllers/lesson');


const router = express.Router();

router.get('/content', getLessonContent);
router.post('/validateAnswer',validateAnswer)

module.exports = router;
