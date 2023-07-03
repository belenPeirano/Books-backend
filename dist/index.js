"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const generate_jwt_1 = __importDefault(require("./generate-jwt"));
const dotenv_1 = __importDefault(require("dotenv"));
const validate_jwt_1 = __importDefault(require("./middlewares/validate-jwt"));
const validate_book_1 = __importDefault(require("./middlewares/validate-book"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000;
const user = {
    userName: 'belu',
    password: '123456'
};
const blackListedTokens = [];
const books = [
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
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userName = req.body.userName;
    const password = req.body.password;
    // const { email, password } = req.body;
    if (userName === user.userName && password === user.password) {
        const token = yield (0, generate_jwt_1.default)(userName);
        res.status(200).json({
            token
        });
        return;
    }
    else {
        res.status(401).send('Invalid credentials');
    }
}));
app.post('/logout', validate_jwt_1.default, (req, res) => {
    const token = req.headers.authorization;
    console.log(token);
    blackListedTokens.push(token);
    res.status(200).json({ msg: 'Logout successful' });
});
app.get('/blacklist', (req, res) => {
    res.json(blackListedTokens);
});
app.post('/bookID', validate_book_1.default, (req, res) => {
    const book = req.body;
    books.forEach((item, index) => {
        if (item.isbn === book.isbn) {
            res.status(400).json({ msg: 'Book already exists' });
            return;
        }
        else {
            books.push(book);
            res.status(200).json({ msg: 'Book is added to the database' });
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
app.get('/books', validate_jwt_1.default, (req, res) => {
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
app.delete('/book/:isbn', validate_jwt_1.default, (req, res) => {
    // Reading isbn from the URL
    const isbn = req.params.isbn;
    books.forEach((item, index) => {
        console.log(item.isbn, isbn);
        if (item.isbn === isbn) {
            console.log(item.isbn);
            books.splice(index, 1);
        }
    });
    res.status(200).json({ msg: 'Book deleted' });
});
app.put('/book/:isbn', (req, res) => {
    // Reading isbn from the URL
    const isbn = req.params.isbn;
    const newBook = req.body;
    // Remove item from the books array
    for (let i = 0; i < books.length; i++) {
        const book = books[i];
        if (book.isbn === isbn) {
            books[i] = newBook;
        }
    }
    res.status(200).json({ msg: 'Book is edited' });
});
exports.default = { blackListedTokens };
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
//# sourceMappingURL=index.js.map