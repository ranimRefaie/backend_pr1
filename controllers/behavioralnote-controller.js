const { Student, BehavioralNote} = require('../models/studentModel')

//Admin Dashboard
 // Add a new note
const addBnote = async (req, res) => {
    try {
        const { fullName, type, note, date } = req.body;
    
        // Find the student based on fullName
        const student = await Student.findOne({ fullName });
        if (!student) {
          return res.status(404).json({ error: 'Student not found' });
        }
    
        // Create the new note
        const newBnote = new BehavioralNote({
          studentId: student._id,
         type,
         note,
         date
        });
    
        // Save the test to the database
        await newBnote.save();
    
        res.status(201).json({ message: 'Note added successfully', Behavioralnote: newBnote });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

//GET all notes
const getBnotes = async(req, res) => {
    try {
        // Fetch all notes from the database
        const notes = await BehavioralNote.find().sort({createdAt: -1})
        .populate('studentId', 'fullName') // Populating fullName from Student model
        .exec();
            
        // Respond with the list of notes
        res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching notes' });
    }
}


// GET notes by student's name
const studentBnote = async (req, res) => {
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

        // Find all notes associated with the student's _id
        const notes = await BehavioralNote.find({ studentId: student._id });

        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

} 

//Update a note
const updateBnote =  async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Data to update

    try {
        const updatedBnotes = await BehavioralNote.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedBnotes) {
            return res.status(404).json({ message: 'Behavioral Note not found' });
        }

        res.status(200).json({ message: 'Behavioral Note updated successfully', updatedNote: updatedBnotes });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

// Delete a note
const deleteBnote =  async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBnotes = await BehavioralNote.findByIdAndDelete(id);

        if (!deletedBnotes) {
            return res.status(404).json({ message: 'Behavioral Note not found' });
        }

        res.status(200).json({ message: 'Behavioral Note deleted successfully', deletedNote: deletedBnotes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the Behavioral Note' });
    }
};


//Student Dashboard

const getStudentBnotes = async (req, res) => {
    try {
        // The user ID is now available in req.userId from the verified token
        const notes = await BehavioralNote.find({ studentId: req.userId }).sort({createdAt: -1});

        if (!notes || notes.length === 0) {
            return res.status(404).json({ message: 'No notes found for the student' });
        }

        res.json({
            message: 'Notes fetched successfully',
            notes,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    } 
};

module.exports = {addBnote, getBnotes, studentBnote, updateBnote, deleteBnote, getStudentBnotes};