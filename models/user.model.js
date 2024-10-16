import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'male'
    },
    profilepic: {
        type: String,
        default: ''
    }
},
{
    timestamps: true
}
    
)

const People = mongoose.model('People', userSchema);

export default People;