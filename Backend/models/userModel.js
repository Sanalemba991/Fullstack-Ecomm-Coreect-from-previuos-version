import mongoose from 'mongoose';

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },  // No unique constraint here
  },
  {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the User model
const User = mongoose.model('User', userSchema);
export default User;
