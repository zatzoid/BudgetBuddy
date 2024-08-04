import { Schema, Types, model } from 'mongoose';

const LPreminderData = new Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    dateToSend: {
        type: Date,
        required: true
    },
    emailTo: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        default: null
    },
    mainData: {
        _id: {
            type: Schema.Types.ObjectId
            , default: Types.ObjectId
        },

        data: {
            type: Object,
            required: true
        },
        reminde: {
            status: { type: String, default: null },
            data: { type: Object, default: null }

        },
        postId: {
            type: Schema.Types.ObjectId
        },
        category: {
            type: String,
            default: 'другое'
        },
        statusComplited: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }



    }
   
}, { versionKey: false });


export default model('LPreminderData', LPreminderData);