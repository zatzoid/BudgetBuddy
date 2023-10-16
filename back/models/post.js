const mongoose = require('mongoose');
const validator = require('validator');

const post = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    heading: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
        default: 'Название'
    },
    posted: {
        type: Boolean,
        default: false
    },
    cashData: {
        profit: {
            key: {
                type: String,
                required: true,
            },
            value: {
                type: Number,
                required: true,
            },
        },
        lose: {
            key: {
                type: String,
                required: true,
            },
            value: {
                type: Number,
                required: true,
            },
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    choisenDate: {
        type: String,
        required: true,
    },
    comments: [
        {
            comment: String,
            owner: {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                avatar: {
                    type: String,
                    required: true,
                },
            },
            createdAt: {
                type: Date,
                default: Date.now,
            }
        }

    ]
}, { versionKey: false });

module.exports = mongoose.model('Post', post);