import express from 'express';
import cors from 'cors';
import generateJWT from './generate-jwt';
import dotenv from 'dotenv';
import validateJWT from './middlewares/validate-jwt';
import validateBook from './middlewares/validate-book';
import { Book } from './book';
dotenv.config();

const app = express();
const port = 3000;
const user = {
    userName: 'belu',
    password: '123456'
}

const blackListedTokens: string[] = [];

const books: Book[] = [
    {
        isbn: '9781593275846',
        title: 'Eloquent JavaScript, Second Edition',
        author: 'Marijn Haverbeke',
        publish_date: '2014-12-14',
        publisher: 'No Starch Press',
        numOfPages: '472'
    },
    {
        isbn: '444444444',
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

app.post('/logout', validateJWT, (req, res) => {
    const token = req.headers.authorization;
    console.log(token);
    blackListedTokens.push(token);
    res.status(200).json({msg: 'Logout successful'});
});

app.get('/blacklist', (req, res) => {
    res.json(blackListedTokens);
});

app.post('/bookID', validateBook, (req, res) => {
    const book: Book = req.body;

    books.forEach((item, index) => {
        if (item.isbn === book.isbn) {
            res.status(400).json({msg: 'Book already exists'});
            return;
        } else {
            books.push(book);
            res.status(200).json({msg: 'Book is added to the database'});
        }
    });
});

// app.post('/book', (req, res) => {
//     const book = req.body;

//     let id = 0;
//     books.forEach(book => {
//         if (book.id >  id) {
//             id = book.id;
//         }
//     })
//     book.id = id + 1;
//     books.push(book);
//     res.status(200).json('Book is added to the database');
// });

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
    // Reading isbn from the URL
    const isbn = req.params.isbn;

    books.forEach((item, index) => {
        console.log(item.isbn, isbn);
        if (item.isbn === isbn) {
            console.log(item.isbn);
            books.splice(index, 1);
        }
    });

    res.status(200).json({msg: 'Book deleted'});
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
    res.status(200).json({msg: 'Book is edited'});
});

export default { blackListedTokens }

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))
