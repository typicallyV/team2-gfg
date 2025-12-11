import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
     name: {type: String, required: true},
     emails: {type: String, required: true, unique: true},
    password: {type: String, required: true },
    age: {type: Number, required: false },
    phone: {type: String, required: false }
});

const  Users = mongoose.model(' Users', userSchema);
export default  Users;