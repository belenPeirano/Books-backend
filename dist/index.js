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
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000;
const user = {
    userName: 'belu',
    password: '123456'
};
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
app.post('/book', (req, res) => {
    const book = req.body;
    books.push(book);
    console.log(book);
    res.send('Book is added to the database');
});
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
    const isbn = req.params.isbn;
    books = books.filter(i => {
        if (i.isbn !== isbn) {
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
        const book = books[i];
        if (book.isbn === isbn) {
            books[i] = newBook;
        }
    }
    res.send('Book is edited');
});
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
//# sourceMappingURL=index.js.map