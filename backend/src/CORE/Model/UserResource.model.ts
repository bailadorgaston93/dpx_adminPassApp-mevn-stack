import mongoose from "mongoose";

const schema = new mongoose.Schema({
    id_user_ref: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
    },
    id_resource_admin: {
        ref: "AdminResource",
        type: mongoose.Schema.Types.ObjectId
    },
    name_resource_admin: String,
    inputs_data: {}
});
export default mongoose.model('UserResource', schema);