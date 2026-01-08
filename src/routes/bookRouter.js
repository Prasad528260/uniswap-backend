import express from 'express'
import { addBook, deleteBook, getBooks, getUserBooks,getNotes } from '../controllers/bookController.js'
import { userAuth } from '../middlewares/userAuth.js';
import multer from 'multer';

const bookRouter= express.Router();
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  fileFilter:(req,file,cb)=>{
    if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
  }
})

// * Add book or notes
bookRouter.post('/addbook',userAuth,upload.single('bookImg'),addBook)

// * Get Books 
bookRouter.get('/getbook',userAuth,getBooks)

// * Get Notes
bookRouter.get('/getnotes',userAuth,getNotes)

// * Delete Books or notes
bookRouter.delete('/delete/:bookId',userAuth,deleteBook)

// * Get User Books or notes
bookRouter.get('/userbooks',userAuth,getUserBooks)

export default bookRouter;