const mongoose = require('./db/mongoose')
const Answer = require('./answers.js')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CourseSchema = new Schema({

    title: String,
    begin_time: Date,
    end_time: Date,
    student_num: Number,
    location: String,
    teacher_id: { type: ObjectId, ref: 'Teacher' },
    students: [{ type: ObjectId, ref: 'Student' }],
    self_form: String,
    expert_form: String,
    student_form: String,
    self_form_link: String,
    expert_form_link: String,
    student_form_link: String

});

CourseSchema.pre('remove', function(next) {
    // var formList = this.form_ids || [];
    // Form.remove({ "_id": { "$in": formList } }).exec();
    Answer.remove({ "course_id": this.id }).exec();
    
    next();
});


mongoose.model('Course', CourseSchema);
