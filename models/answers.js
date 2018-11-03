const mongoose = require('./db/mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const AnswerSchema = new Schema({

    question_id: { type: ObjectId, ref: 'Question' },
    form_id: { type: ObjectId, ref: 'Form' },
    course_id: { type: ObjectId, ref: 'Course' },
    content: String, 
    choice: Number,
    student_id: String,
    teacher_id: { type: ObjectId, ref: 'Teacher' },
    multi_choice: [Number],
    is_valid: { type: Boolean, default: false},
});


mongoose.model('Answer', AnswerSchema);
