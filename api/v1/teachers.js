const model = require('../../models')
var async = require("async");
const sha1 = require('sha1');
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');
const createToken = require('../middlewares/createToken');
const getToken = require('../middlewares/getToken')

const Register = (req, res) => {
    let teacherRegister = new model.Teacher({
        name: req.body.name,
        city: req.body.city,
        school: req.body.school,
        country: req.body.country,
		website: req.body.website,
        description: req.body.description,
        mail: req.body.mail,
		password: sha1(req.body.password),
		// token: createToken("teacher", this._id)
    })

	// 将 objectid 转换为 用户创建时间
	teacherRegister.create_time = moment(objectIdToTimestamp(teacherRegister._id))
		.format('YYYY-MM-DD HH:mm:ss');

    model.Teacher.findOne({
		mail: (req.body.mail)
			.toLowerCase()
	}, (err, doc) => {
		if (err) console.log(err)
		// 邮箱已存在，不能注册
		if (doc) {
			res.json({
				success: false,
				reason: "邮箱已被注册"
			})
		} else {
			teacherRegister.save((err, doc) => {
				if (err) {
					console.log(err)
					res.json({
						success: false
					})
					return
				}
				res.json({
					success: true,
					token: createToken('teacher', doc._id),
					accountInfo: {
						_id: doc._id,
						name: doc.name,
						city: doc.city,
						school: doc.school,
						country: doc.country,
						website: doc.website,
						description: doc.description,
						mail: doc.mail,
						create_time: doc.create_time
					}
				})
			})
		}
	})
}

//TODO 增加jaccount登录
const LoginByJaccount = (req, res) => {

}




const UpadateTeacherInfo = (req, res) => {
	let teacher = getToken(req, res)
	if (!teacher) {
		console.log("账号不存在")
		res.json({
			info: false
		})
		return
	}
//暂时不能更新mail
    model.Teacher.findByIdAndUpdate(
		teacher.id,
		{
            name: req.body.name,
            city: req.body.city,
            school: req.body.school,
            country: req.body.country,
            website: req.body.website,
            description: req.body.description,
            // mail: req.body.mail
		},
		{new: true},
		(err, updatedUser) => {
			if (err) {
				console.log(err)
				res.json({
					success: false
				})
				return
			} else {
				console.log('更新用户信息成功')
				res.json({
					success: true
					// token: createToken(updatedUser.mail, updatedUser._id)
				})
			}
		})
    
}

const Login = (req, res) => {
	let teacherLogin = new model.Teacher({
		mail: req.body.mail,
		password: sha1(req.body.password),
	//	token: createToken("teacher", this._id)
	})
	model.Teacher.findOne({
		mail: teacherLogin.mail
	}, (err, doc) => {
		if (err) {
            console.log(err)
            res.json({
                success: false,
            })
            return
        }
		if (!doc) {
			console.log("账号不存在");
			res.json({
				success: false,
                reason: "账号不存在"
			})
		} else if (teacherLogin.password === doc.password) {
			console.log('登录成功')
			res.json({
				success: true,
				// mail: doc.mail,
				// _id: doc._id,
				accountInfo: {
					_id: doc._id,
					name: doc.name,
					city: doc.city,
					school: doc.school,
					country: doc.country,
					website: doc.website,
					description: doc.description,
					mail: doc.mail,
					create_time: doc.create_time,
					courses: doc.courses
				},
				// token 信息验证
				token: createToken("teacher", doc._id)
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


const UpdatePassword = (req, res) => {
	let teacher = getToken(req, res)
	if (!teacher) {
		console.log("账号不存在")
		res.json({
			success: false,
			reason: "账号不存在"
		})
	} else {
		let updatePassword = {
			oldPassword: req.body.oldPassword,
			newPassword: req.body.newPassword
		}
		model.Teacher.findById(teacher.id, (err, doc) => {
			if (err) {
				console.log(err)
				res.json({
					success: false,
				})
				return
			}
			if (!doc) {
				res.json({ success: false,
					reason: "帐号不存在"
				})
				return
			}
			if (doc.password !== sha1(updatePassword.oldPassword)) {
				console.log('密码错误')
				res.json({
					success: false,
					reason: "密码错误"
				})
			} else {
				model.Teacher.findOneAndUpdate(
					teacher.id,
					{ password: sha1(updatePassword.newPassword) },
					(err, updatedUser) => {
						if (err) {
							console.log(err)
							res.json({
								success: false
							})
						} else {
							console.log('更新密码成功')
							res.json({
								success: true
							})
						}
					}
				)
			}
		})
	}
}

module.exports = {
    Register,
	UpadateTeacherInfo,
	Login,
	UpdatePassword,
	LoginByJaccount
}