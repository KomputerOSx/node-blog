import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import {getBooks, getBook, createBook, deleteBook, updateBook} from "./database.js";

import cors from 'cors';


// const express = require("express");
// const path = require("path");
// const { fileURLToPath } = require('url');
// const { dirname } = require('path');
//
// const { getBooks, getBook, createBook, deleteBook, updateBook } = require('./database.js');
//


const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static('src'));
app.use(express.static('public'));


app.use(express.json());
app.use(cors());


app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})


//setup static folder

// app.use(express.static(path.join(__dirname)));
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/src/html/index.html');
// });


app.use(express.static('src/html', {
    extensions: ['html', 'htm']
}));

app.get("/", (req, res) => {
    res.sendfile("src/html/index.html");
})

app.get("/contact_us", (req, res) => {
    res.sendfile("src/html/contact_us");
})


app.get("/about", (req, res) => {
    res.sendfile("src/html/about");
})



app.get("/books", async (req, res) => {
    const books = await getBooks(req);
    res.send(books);
});

app.get("/books/:id", async (req, res, next) => {
    try {
        const book = await getBook(req.params.id);
        if (!book) {
            const error = new Error('Book not found');
            error.status = 404;
            throw error;
        }
        res.send(book);
    } catch (error) {
        next(error);
    }
});


app.post("/books", async (req, res) => {
    const { title, author, pages, year, is_read } = req.body; // Removed id from destructuring
    const book = [title, author, pages, year, is_read]; // No need to include id
    console.log("Book created")
    console.log(book)
    await createBook(book);
    res.send(book);
});


// app.put("/books/:id", async (req, res) => {
//     try {
//         const id = req.params.id;
//         const { field, value } = req.body;
//         await updateBook(id, field, value);
//         console.log("Book Updated");
//         res.status(200).send({ message: "Book updated successfully" });
//     } catch (error) {
//         console.error("Error updating book:", error);
//         res.status(500).send({ message: "Error updating book" });
//     }
// });


app.put('/api/books/:id', async (req, res) => {
    const { field, value } = req.body; // Expecting field and value in request body
    const id = req.params.id;

    try {
        await updateBook(id, field, value); // Call your updateBook function
        res.status(200).send({ message: 'Book updated successfully' });
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).send({ message: 'Error updating book' });
    }
});


app.delete("/books/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await deleteBook(id);

        if (!result) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.log("Error deleting book:", error);
        res.status(500).json({ message: "Error deleting book" });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

