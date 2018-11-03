const model = require('../../models')
const config = require('config-lite')(__dirname)
var async = require("async");
const sha1 = require('sha1');
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');
const createToken = require('../middlewares/createToken');
const getToken = require('../middlewares/getToken')
const request = require('request')

const Register = (req, res) => {
    let teacherRegister = new model.Teacher({
        name: req.body.name,
        city: req.body.city,
		school: req.body.school,
		age: req.body.age,
		organize: req.body.organize,
		gender: req.body.gender,
		title: req.body.title,
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
						age: doc.age,
						organize: doc.organize,
						gender: doc.gender,
						title: doc.title,
						create_time: doc.create_time
					}
				})
			})
		}
	})
}

//TODO 增加jaccount登录
const LoginByJaccount = (req, nRes) => {
	let jaccountEntity = null
	let isSuccess = true
	let user = null
	request
		.post({
			url: config.TOKEN_URL,
			form: {
				client_id: config.J_CLIENT_ID,
				client_secret: config.J_CLIENT_SECRET,
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
						model.User.findOne({
							j_id: jaccountEntity.id
						}, (err, userDoc) => {
							if (err) {
								isSuccess = false
								nRes.json({
									success: false
								})
								return
							}
							if (!userDoc) {
								let userRegister = new model.Teacher({
									j_id: jaccountEntity.id,
									name: jaccountEntity.name,
									school: "上海交通大学",
									city: "上海",
									organize: jaccountEntity.organize.name,
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
                                            token: createToken("teacher", user._id)
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
										token: createToken("teacher", user._id)
									})
								}
							}
						})
					} else {
						nRes.json({
							success: false
						})
					}
				})
			} else {
                nRes.json({
                    success: false
                })
            }
		})

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
			age: req.body.age,
			organize: req.body.organize,
			gender: req.body.gender,
			title: req.body.title,
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
					age: doc.age,
					organize: doc.organize,
					gender: doc.gender,
					title: doc.title,
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