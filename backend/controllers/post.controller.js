// import User from "../models/user.model.js";
// import Post from "../models/post.model.js";
// import {v2 as cloudinary}  from "cloudinary" 

// export const createPost = async (req,res) =>{
//     try {
//         const {text}=req.body;
//         let {img}=req.body;    
//         const userId=req.user._id.toString();
    
//         const user= await User.findById(userId);
    
//         if(!user){
//             return res.status(400).json({message:"User not found"})
//         }
//         if(!text && !img){
//             return res.status(400).json({error:"Post must have text or image"})
//         }

//         if(img){
//             const uploadedResponse=await cloudinary.uploader.upload(img);
//             img=uploadedResponse.secure_url;
//         }

    
//         const newPost= new Post({
//             user:userId,
//             text,
//             img
//         })
    
//         await newPost.save()
    
//         res.status(201).json(newPost);
           
//     } catch (error) {
//         res.status(500).json({error:"Internal server error"});   
//         console.log(error);
//     }
 
// }




import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";


export const createPost = async (req, res) => {
	try {
		const { text } = req.body;
		let { img } = req.body;
		const userId = req.user._id.toString();

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		if (!text && !img) {
			return res.status(400).json({ error: "Post must have text or image" });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);  // it uploads the base64 encoded image to Cloudinary using:
			img = uploadedResponse.secure_url;            //The response from Cloudinary contains the URL of the uploaded image, which is then assigned to img:
		}

		const newPost = new Post({
			user: userId,
			text,
			img,
		});

		await newPost.save();
		res.status(201).json(newPost);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
		console.log("Error in createPost controller: ", error);
	}
};

export const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.user.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "You are not authorized to delete this post" });
		}

		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		console.log("Error in deletePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
}; 

export const commentOnPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const comment = { user: userId, text };
		post.comments.push(comment);
		//The newly created comment object is being added to the comments array of the post object.
		await post.save();

		res.status(200).json(post);
	} catch (error) {
		console.log("Error in commentOnPost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// export const likeUnlikePost = async (req, res) => {
// 	try {
// 		const userId = req.user._id;
// 		const { id: postId } = req.params;

// 		const post = await Post.findById(postId);

// 		if (!post) {
// 			return res.status(404).json({ error: "Post not found" });
// 		}

// 		const userLikedPost = post.likes.includes(userId);
// 		//include:
// 		//The include method is typically used to check if an array contains a specific element. In your case, post.likes.include(userId) checks if the userId is present in the likes array of the post.
// 		//findById:
// 		//The findById method is generally used to find a document by its unique identifier in a database. It is often used with databases like MongoDB or ORMs like Mongoose.

// 		if (userLikedPost) {
// 			// Unlike post
// 			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
// 			await User.updateOne({ _id: userId }, { $pull: { likePost: postId } });

// 			const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
// 			res.status(200).json(updatedLikes);
// 		} else {
// 			// Like post
// 			post.likes.push(userId);
// 			await User.updateOne({ _id: userId }, { $push: { likePost: postId } });
// 			await post.save();
			

// 			const notification = new Notification({
// 				from: userId,
// 				to: post.user,
// 				type: "like",
// 			});
// 			await notification.save();

// 			const updatedLikes = post.likes;
// 			res.status(200).json(updatedLikes);
// 		}
// 	} catch (error) {
// 		console.log("Error in likeUnlikePost controller: ", error);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// };

// export const getAllPost = async (req,res)=>{
// 	try {
// 		const post= await Post.find()
// 			.sort({createAt:-1})        //createAt gives latest post 
// 			.populate({
// 				path:"user",
// 				select:"-password"
// 			})
// 			.populate({
// 				path:"comments.user",
// 				select:"-password"
// 			}); 
// 		if(post.length===0){
// 			res.status(200).json([])
// 		}
// 		res.status(200).json(post)

// 	} catch (error) {
// 		console.log("Error in getAllPosts controller: ", error);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// }
                                                  
// export const getLikedPosts = async (req, res) => {
// 	const userId = req.params.id;

// 	try {
// 		const user = await User.findById(userId);
// 		if (!user) return res.status(404).json({ error: "User not found" });

// 		const likedPosts = await Post.find({ _id: { $in: user.likePost } }) // If the user is found, it retrieves the posts that the user has liked. It does this by querying the Post collection for posts whose IDs are in the user's likedPosts array.
// 			.populate({
// 				path: "user",
// 				select: "-password",
// 			})
// 			.populate({
// 				path: "comments.user",
// 				select: "-password",
// 			});

// 		res.status(200).json(likedPosts);
// 	} catch (error) {
// 		console.log("Error in getLikedPosts controller: ", error);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// };

export const likeUnlikePost = async (req, res) => {
	try {
		const userId = req.user._id;
		const { id: postId } = req.params;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);
		//include 	
		//The include method is typically used to check if an array contains a specific element. In your case, post.likes.include(userId) checks if the userId is present in the likes array of the post.
 		//findById:
 		//The findById method is generally used to find a document by its unique identifier in a database. It is often used with databases like MongoDB or ORMs like Mongoose.


		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

			const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());  //This line creates a new array updatedLikes that contains all the likes of the post except the current user's ID.
			res.status(200).json(updatedLikes);
		} else {
			// Like post
			post.likes.push(userId);
			await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
			await post.save();

			const notification = new Notification({
				from: userId,
				to: post.user,
				type: "like",
			});
			await notification.save();

			const updatedLikes = post.likes;
			res.status(200).json(updatedLikes);
		}
	} catch (error) {
		console.log("Error in likeUnlikePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getAllPosts = async (req, res) => {
	try {
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		if (posts.length === 0) {
			return res.status(200).json([]);
		}

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getAllPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getLikedPosts = async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })   // If the user is found, it retrieves the posts that the user has liked. It does this by querying the Post collection for posts whose IDs are in the user's likedPosts array.
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(likedPosts);
	} catch (error) {
		console.log("Error in getLikedPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getFollowingPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const following = user.following;

		const feedPosts = await Post.find({ user: { $in: following } })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(feedPosts);
	} catch (error) {
		console.log("Error in getFollowingPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getUserPosts = async (req, res) => {
	try {
		const { username } = req.params;

		const user = await User.findOne({ username });
		if (!user) return res.status(404).json({ error: "User not found" });

		const posts = await Post.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getUserPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
}; 