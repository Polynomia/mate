const mongoose = require('./db/mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const AnswerFormSchema = new Schema({

    student_id: String,
    teacher_id: { type: ObjectId, ref: 'Teacher' },
    form_id: { type: ObjectId, ref: 'Form' },
    course_id: { type: ObjectId, ref: 'Course' },
    answer_ids: [{ type: ObjectId, ref: 'Answer' }],
    is_valid: { type: Boolean, default: false},
    type: String
});


mongoose.model('AnswerForm', AnswerFormSchema);