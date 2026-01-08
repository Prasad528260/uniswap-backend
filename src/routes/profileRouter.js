import express from 'express'
import { userAuth } from '../middlewares/userAuth.js';
import { updateProfile, getProfile } from '../controllers/profileController.js';
import multer from 'multer';

const profileRouter= express.Router();

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

// * Update Profile
profileRouter.put('/edit',userAuth,upload.single('profilePicture'),updateProfile)

// * Get Profile
profileRouter.get('/view',userAuth,getProfile)

export default profileRouter;