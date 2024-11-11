const { Student, Absence } = require('../models/studentModel')

//Admin Dashboard

 // Add a new absence
const addAbsence = async (req, res) => {
    try {
        const { fullName, date, type} = req.body;
    
        // Find the student based on fullName
        const student = await Student.findOne({ fullName });
        if (!student) {
          return res.status(404).json({ error: 'Student not found' });
        }
    
        // Create the new absence
        const newAbsence = new Absence({
          studentId: student._id,
          date,
          type
        });
    
        // Save the absence to the database
        await newAbsence.save();
    
        res.status(201).json({ message: 'Absence added successfully', absence: newAbsence });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

//GET all absences
const getAbsences = async(req, res) => {
    try {
        // Fetch all absences from the database
        const absences = await Absence.find().sort({date: -1})
        .populate('studentId', 'fullName') // Populating fullName from Student model
        .exec();
    
        // Respond with the list of absences
        res.status(200).json(absences);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching absences' });
    }
}


// GET absences by student's name
const studentAbsences = async (req, res) => {
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

        // Find all absences associated with the student's _id
        const absences = await Absence.find({ studentId: student._id });

        res.json(absences);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

} 

//Update an absence
const updateAbsence =  async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Data to update

    try {
        const updatedAbsences = await Absence.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedAbsences) {
            return res.status(404).json({ message: 'Abcense not found' });
        }

        res.status(200).json({ message: 'Absence updated successfully', updatedAbcense: updatedAbsences });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

// Delete an absence
const deleteAbsence =  async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAbsences = await Absence.findByIdAndDelete(id);

        if (!deletedAbsences) {
            return res.status(404).json({ message: 'Absence not found' });
        }

        res.status(200).json({ message: 'Absence deleted successfully', deletedAbsence: deletedAbsences });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the absence' });
    }
};


//Student Dashboard

const getStudentAbsences = async (req, res) => {
    try {
        // The user ID is now available in req.userId from the verified token
        const absences = await Absence.find({ studentId: req.userId }).sort({date: -1});

        if (!absences || absences.length === 0) {
            return res.status(404).json({ message: 'No absences found for the student' });
        }

        res.json({
            message: 'Absences fetched successfully',
            absences,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    } 
};

module.exports = {addAbsence, getAbsences, getAbsences, studentAbsences, updateAbsence, deleteAbsence, getStudentAbsences};