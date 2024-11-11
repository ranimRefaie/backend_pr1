const {Announcement} = require('../models/studentModel')

// Add a new announcement
const addAnouncement = async (req, res) => {
    try {
        // Extract data from the request body
        const {
            title,
            description,
            date
        } = req.body;

        // Create a new announcement instance
        const newAnnouncement = new Announcement({
            title,
            description,
            date
        });

        // Save the announcement to the database
        await newAnnouncement.save();

        // Send a response back with the created announcement
        res.status(200).json({ message: 'Announcement created successfully', announcement: newAnnouncement });
    } 
    catch (error) {
        // Handle any validation or server errors
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

//GET all announcements
const getAnnouncements = async(req, res) => {
    try {
        // Fetch all announcements from the database
        const announcements = await Announcement.find().sort({createdAt: -1});
        
        // Respond with the list of announcements
        res.status(200).json(announcements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching announcements' });
    }
}


//Update an announcement
const updateAnnouncement =  async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Data to update

    try {
        const updatedAnnouncements = await Announcement.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedAnnouncements) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.status(200).json({ message: 'Announcement updated successfully', updatedannouncemnt: updatedAnnouncements });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

// Delete an announcement
const deleteAnnouncement =  async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAnnouncements = await Announcement.findByIdAndDelete(id);

        if (!deletedAnnouncements) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.status(200).json({ message: 'Announcement deleted successfully', deletedAnnouncement: deletedAnnouncements });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the Announcement' });
    }
};

module.exports = {addAnouncement, getAnnouncements, updateAnnouncement, deleteAnnouncement}