const mongoose = require('./db/mongoose')
const Question = require('./questions.js')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const FormSchema = new Schema({

    title: String,
    description: String,
    question_ids: [{ type: ObjectId, ref: 'Question' }],
    create_time: { type: Date, default: Date.now },
});

FormSchema.pre('remove', function(next) {
    Question.remove({ "form_id": this.id }).exec();
    next();
});

mongoose.model('Form', FormSchema);
