// using user.controller.js over usercontroller.js provides better readability, organization, scalability, and can be more compatible with development tools.

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

// export const followUnfollowUser= async(req,res)=>{
//     try {
//         const {id} =req.params;
//         const userToModify =await User.findById(id);   //user you want to follow
//         const currentUser =await User.findById(req.user._id);
//         if(!userToModify){
//             return res.status(404).json({message:"User not found"});
//         }
        
//         if(id === req.user._id) {
//             return res.status(400).json({error:"You can't follow/unfollow yourself"});
//         }

//         if(!userToModify || !currentUser){
//               return res.status(400).json({error:"User not found"});
//         }
//         // Check if the current user is already following the user to modify
//         const isFollowing = currentUser.following.includes(id);
        
//         // If the current user is already following, then unfollow
//         if(isFollowing){
//             // Remove the user to modify from the current user's following array
//             const updatedCurrentUser = await User.findByIdAndUpdate( req.user._id, { $pull: { following: id } }, { new: true }); // The $pull operator removes the specified value from an array.
//             // Remove the current user from the user to modify's followers array
//             const updatedUserToModify = await User.findByIdAndUpdate( id, { $pull: { followers: req.user._id } }, { new: true });
//             return res.status(200).json({message:"User unfollowed successfully"});
//         }
        
//         // If the current user is not following, then follow
//         else{
//             // Add the user to modify to the current user's following array
//             const updatedCurrentUser = await User.findByIdAndUpdate( req.user._id, { $push: { following: id } }, { new: true });
//             // Add the current user to the user to modify   's followers array
//             const updatedUserToModify = await User.findByIdAndUpdate( id, { $push: { followers: req.user._id } }, { new: true });
//             return res.status(200).json({message:"User followed successfully"});
//         }
//     } catch (error) {
//         console.log("Error in followUnfollowUser controller",error.message);
//         res.status(500).json({error:error.message});
//     }
// }

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
