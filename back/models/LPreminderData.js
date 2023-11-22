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
        type: Object
    },
    postId: { type: mongoose.Schema.Types.ObjectId },
    originalCashDataId: { type: mongoose.Schema.Types.ObjectId }
}, { versionKey: false });


module.exports = mongoose.model('LPreminderData', LPreminderData);