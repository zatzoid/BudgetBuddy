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