const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();

const app = express();

app.use(cors());

mongoose.connect(process.env.MgDB_Cnx_Str);

const noteSchema = new mongoose.Schema({
    id: String,
    description: String
});

const Note = mongoose.model('Note', noteSchema, 'todoappcollection');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Connected to MongoDB');
});

app.get('/api/todoapp/GetNotes', async (req, res) => {
    try {
        const result = await Note.find({});
        console.log(result); // Log the result
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data');
    }
});

app.post('/api/todoapp/AddNotes', multer().none(), async (req, res) => {
    try {
        // Get the count of all documents in the collection
        const numOfDocs = await Note.countDocuments({});

        // Create a new note
        const newNote = await Note.create({
            id: (numOfDocs + 1).toString(),
            description: req.body.newNotes
        });
        
        // Save the new note to the database
        await newNote.save();

        res.json("Added Successfully");
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding data');
    }
});

app.delete('/api/todoapp/DeleteNotes', async(req, res) => {
    try {
        const result = await Note.deleteOne({ id: req.query.id });
        console.log(result); // Log the result
        res.json("Deleted Successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting data');
    }
})


app.listen(3000);
