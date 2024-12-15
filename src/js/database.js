// const mysql = require('mysql2');
// const dotenv = require('dotenv');

import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();



const pool = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();



export async function getBooks() {
    const [rows] = await pool.query('SELECT * FROM books_list');
    return rows;
}


export async function getBook(id) {
    const [rows] = await pool.query(`SELECT * FROM books_list WHERE id = ?`,
        id);
    return rows[0]
}




export async function createBook(book) {
    const query = 'INSERT INTO books_list (title, author, pages, year, is_read) VALUES (?, ?, ?, ?, ?)';
    const values = [book[0], book[1], book[2], book[3], book[4]]; // Accessing elements by index
    await pool.query(query, values);
    console.log('Book created successfully');
}


export async function deleteBook(id) {
    const query = 'DELETE FROM books_list WHERE id = ?';
    try {
        const [result] = await pool.query(query, [id]);
        console.log("Delete operation completed");
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error in deleteBook:", error);
        throw error;
    }
}

// export async function updateBook(id, field, value) {
//     const validFields = ['title', 'author', 'pages', 'year', 'is_read'];
//     if (!validFields.includes(field)) {
//         throw new Error('Invalid field');
//     }
//     const query = `UPDATE books_list SET ${field} = ? WHERE id = ?`;
//     return pool.query(query, [value, id]);
// }


export async function updateBook(id, field, value) {
    const validFields = ['title', 'author', 'pages', 'year', 'is_read'];
    if (!validFields.includes(field)) {
        throw new Error('Invalid field');
    }
    const query = `UPDATE books_list SET ${field} = ? WHERE id = ?`;

    // Log the query for debugging
    console.log(`Executing query: ${query} with values: [${value}, ${id}]`);

    return pool.query(query, [value, id]);
}
