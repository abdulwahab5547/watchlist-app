import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
        },
        watchlist: [
            {
                id: Number,
                contentType: String,
                title: String,
                release_date: String,
                overview: String,
                poster_path: String,
                genre: [String],
            }
        ],
        avatar: Number
    }, 
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// Define the standalone functions
const findOne = async (criteria) => {
    return await User.findOne(criteria);
};

const findById = async (id) => {
    return await User.findById(id);
};

const findByIdAndUpdate = async (id, update) => {
    return await User.findByIdAndUpdate(id, update, { new: true });
};

export default User;
export { findOne, findById, findByIdAndUpdate };