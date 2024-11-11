const { Student, TestResult } = require('../models/studentModel')

// Admin Dashboard
 // Add a new test
const addTest = async (req, res) => {
    try {
        const { fullName, testName, subject, mark, totalMark, date } = req.body;
    
        // Find the student based on fullName
        const student = await Student.findOne({ fullName });
        if (!student) {
          return res.status(404).json({ error: 'Student not found' });
        }
    
        // Create the new test
        const newTest = new TestResult({
          studentId: student._id,
          testName,
          subject,
          mark,
          totalMark,
          date
        });
    
        // Save the test to the database
        await newTest.save();
    
        res.status(201).json({ message: 'Test added successfully', test: newTest });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

//GET all quizzes
const getTests = async (req, res) =>{
    try {
        const tests = await TestResult.find().sort({createdAt: -1})
            .populate('studentId', 'fullName') // Populating fullName from Student model
            .exec();

        res.json(tests); // Send the quizzes as a JSON response
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
/*
//GET all tests
const getTests = async(req, res) => {
    try {
        // Fetch all tests from the database
        const tests = await TestResult.find();
        
        // Respond with the list of tests
        res.status(200).json(tests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching tests' });
    }
}*/


// GET tsts by student's name
const studentTest = async (req, res) => {
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

        // Find all tests associated with the student's _id
        const tests = await TestResult.find({ studentId: student._id });

        res.json(tests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

} 

//Update a test
const updateTest =  async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Data to update

    try {
        const updatedTests = await TestResult.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedTests) {
            return res.status(404).json({ message: 'Test not found' });
        }

        res.status(200).json({ message: 'Test updated successfully', updatedTest: updatedTests });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

// Delete a test
const deleteTest =  async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTests = await TestResult.findByIdAndDelete(id);

        if (!deletedTests) {
            return res.status(404).json({ message: 'Test not found' });
        }

        res.status(200).json({ message: 'Test deleted successfully', deletedTest: deletedTests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the test' });
    }
};


//Student Dashboard

const getStudentTests = async (req, res) => {
    try {
        // The user ID is now available in req.userId from the verified token
        const tests = await TestResult.find({ studentId: req.userId }).sort({createdAt: -1});

        if (!tests || tests.length === 0) {
            return res.status(404).json({ message: 'No tests found for the student' });
        }

        res.json({
            message: 'Tests fetched successfully',
            tests,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    } 
};



module.exports = {addTest, getTests, studentTest, updateTest, deleteTest, getStudentTests};