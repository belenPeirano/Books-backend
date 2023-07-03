import { Request, Response, NextFunction } from 'express';

const validateBook = (req: Request, res: Response, next: NextFunction) => {
    const book = req.body;
    const { isbn, title, author, publish_date, publisher, numOfPages } = book;

    if (!(isbn && title && author && publish_date && publisher && numOfPages)) {
        return res.status(400).json({
            msg: 'Book is not valid'
        });
    }
    next();
}

export default validateBook;
