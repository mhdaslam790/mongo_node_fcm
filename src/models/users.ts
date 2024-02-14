import mongoose from 'mongoose';
import { IUser } from '../types/user';

const Schema = mongoose.Schema;
const UserSchema = new Schema(

    {
        username: {
            type: String,
            required: [true, 'Please enter a username'],
            unique: true,

        },
        email: {
            type: String,
            lowarcase: true,
            unique: true,
            required: [true, 'Please enter an email'],
        },
        password: {
            type: String,
            required: true,
        },
        fcmToken: {
            type: String,
            required: true,
            unique: true,

        }
    },
    { timestamps: true },
);
const UserModel = mongoose.model<IUser & mongoose.Document>('user', UserSchema);

export { UserModel };
export default UserModel;