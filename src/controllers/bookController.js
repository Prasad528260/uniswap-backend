import mongoose from "mongoose";
import Book from "../models/book.js";
import { validateBook } from "../utils/validateBook.js";
import cloudinary from "../utils/cloudinary.js";
// * Adding a New book to sell
export const addBook = async (req, res, next) => {
  try {
    const {
      title,
      subject,
      author,
      condition,
      semester,
      price,
      category,
      description,
    } = req.body;
    const bookImg = req?.file;
    // console.log(bookImg);

    const user = req.user;
    if (!user) {
      console.log("ERROR : USER NOT FOUND AT BOOK");
      return res.status(400).json({ message: "User Not Found" });
    }
    const isValid = validateBook({
      title,
      subject,
      condition,
      price,
      description,
      category,
      author,
    });
    if (isValid) {
      if (!bookImg) {
        return res.status(400).json({ message: "Book image is required" });
      }
      let bookImgUrl;

      // * upload image to cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "UniSwap_book_img",
            resource_type: "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(bookImg.buffer);
      });
      bookImgUrl = result.secure_url;
      // Create the book first
      let book = new Book({
        title,
        condition,
        price: Number(price), // Ensure price is a number
        subject,
        author,
        semester,
        category,
        description,
        bookImg: bookImgUrl,
        sellerId: user._id,
      });

      // Now we can use the book instance
      const newPrice = book.getPrice(price);
      book.price = newPrice; // Update the price after book initialization
      console.log(book);

      book = await book.save();
      res.status(200).json(book);
    }
  } catch (error) {
    console.log("ERROR : ADD BOOK FAILED", error.message);
    return res.status(400).json({ message: "Add Book Failed" });
  }
};

// * Get All Books
// TODO : after fetching book ensure required data is fetched -- DONE
export const getBooks = async (req, res, next) => {
  const { semester, page, limit } = req.query;
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 9;
  const skip = (pageNumber - 1) * limitNumber;
  const user = req.user;

  if (!user) {
    console.log("ERROR : USER NOT FOUND");
    return res.status(400).json({ message: "User Not Found" });
  }

  try {
    let filter = { category: "book", sellerId: user._id, status: "Available" };
    if (semester) filter.semester = semester;

    const books = await Book.find(filter)
      .select("_id title subject author condition price semester category description bookImg")
      .populate("sellerId", "firstName lastName _id department profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const total = await Book.countDocuments(filter);

    res.status(200).json({
      data: books,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
        hasNextPage: pageNumber * limitNumber < total,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.log("ERROR : GET BOOKS FAILED", error);
    return res.status(400).json({ message: "Get Books Failed" });
  }
};


// * Get Books uploaded by User
// TODO : after fetching book ensure required data is fetched -- DONE
export const getUserBooks = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      console.log("ERROR : USER NOT FOUND");
      return res.status(400).json({ message: "User Not Found" });
    }
    const userBooks = await Book.find({
      category: "book",
      sellerId: user._id,
    }).select(
      "_id title subject author condition price semester category description bookImg "
    );
    if (!userBooks) {
      console.log("ERROR : USER BOOKS NOT FOUND");
      return res.status(400).json({ message: "User Books Not Found" });
    }
    res.status(200).json(userBooks);
  } catch (error) {
    console.log("ERROR : GET USER BOOKS FAILED", error.message);
    return res.status(400).json({ message: "Get User Books Failed" });
  }
};

// * Delete Book
// TODO : after deleting book ensure required data is deleted  -- DONE
export const deleteBook = async (req, res, next) => {
  const user = req.user;
  const { bookId } = req.params;
  if (!user) {
    console.log("ERROR : USER NOT FOUND");
    return res.status(400).json({ message: "User Not Found" });
  }
  try {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid Book ID" });
    }
    const objctBookId = new mongoose.Types.ObjectId(bookId);
    const deletedBook = await Book.findByIdAndDelete({
      _id: objctBookId,
      sellerId: user._id,
    });
    if (!deletedBook) {
      console.log("ERROR : BOOK NOT FOUND");
      return res.status(400).json({ message: "Book Not Found" });
    }
    res.status(200).json(deletedBook);
  } catch (error) {
    console.log("ERROR : DELETE BOOK FAILED", error.message);
    return res.status(400).json({ message: "Delete Book Failed" });
  }
};

// * Get Notes
export const getNotes = async (req, res, next) => {
  const user = req.user;
  if (!user) {
    console.log("ERROR : USER NOT FOUND");
    return res.status(400).json({ message: "User Not Found" });
  }
  const { page, limit } = req.query;
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 9;
  const skip = (pageNumber - 1) * limitNumber;
  
  try {
    const notes = await Book.find({ category: "notes" })
      .select(
        "_id title subject author condition price semester category description bookImg "
      )
      .populate("sellerId", "firstName lastName _id department profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);
    if (!notes) {
      console.log("ERROR : NOTES NOT FOUND");
      return res.status(400).json({ message: "Notes Not Found" });
    }
    const total = await Book.countDocuments({ category: "notes" });
    res.status(200).json({
      data: notes,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
        hasNextPage: pageNumber * limitNumber < total,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.log("ERROR : GET NOTES FAILED", error.message);
    return res.status(400).json({ message: "Get Notes Failed" });
  }
};
