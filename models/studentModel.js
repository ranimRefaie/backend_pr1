const mongoose = require('mongoose')

const Schema = mongoose.Schema

// Student Schema
const studentSchema = new Schema({
    username: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    fullName: { type: String, required: true },
    fathersName: { type: String, required: true },
    mothersName: { type: String, required: true },
    sex: { type: String, enum: ['Male', 'Female'], required: true },
    mobileNumber: { type: String, required: true },
    sclass: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, // Default to false, indicating a regular user
             },
}, { timestamps: true });


// Quiz Schema
const quizSchema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    quizName: { type: String, required: true },
    subject: { type: String, required: true },
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

// Test Result Schema
const testResultSchema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    testName: { type: String, required: true },
    subject: { type: String, required: true },
    mark: { type: Number, required: true },
    totalMark: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

// Behavioral Note Schema
const behavioralNoteSchema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    type: { type: String, enum: ['Positive', 'Negative'], required: true },
    note: { type: String, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

// Absence Schema
const absenceSchema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ['Excused', 'Unexcused'], required: true }
}, { timestamps: true });

// Announcement Schema
const announcementSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

// Models
const Student = mongoose.model('Student', studentSchema);
const Quiz = mongoose.model('Quiz', quizSchema);
const TestResult = mongoose.model('TestResult', testResultSchema);
const BehavioralNote = mongoose.model('BehavioralNote', behavioralNoteSchema);
const Absence = mongoose.model('Absence', absenceSchema);
const Announcement = mongoose.model('Announcement', announcementSchema);

// Exporting all models
module.exports = {
    Student,
    Quiz,
    TestResult,
    BehavioralNote,
    Absence,
    Announcement
};
