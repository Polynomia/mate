const mongoose = require('./db/mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const AnswerSchema = new Schema({

    question_id: { type: ObjectId, ref: 'Question' },
    form_id: { type: ObjectId, ref: 'Form' },
    course_id: { type: ObjectId, ref: 'Course' },
    content: String, 
    choice: Number,
    multi_choice: [Number]
});


mongoose.model('Answer', AnswerSchema);
