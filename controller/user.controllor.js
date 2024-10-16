import People from "../models/user.model.js"

export const getUserForSidebar = async (req, res, next) => {
    try {
        const loggedInUser = req.user._id;  // Ensure you are accessing the _id correctly

        // Find all users except the logged-in user
        const allUserExpectLoggedIn = await People.find({
            _id: { $ne: loggedInUser }
        }).select("-password");

        // Send the list of users
        res.status(200).json(allUserExpectLoggedIn);
    } catch (error) {
        next(error);
    }
};

