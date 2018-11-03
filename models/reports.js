const mongoose = require('./db/mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const ReportSchema = new Schema({
    course_id: { type: ObjectId, ref: 'Course' },
    genderNum: [{value: Number, name: String, _id: false}],
    organizeNum: [{value: Number, name: String, _id: false}],
    gradeNum: [{value: Number, name: String, _id: false}],
    passion: Number,
    justice: Number,
    strictness: Number,
    humor: Number,
    difficulty: Number,
    homework: Number,
    reading: Number,
    learningStyle: [ [{type: Number}, {type: Number}] ],
    courseSatisfaction: Number,
    teacherSatisfaction: Number,
    behavior_self: [Number],
    behavior_student: [Number],
    behavior_expert: [Number],
    advBehavePOS: [{type: String}],
    advBehaveNeg: [{type: String}],


})

mongoose.model('Report', ReportSchema);