import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const user =req.user;
    req.user=user;
    return cb(null, "src/uploads");
  },
  
  filename: (req, file, cb) => {
    return cb(null,`${Date.now()}-${file.originalname}`);
  },
});
function fileFilter(req, file, cb) {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;
