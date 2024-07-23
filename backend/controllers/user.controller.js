// using user.controller.js over usercontroller.js provides better readability, organization, scalability, and can be more compatible with development tools.
import bcrypt from "bcryptjs"
import { v2 as cloudinary } from "cloudinary";   //, v2 refers to the second version of a software, API, or any other version-controlled entity. It indicates that there have been updates or changes from the initial version (v1).
//Models
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";


export const getUserProfile= async(req,res) =>{
    const {username}= req.params;             
    try {
        const user= await User.findOne({username}).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getUserProfile controller",error.message);
        res.status(500).json({error:error.message});
    }
}



export const followUnfollowUser = async (req, res) => {
	try {
		const { id } = req.params;  ///api/users/follow/:userid-->669b65202550c429630c926f this id is store in  {id}
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === req.user._id.toString()) {  //convert user._id to a string so that is can compare.
			return res.status(400).json({ error: "You can't follow/unfollow yourself" });
		}

		if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			// Unfollow the user
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });  //remove our id from follower array of person we are following
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });  //remove following id from current user's following array
			

			res.status(200).json({ message: "User unfollowed successfully" });
		} else {
			// Follow the user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });//add our id to follower array of person we are following
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } }); //add following id to current user's following array
			
			// // Send notification to the user
			const newNotification = new Notification({
				type: "follow",
				from: req.user._id,
				to: userToModify._id,
			});

			await newNotification.save();
			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (error) {
		console.log("Error in followUnfollowUser: ", error.message);
		res.status(500).json({ error: error.message });
	}
};


export const getSuggestedUsers = async (req, res) => {
	try {
		const userId = req.user._id;   //it comes from protectRoute middleware
		const usersFollowedByMe = await User.findById(userId).select("following"); //find the user by id and select only following field

		const users = await User.aggregate([           //give 10 users in  db except our userId 
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{ $sample: { size: 10 } },
		]);

		// 1,2,3,4,5,6,
		const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));   //For each `user` in the `users` array, it checks if the `user._id` is not included in the `following` array of `usersFollowedByMe`
		const suggestedUsers = filteredUsers.slice(0, 4); //take only 4 users

		suggestedUsers.forEach((user) => (user.password = null));
		//This code snippet is using the `forEach` method to iterate over an array of `suggestedUsers`. For each `user` in the array, it is setting the `password` property of that user to `null`. 
		//The purpose of this code is to reset or clear the password for each user in the `suggestedUsers` array.
		// This could be useful in scenarios where you want to ensure that sensitive information like passwords are not stored or displayed after a certain point in the application flow. 
		// even if the password might not be directly accessible through the currentflow of data, nullifying it adds an extra layer of securityand helpsin maintaining dataprivacy and integrity throughout the applicationl
		res.status(200).json(suggestedUsers);
	} catch (error) {
		console.log("Error in getSuggestedUsers: ", error.message);
		res.status(500).json({ error: error.message });
	}
};

// export const updateUser = async (req, res) => {
// 	const {fullName, email, username,currentPassword,newPassword ,bio,link}=req.body;
// 	let {profileImg, coverImg}=req.body;
// 	const userId=req.user._id;
// 	try {
// 		const user= await User.findById(userId);
// 		if(!user){
// 			return 	res.status(400).json({message:"User not found"});
// 		}
// 		if(!currentPassword && newPassword || currentPassword && !newPassword){
// 			 return res.status(400).json({error:"Please provide current password to update your account."});
// 		} 

// 		if(currentPassword && newPassword){
// 			//checking current Password
// 			const isMatch=bcrypt.compare(currentPassword,user.password)
// 			if(!isMatch){
// 				return res.status(400).json({error:"the currnet Password is incorrect"})
// 			}
// 			if(newPassword<6){
// 				return res.status(400).json({error:"Password length must me atleast 6 "});
// 			}
// 			const salt=await bcrypt.genSalt(10)
// 			user.password=bcrypt.hash(newPassword,salt)
// 		}
		
// 	} catch (error) {
		
// 	}
// }

export const updateUser = async (req, res) => {
	const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body;
	let { profileImg, coverImg } = req.body;

	const userId = req.user._id;

	try {
		let user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
			return res.status(400).json({ error: "Please provide both current password and new password" });
		}

		if (currentPassword && newPassword) {
			const isMatch = await bcrypt.compare(currentPassword, user.password);
			if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
			if (newPassword.length < 6) {
				return res.status(400).json({ error: "Password must be at least 6 characters long" });
			}

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(newPassword, salt);
		}

		if (profileImg) {
			if (user.profileImg) {
				// https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
				await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profileImg);
			profileImg = uploadedResponse.secure_url;
			
			//uploadedResponse contains various pieces of information about the uploaded image, such as its URL, public ID, width, height, etc.
            //secure_url is a property of uploadedResponse that holds the URL of the uploaded image, which is accessible over HTTPS.
			// profileImg = uploadedResponse.secure_url:
			//This line assigns the secure_url of the uploaded image to the profileImg variable.
			//After this assignment, profileImg will hold the URL of the uploaded image, rather than the original image data or path.
			//Summary:
			//The code uploads an image to Cloudinary and then updates the profileImg variable to hold the URL of the uploaded image. This URL can then be used to display the image on a website or store it in a database for future use.		

}


		if (coverImg) {
			if (user.coverImg) {
				await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(coverImg);
			coverImg = uploadedResponse.secure_url;
		}

		user.fullName = fullName || user.fullName;      //if user pass fullName then we update it  OR just keep old fullName
		user.email = email || user.email;
		user.username = username || user.username;
		user.bio = bio || user.bio;
		user.link = link || user.link;
		user.profileImg = profileImg || user.profileImg;
		user.coverImg = coverImg || user.coverImg;

		user = await user.save();

		// password should be null in response not in database
		user.password = null; 

		return res.status(200).json(user);
	} catch (error) {
		console.log("Error in updateUser: ", error.message);
		res.status(500).json({ error: error.message });
	}
};