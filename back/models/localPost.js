const mongoose = require('mongoose');

const localPost = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    posted: {
        type: Boolean,
        default: false,
        required: true
    },
    cashData: {
        profit: [
            {
                type: Object,
                required: true
            }

        ],
        lose: [
            {
                type: Object,
                required: true
            }
        ]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    choisenDate: {
        type: String,
        required: true,
    }

}, { versionKey: false });

module.exports = mongoose.model('LocalPost', localPost);