import mongoose from "mongoose";

const schema = new mongoose.Schema({
    id_user_ref: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
    },
    name_resource: String,
    name_type_encrypt: String,
    fields: [{
        label_input: String,
        name_input: String,
        type_input: String
    }]
});

export default mongoose.model('AdminResource', schema);