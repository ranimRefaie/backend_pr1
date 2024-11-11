const { Student, Quiz } = require('../models/studentModel')


//Admin Dashboard

 // Add a new quizz
const addQuiz = async (req, res) => {
    try {
        const { fullName, quizName, subject, score, maxScore, date } = req.body;
    
        // Find the student based on fullName
        const student = await Student.findOne({ fullName });
        if (!student) {
          return res.status(404).json({ error: 'Student not found' });
        }
    
        // Create the new quiz
        const newQuiz = new Quiz({
          studentId: student._id,
          quizName,
          subject,
          score,
          maxScore,
          date
        });
    
        // Save the quiz to the database
        await newQuiz.save();
    
        res.status(201).json({ message: 'Quiz added successfully', quiz: newQuiz });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}


//GET all quizzes
const getQuizzes = async (req, res) =>{
    try {
        const quizzes = await Quiz.find().sort({createdAt: -1})
            .populate('studentId', 'fullName') // Populating fullName from Student model
            .exec();

        res.json(quizzes); // Send the quizzes as a JSON response
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


// GET quizzes by student's name
const studentQuiz = async (req, res) => {
    const fullName = req.query.fullName; // Get the student's fullName from the query parameters

    if (!fullName) {
        return res.status(400).json({ message: 'fullName query parameter is required' });
    }

    try {
        // Find the student by fullName
        const student = await Student.findOne({ fullName: { $regex: new RegExp(fullName, 'i') } });


        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Find all quizzes associated with the student's _id
        const quizzes = await Quiz.find({ studentId: student._id });

        res.json(quizzes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

} 

//Update a quiz
const updateQuiz =  async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Data to update

    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(200).json({ message: 'Quiz updated successfully', updatedQuiz });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

// Delete a quiz
const deleteQuiz =  async (req, res) => {
    const { id } = req.params;

    try {
        const deletedQuiz = await Quiz.findByIdAndDelete(id);

        if (!deletedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(200).json({ message: 'Quiz deleted successfully', deletedQuiz });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the quiz' });
    }
};

//GET all quizzes
/*const getQuizzes = async(req, res) => {
    try {
        // Fetch all quizzes from the database
        const quizzes = await Quiz.find();
        
        // Respond with the list of quizzes
        res.status(200).json(quizzes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching quizzes' });
    }
}
*/



//Student Dashboard

const getStudentQuizzes = async (req, res) => {
  
        try {
            // The user ID is now available in req.userId from the verified token
            const quizzes = await Quiz.find({ studentId: req.userId }).sort({createdAt: -1});
    
            // Check if quizzes exist
            if (!quizzes || quizzes.length === 0) {
                return res.status(404).json({ message: 'No quizzes found for the student' });
            }
    
            // Return the quizzes
            res.json({
                message: 'Quizzes fetched successfully',
                quizzes,
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        } 
};

module.exports = {addQuiz,getQuizzes, studentQuiz, updateQuiz, deleteQuiz, getStudentQuizzes};