import User from "../models/user.js";
import cloudinary from "../utils/cloudinary.js";

// * Update Profile

export const updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const { firstName, lastName,about } = req.body;
    const { _id } = user;
    const profilePicture = req.file;
    if (!user) {
      console.log("ERROR : USER NOT FOUND");
      return res.status(400).json({ message: "User Not Found" });
    }
    let profileUrl = user.profilePicture;
    if (profilePicture) {
      // * uploading image buffer to cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
          folder: "UniSwap_profile_pic",
          resource_type: "image",
        },(error,result)=>{
           if (error) return reject(error);
            resolve(result);
        });
        stream.end(profilePicture.buffer)
      });
      profileUrl=result.secure_url;
    }
    // what if user wants to update some fields and not all
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        profilePicture: profileUrl,
        about: about || user.about,
      },
      { new: true }
    ).select("firstName lastName department profilePicture about");
    // console.log(updatedUser);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("ERROR : UPDATE PROFILE FAILED", error.message);
    return res.status(400).json({ message: "Update Profile Failed" });
  }
};

// * Get Profile
export const getProfile = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      console.log("ERROR : USER NOT FOUND");
      return res.status(400).json({ message: "User Not Found" });
    }
    const { firstName, lastName, department, profilePicture,about } = user;
    res.status(200).json({ firstName, lastName, department, profilePicture,about });
  } catch (error) {
    console.log("ERROR : GET PROFILE FAILED", error.message);
    return res.status(400).json({ message: "Get Profile Failed" });
  }
};
