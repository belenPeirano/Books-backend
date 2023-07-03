import express from 'express';
import cors from 'cors';
import generateJWT from './generate-jwt';
import dotenv from 'dotenv';
import validateJWT from './middlewares/validate-jwt';
dotenv.config();

const app = express();
const port = 3000;
const user = {
    userName: 'belu',
    password: '123456'
}

let books = [
    {
        isbn: '9781593275846',
        title: 'Eloquent JavaScript, Second Edition',
        author: 'Marijn Haverbeke',
        publish_date: '2014-12-14',
        publisher: 'No Starch Press',
        numOfPages: '472'
    }
];

app.use(cors());
app.use(express.json());

app.post('/login', async (req, res) => {
    const userName = req.body.userName;
    const password = req.body.password;
    // const { email, password } = req.body;
    if (userName === user.userName && password === user.password) {
        const token = await generateJWT(userName);
        res.status(200).json({
            token
        });
        return;
    } else {
        res.status(401).send('Invalid credentials');
    }
});

app.post('/book', (req, res) => {
    const book = req.body;
    books.push(book);

    console.log(book)
    res.send('Book is added to the database');
});

app.get('/books', validateJWT, (req, res) => {
    res.json(books);
});

app.get('/book/:isbn', (req, res) => {
    // Reading isbn from the URL
    const isbn = req.params.isbn;

    // Searching books for the isbn
    for (const book of books) {
        if (book.isbn === isbn) {
            res.json(book);
            return;
        }
    }
    // Sending 404 when not found something is a good practice
    res.status(404).send('Book not found');
});

app.delete('/book/:isbn', validateJWT, (req, res) => {
    const isbn = req.params.isbn;
    books = books.filter(i => {
        if(i.isbn !== isbn) {
            return true;
        }
        return false;
    });

    res.send('Book is deleted');
});

app.put('/book/:isbn', (req, res) => {
    // Reading isbn from the URL
    const isbn = req.params.isbn;
    const newBook = req.body;

    // Remove item from the books array
    for (let i = 0; i < books.length; i++) {
        const book = books[i]
        if (book.isbn === isbn) {
            books[i] = newBook;
        }
    }
    res.send('Book is edited');
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))

