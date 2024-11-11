const { default: mongoose } = require('mongoose');
const { Student, Quiz, TestResult, BehavioralNote, Absence } = require('../models/studentModel')


//Get all students
const getStudents = async (req, res) => {
    try {
        // Find all students
        const students = await Student.find({ isAdmin: false }).select('-isAdmin').sort({createdAt:-1}); // Exclude isAdmin field

        // Send the response
        res.json(students);
    } 
    catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching students' });
    }
};


// Add new student
const addStudent = async (req, res) => {
    try {
        // Extract data from the request body
        const {
            username,
            Password,
            fullName,
            fathersName,
            mothersName,
            sex,
            mobileNumber,
            sclass,
            isAdmin = false // If not provided, default to false
        } = req.body;

        // Create a new student instance
        const newStudent = new Student({
            username,
            Password,
            fullName,
            fathersName,
            mothersName,
            sex,
            mobileNumber,
            sclass,
            isAdmin
        });

        // Save the student to the database
        await newStudent.save();

        // Send a response back with the created student
        res.status(200).json({ message: 'Student created successfully', student: newStudent });
    } 
    catch (error) {
        // Handle any validation or server errors
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};


// Update a student 
const updateStudent = async (req, res) => {
    const { id } = req.params; 

    // Check if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid student ID" });
    }

    try {
        // Find the student by _id and update the provided fields
        const updatedStudent = await Student.findByIdAndUpdate(
            id,                // Use the _id from the parameters
            req.body,       
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.status(200).json({ message: 'Student updated successfully', updatedStudent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


// Delete a student
const deleteStudent = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the student by _id
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Use the student's _id to delete associated records
        const studentId = student._id;

        // Delete associated quizzes, test results, and absences
        await Promise.all([
            Quiz.deleteMany({ studentId }),
            TestResult.deleteMany({ studentId }),
            BehavioralNote.deleteMany({ studentId }),
            Absence.deleteMany({ studentId }),
        ]);

        // Now delete the student
        await Student.deleteOne({ _id: studentId });

        // Respond with success
        res.status(200).json({ message: 'Student and associated data deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the student' });
}
};


// GET all students that match the searched full name
const getSearchStudent =  async (req, res) => {
    const fullName = req.query.fullName;

    if (!fullName) {
        return res.status(400).json({ message: 'fullName query parameter is required' });
    }

    try {
        // Use a case-insensitive regex to search for students whose fullName matches
        const students = await Student.find({ fullName: { $regex: new RegExp(fullName, 'i') } });

        if (students.length === 0) {
            return res.status(404).json({ message: 'No students found' });
        }

        res.status(200).json(students);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const getStudentInfo = async (req, res) => {
    try {
        const studentId = req.userId; // Get user ID from verified token
        const student = await Student.findById(studentId).select('-Password'); // Exclude password from the result

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({
            username: student.username,
            fullName: student.fullName,
            fathersName: student.fathersName,
            mothersName: student.mothersName,
            mobileNumber: student.mobileNumber,
            sclass: student.sclass,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

 //Get all admins
 const getAdmins = async (req, res) => {
    try {
        // Find all students
        const admins = await Student.find({ isAdmin: true }); // Exclude isAdmin field

        // Send the response
        res.json(admins);
    } 
    catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching admins' });
    }
};




module.exports = {getStudents, addStudent, getSearchStudent, updateStudent, deleteStudent, getStudentInfo, getAdmins};