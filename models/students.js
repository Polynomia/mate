const mongoose = require('./db/mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const StudentSchema = new Schema({

    name: String,
    city: String,
    school: String,
    gender: {type: String, enum:['male', 'female']},
    student_id: {type: String, unique:true},

});


mongoose.model('Student', StudentSchema);
