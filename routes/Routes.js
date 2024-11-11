const express = require('express')

const router = express.Router()
const multer = require('multer');

const LogIn = require('../controllers/login-controller.js');
const LogOut = require('../controllers/logout-controller.js');
const {getStudents, addStudent, getSearchStudent, updateStudent, deleteStudent, getStudentInfo, getAdmins} = require('../controllers/student-controller.js');
const {addQuiz,getQuizzes, studentQuiz, updateQuiz, deleteQuiz, getStudentQuizzes} = require('../controllers/quiz-controller.js')
const {addTest, getTests, studentTest, updateTest, deleteTest, getStudentTests} = require('../controllers/testresult-controller.js')
const {addAbsence, getAbsences, studentAbsences, updateAbsence, deleteAbsence, getStudentAbsences} = require('../controllers/absence-controller.js')
const {addBnote, getBnotes, studentBnote, updateBnote, deleteBnote, getStudentBnotes} = require('../controllers/behavioralnote-controller.js')
const {addAnouncement, getAnnouncements, updateAnnouncement, deleteAnnouncement} = require('../controllers/announcement-controller.js')
const {sendEmail, sendJobApplicationEmail} = require('../controllers/email-controller.js')
const verifyToken = require('../middleware/verifyToken.js');


//Admin Routes
// LogIn
router.post('/Login', LogIn);

router.get('/Login', (req, res) => {
    res.send('This is the login page');
});

// LogOut
router.get('/Logout', LogOut);

//Get all admins
router.get('/admins', getAdmins)


// Students

//GET all Students
router.get('/Students', getStudents)

//GET a searched student
router.get('/Students/search', getSearchStudent)

// POST a new student
router.post('/Student', addStudent)

// PATCH a student
router.patch('/Student/:id', updateStudent)

// DELETE a student
router.delete('/Student/:id', deleteStudent)


// Quizzes

//POST a new quiz
router.post('/quiz', addQuiz)

//GET all quizzes
router.get('/quizzes', getQuizzes)

//GET all quizzes for a student
router.get('/quizzes/search', studentQuiz)

//PATCH a quiz
router.patch('/quiz/:id', updateQuiz)

// DELETE a quiz
router.delete('/quiz/:id', deleteQuiz)


// Tests

//POST a new test
router.post('/test', addTest)

//GET all tests
router.get('/tests', getTests)

//GET all tests for a student
router.get('/tests/search', studentTest)

//PATCH a test
router.patch('/test/:id', updateTest)

// DELETE a test
router.delete('/test/:id', deleteTest)


// Absences

//POST a new absence
router.post('/absence', addAbsence)

//GET all absences
router.get('/absences', getAbsences)

//GET all absences for a student
router.get('/absences/search', studentAbsences)

//PATCH an absence
router.patch('/absence/:id', updateAbsence)

// DELETE an absence
router.delete('/absence/:id', deleteAbsence)


// Behavioral Notes

//POST a new Behavioral Note
router.post('/note', addBnote)

//GET all Behavioral Notes
router.get('/notes', getBnotes)

//GET all Behavioral Notes for a student
router.get('/notes/search', studentBnote)

//PATCH a Behavioral Note
router.patch('/note/:id', updateBnote)

// DELETE a Behavioral Note
router.delete('/note/:id', deleteBnote)


//Announcements

//POST a new Announcement
router.post('/announcement', addAnouncement)

//GET all Announcements
router.get('/announcements', getAnnouncements)

//PATCH an Announcement
router.patch('/announcement/:id', updateAnnouncement)

// DELETE an Announcement
router.delete('/announcement/:id', deleteAnnouncement)




//Student Routes


//GET Student info
router.get('/student/info', verifyToken, getStudentInfo)

 //GET Student quizzes
router.get('/student/quizzes', verifyToken, getStudentQuizzes)

 //GET Student tests
 router.get('/student/tests', verifyToken, getStudentTests)

 //GET Student absences
 router.get('/student/absences', verifyToken, getStudentAbsences)

 //GET Student behavioral notes
 router.get('/student/bnotes', verifyToken, getStudentBnotes)

 router.get('/student/announcements', verifyToken, getAnnouncements)


//Email Routes

//Contact us
 router.post('/send-email', sendEmail)


//Job Application
 const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  const upload = multer({ storage });
  
    //Route
 router.post('/cv-email', upload.single('file'), sendJobApplicationEmail);



module.exports = router