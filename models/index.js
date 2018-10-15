
const mongoose = require('./db/mongoose')


require('./courses')
require('./forms')
require('./questions')
require('./students')
require('./teachers')
require('./answers')
require('./answer_forms')
require('./form_links')

exports.Answer = mongoose.model('Answer');
exports.Course = mongoose.model('Course');
exports.Form = mongoose.model('Form');
exports.Question = mongoose.model('Question');
exports.Student = mongoose.model('Student');
exports.Teacher = mongoose.model('Teacher');
exports.AnswerForm = mongoose.model('AnswerForm');
exports.FormLink = mongoose.model('FormLink')