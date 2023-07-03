"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateBook = (req, res, next) => {
    const book = req.body;
    const { isbn, title, author, publish_date, publisher, numOfPages } = book;
    if (!(isbn && title && author && publish_date && publisher && numOfPages)) {
        return res.status(400).json({
            msg: 'Book is not valid'
        });
    }
    next();
};
exports.default = validateBook;
//# sourceMappingURL=validate-book.js.map