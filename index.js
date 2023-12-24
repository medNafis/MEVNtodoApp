const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();

const app = express();

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

app.get('/api/todoappdb/GetNotes', async (req, res) => {
    try {
        const result = await Note.find({});
        console.log(result); // Log the result
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data');
    }
});

app.listen(3000);
