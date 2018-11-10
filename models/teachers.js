const mongoose = require('./db/mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const TeacherSchema = new Schema({

    name: String,
    city: String,
    title: String,
    age: Number,
    j_id: String,
    gender: {type: String, enum:['male', 'female']},
    organize: String,
    school: String,
    country: String,
    website: String,
    description: String,
    //mail: {type: String, unique:true},
    mail: String,
    courses: { type: ObjectId, ref: 'Course' },
    password: String,
    create_time: Date
});


mongoose.model('Teacher', TeacherSchema);
