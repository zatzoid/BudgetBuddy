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
    reminde: {
        type: Boolean,
        default: false
    },
    cashData: {
        profit: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId
                    , default: mongoose.Types.ObjectId
                },
                data: {
                    type: Object,
                    required: true
                },
                emailStatus:{
                    type: Boolean,
                    default: null
                },
                postId:{
                    type: mongoose.Schema.Types.ObjectId
                }

            }

        ],
        lose: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId
                    , default: mongoose.Types.ObjectId
                },
                data: {
                    type: Object,
                    required: true
                },
                emailStatus:{
                    type: Boolean,
                    default: null
                },
                postId:{
                    type: mongoose.Schema.Types.ObjectId
                }
            }
        ]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    choisenMonth: {
        type: Number,
        required: true,
    },
    choisenYear: {
        type: Number,
        required: true
    }

}, { versionKey: false });

module.exports = mongoose.model('LocalPost', localPost);