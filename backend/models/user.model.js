// import mongoose  from "mongoose";

// const userSchema = new mongoose.Schema({
//    username:{
//     type:String,
//     require:true,
//     unique: true
//    },

//    fullName:{
//     type:String,
//     require:true,
//     minLength:6,
//    },

//    password:{
//       type:String,
//       require:true,
//       minLengthL:6,
//    },

//    email:{
//     type:String,
//     require:true,
//     unique:true,
//    },

//    followers:[{
//     type:mongoose.Schema.Types.ObjectId,  //  follower should have type of mongodb ID 
//     ref:"User",
//     default:[] 
//    }],

//    following:[{
//     type:mongoose.Schema.Types.ObjectId,  //  follower should have type of mongodb ID 
//     ref:"User",
//     default:[] 
//    }],

//    profileImg:{
//     type:String,
//     default:"",
//    },

//    coverImg:{
//     type:String,
//     default:"",
//    },

//    bio:{
//     type:String,
//     default:"",
//    },

//    link:{
//     type:String,
//     default:"",
//    },

//    likePost:[
//       {
//          type: mongoose.Schema.Types.ObjectId,
//          ref:"Post",
//          default:[]
//       }
//    ]
// },{timestamps: true})

// const User= mongoose.model("User", userSchema);

// export default User;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		fullName: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			minLength: 6,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
		profileImg: {
			type: String,
			default: "",
		},
		coverImg: {
			type: String,
			default: "",
		},
		bio: {
			type: String,
			default: "",
		},

		link: {
			type: String,
			default: "",
		},
		likedPosts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Post",
				default: [],
			},
		],
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;