import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: String,
    lastname: String,
    email: String,
    password: String,
    birth: String,
    isAdmin: Boolean,
    token_confirm_account: String,
    userActive: Boolean,
    userIsActiveByAdmin: Boolean
});
export default mongoose.model('User', schema);

