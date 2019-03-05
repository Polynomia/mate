var express = require('express');

var courses = require('../api/v1/courses')
var teachers = require('../api/v1/teachers')
var forms = require('../api/v1/forms')
var answer_forms = require('../api/v1/answer_forms')
var form_links = require('../api/v1/form_links')
var questions = require('../api/v1/questions')
var students = require('../api/v1/students')
var reports = require('../api/v1/reports')
const checkToken = require('../api/middlewares/checkToken')
var qr = require('qr-image');

var APIRequire = function() {

    var router = express.Router();
    router.get('/courses', checkToken, courses.Courses);
    router.post('/course/update', checkToken, courses.UpdateCourse);
    router.post('/course/delete', checkToken, courses.DelteCourse);
    router.post('/course/create', checkToken, courses.Create);
    router.get('/course/info', checkToken, courses.getCourseInfo);

    router.post('/teacher/register', teachers.Register);
    router.post('/teacher/updateInfo', teachers.UpadateTeacherInfo);
    router.post('/teacher/login', teachers.Login);
    router.post('/teacher/Jlogin', teachers.LoginByJaccount);
    router.post('/teacher/updatePwd', teachers.UpdatePassword);

    router.post('/student/register', students.Register);
    router.post('/student/login', students.Login);
    router.post('/student/Jlogin', students.LoginByJaccount);
    router.post('/student/updateInfo', students.UpadateStudentInfo);
    router.post('/student/updatePwd', students.UpdatePassword);

    router.post('/ansForm/save', answer_forms.saveAnswer);
    router.get('/ansForm/getStatus', answer_forms.getStatus);

    router.post('/form/create', forms.Create);

    router.post('/form/getLink', checkToken, form_links.getLink);
    router.get('/form/:seq', form_links.Form)

    router.post('/question/create', questions.Create)

    router.get('/report/create', reports.CreateReport)

    router.get('/qr', function(req, res){
        var code = qr.image(req.query.detailedURL, { size: Number(req.query.size)});
        res.setHeader('Content-type', 'image/png');  //sent qr image to client side
        code.pipe(res);
    });
    return router;
};

module.exports = APIRequire;
