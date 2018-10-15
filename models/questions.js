const mongoose = require('./db/mongoose')
// const Choice = require('./choices.js')
// const TextAnswer = require('./text_answers.js')
// const ChoiceAnswer = require('./choice_answers.js')
const Answer = require('./answers.js')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const QuestionSchema = new Schema({

    form_id: { type: ObjectId, ref: 'Form' },
    type: {type: String, enum:['multi_choice', 'single_choice', 'text', 'common']},
    content: String, 
    choices: [String],
});

QuestionSchema.pre('remove', function(next) {
    
    Answer.remove({ "question_id": this.id }).exec();
    
    next();
});


mongoose.model('Question', QuestionSchema);
