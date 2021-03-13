const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const partnerSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
},
     featured: {
        type: Boolean,
        default: false
    },

    description: {
        type: String,
        required: true
    },

}, {
    timestamps: true
})


    const Partner = mongoose.model('Partner', partnerSchema);

module.exports = Partner;