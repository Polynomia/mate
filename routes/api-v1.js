var express = require('express');

var courses = require('../api/v1/courses')
var teachers = require('../api/v1/teachers')
var forms = require('../api/v1/forms')
var answer_forms = require('../api/v1/answer_forms')
var form_links = require('../api/v1/form_links')


var APIRequire = function() {

    var router = express.Router();
    router.get('/courses', courses.Courses);
    router.post('/course/update', courses.UpdateCourse);
    router.post('/course/delete', courses.DelteCourse);
    router.post('/course/create', courses.Create);

    router.post('/teacher/register', teachers.Register);
    router.post('/teacher/updateInfo', teachers.UpadateTeacherInfo);

    router.post('/ansForm/save', answer_forms.saveAnswer);
    router.get('/ansForm/getStatus', answer_forms.getStatus);

    router.post('/form/create', forms.Create);

    router.post('/form/getLink', form_links.getLink);
    router.get('/form/:seq', form_links.Form)
    return router;
};

module.exports = APIRequire;
