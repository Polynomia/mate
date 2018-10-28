const model = require('../../models')
const config = require('config-lite')(__dirname)
var async = require("async");
const sha1 = require('sha1');
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');
const createToken = require('../middlewares/createToken');
const getToken = require('../middlewares/getToken')


//TODO: maybe have res bug
const LoginByJaccount = (req, nRes) => {
    let jaccountEntity = null
	let isSuccess = true
    let user = null
    request
        .post({
            url: config.TOKEN_URL,
			form: {
				client_id: config.client_id,
				client_secret: config.client_secret,
				grant_type: 'authorization_code',
				code: req.body.code,
				redirect_uri: config.REDIRECT_URI
			}
        }, function (err, res, body) {
            let access_token = JSON.parse(body).access_token
            if (err) isSuccess = false
            if (res.statusCode === 200 && isSuccess) {
                request.get({
					url: config.PROFILE_URL + access_token
				}, function (err, res, body) {
                    if (err) isSuccess = false
                    if (res.statusCode !== 200) isSuccess = false
                    jaccountEntity = JSON.parse(body).entities[0]
                    if (isSuccess && jaccountEntity) {
                        model.Student.findOne(
                            {"student_id": jaccountEntity.code},
                            (err, userDoc) => {
                                if (err) {
                                    isSuccess = false
                                    nRes.json({
                                        success: false
                                    })
                                    return
                                } 
                                if (!userDoc) {
                                    let userRegister = new model.Student({
                                        name: jaccountEntity.name,
                                        student_id: jaccountEntity.code,
                                        school: "上海交通大学",
                                        city: "上海",
                                        gender: jaccountEntity.gender,
                                        mail: jaccountEntity.email
                                    })
                                    userRegister.create_time = moment(objectIdToTimestamp(userRegister._id))
                                    .format('YYYY-MM-DD HH:mm:ss');
                                    userRegister.save((err, userDoc) => {
                                        if (err) {
                                            isSuccess = false
                                            nRes.json({
                                                success: isSuccess
                                            })
                                            return
                                        }
                                        user = userDoc
                                        if (!isSuccess || !user) {
                                            nRes.json({ success: false })
                                        } else {
                                            nRes.json({
                                                success: isSuccess,
                                                accountInfo: user,
                                                // token 信息验证
                                                token: createToken("student", user._id)
                                            })
                                        }
                                    })
                                } else {
                                    user = userDoc
                                    if (!isSuccess || !user) {
                                        nRes.json({ success: isSuccess })
                                    } else {
                                        nRes.json({
                                            success: isSuccess,
                                            accountInfo: user,
                                            // token 信息验证
                                            token: createToken("student", user._id)
                                        })
                                    }
                                }
                        })
                    }  else {
						nRes.json({
							success: false
						})
					}
                })
            }  else {
                nRes.json({
                    success: false
                })
            }
        })
}


const Register = (req, res) => {
    let stuRegister = new model.Student({
        name: req.body.name,
        city: req.body.city,
        school: req.body.school,
        gender: req.body.gender,
        student_id: req.body.student_id,
        mail: req.body.mail,
        password: sha1(req.body.password),
    })
    stuRegister.create_time = moment(objectIdToTimestamp(stuRegister._id))
                                .format('YYYY-MM-DD HH:mm:ss');
    model.Student.findOne({
        "student_id": stuRegister.student_id
    }, (err, doc) => {
        if (err) {
            console.log(err)
            res.json({
				success: false,
				reason: err
            })
            return
        } else if (doc){
            res.json({
				success: false,
				reason: "学号已被注册，若非本人，请联系管理员"
            })
        } else {
            stuRegister.save((err, newStu) => {
                if (err) {
                    console.log(err)
                    res.json({
                        success: false,
                        reason: err
                    })
                    return
                } else {
                    res.json({
                        success: true,
                        accountInfo: {
                            id: newStu._id,
                            name: newStu.name,
                            city: newStu.city,
                            school: newStu.school,
                            gender: newStu.gender,
                            student_id: newStu.student_id,
                            mail: newStu.mail
                        },
                        token: createToken('student', newStu._id),
                    })
                }
            })
        }
    })

}


//学生使用学号和密码登录
//先不管学号重复的问题了。。
const Login = (req, res) => {
    let studentLogin = new model.Student({
		student_id: req.body.student_id,
		password: sha1(req.body.password),
    })
    model.Student.findOne({
        "student_id": studentLogin.student_id
    }, (err, stuDoc) => {
        if (err) {
            console.log(err)
            res.json({
                success: false,
            })
            return
        }
        if (!stuDoc) {
            console.log("账号不存在");
			res.json({
				success: false,
                reason: "账号不存在"
			})
        }  else if (studentLogin.password === stuDoc.password) {
            console.log('登录成功')
            res.json({
				success: true,
				// mail: doc.mail,
				// _id: doc._id,
				accountInfo: {
					_id: stuDoc._id,
					name: stuDoc.name,
					city: stuDoc.city,
					school: stuDoc.school,
					mail: stuDoc.mail,
					create_time: stuDoc.create_time,
					student_id: stuDoc.student_id
				},
				// token 信息验证
				token: createToken("student", stuDoc._id)
			})
        } else {
            console.log('密码错误')
			res.json({
				success: false,
				reason: "密码错误"
			})
        }
        
    })
}


module.exports = {
   LoginByJaccount,
   Register,
   Login
}