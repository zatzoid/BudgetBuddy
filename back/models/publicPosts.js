const mongoose = require('mongoose');

const publicPost = new mongoose.Schema({
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
    },
    comments: [
        {
            comment: {
                type: String,
                required: true
            },
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

module.exports = mongoose.model('PublicPost', publicPost);