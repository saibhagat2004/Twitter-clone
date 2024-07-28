import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
	try {
		const userId = req.user._id;

		const notifications = await Notification.find({ to: userId }).populate({
			path: "from",//• The path option specifies the field in the document that you want to populate. This field should contain areference to another document(typically an Objectld).
			select: "username profileImg",  //• The select option specifies which   fields of the referenced document youwant to include in the result. This is useful for limiting the amount of data returned and improving query performance.
		});
		await Notification.updateMany({ to: userId }, { read: true });

		res.status(200).json(notifications);
	} catch (error) {
		console.log("Error in getNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const deleteNotifications = async (req, res) => {
	try {
		const userId = req.user._id;

		await Notification.deleteMany({ to: userId });

		res.status(200).json({ message: "Notifications deleted successfully" });
	} catch (error) {
		console.log("Error in deleteNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// export const deleteOneNotification = async (req, res) => {
// 	try {
// 	  const notificationId = req.params.id;
// 	  const userId = req.user.id;
// 	  const notification = await Notification.findById(notificationId);
  
// 	  if (!notification) {
// 		return res.status(404).json({ error: "Notification not found" });
// 	  }
  
// 	  if (notification.toString() !== userId.toString()) {
// 		return res.status(403).json({ error: "You are not allowed to delete this notification" });
// 	  }
  
// 	  await Notification.findByIdAndDelete(notificationId);
// 	  res.status(200).json({ message: "Notification deleted successfully" });
// 	} catch (error) {
// 	  console.log("Error in deleteNotification function", error.message);
// 	  res.status(500).json({ error: "Internal Server Error" });
// 	}
//   };
