import { Schema, Types, model } from 'mongoose';

const localPost = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
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

        ],
        lose: [
            {
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

export default model('LocalPost', localPost);