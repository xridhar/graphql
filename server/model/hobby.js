const mongoose = require('mongoose');
const MSchema = mongoose.Schema;

// mongoose.set('useFindAndModify', false);

const hobbySchema = new MSchema({
    title: String,
    description: String,
    userId: String
});

module.exports = mongoose.model("Hobby", hobbySchema);