const mongoose = require('./db/mongoose')
const Answer = require('./answers.js')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const config = require('config-lite')(__dirname)

const CourseSchema = new Schema({

    title: String,
    begin_time: Date,
    end_time: Date,
    student_num: Number,
    location: String,
    type: {type: String, enum:['专业选修课', '专业核心课', '专业基础课', '通识课', '其他']},
    organize: String,
    teacher_id: { type: ObjectId, ref: 'Teacher' },
    students: [{ type: ObjectId, ref: 'Student' }],
    self_form: {type: String, default: config.self_form},
    expert_form: {type: String, default: config.expert_form},
    student_form: {type: String, default: config.student_form},
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
