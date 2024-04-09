const mongoose = require('mongoose');

const LPreminderData = new mongoose.Schema({
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
            type: mongoose.Schema.Types.ObjectId
            , default: mongoose.Types.ObjectId
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
            type: mongoose.Schema.Types.ObjectId
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


module.exports = mongoose.model('LPreminderData', LPreminderData);