const model = require('../../models')
var async = require("async");
const sha1 = require('sha1')

const Register = (req, res) => {
    let teacherRegister = new model.Teacher({
        name: req.body.name,
        city: req.body.city,
        school: req.body.school,
        country: req.body.country,
		website: req.body.website,
        description: req.body.description,
        mail: req.body.mail,
        password: sha1(req.body.password)
    })

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
			teacherRegister.save(err => {
				if (err) {
					console.log(err)
					res.json({
						success: false
					})
					return
				}
				res.json({
					success: true
				})
			})
		}
	})
}

const UpadateTeacherInfo = (req, res) => {

    model.Teacher.findByIdAndUpdate(
		req.body.id,
		{
            name: req.body.name,
            city: req.body.city,
            school: req.body.school,
            country: req.body.country,
            website: req.body.website,
            description: req.body.description,
            mail: req.body.mail
		},
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
				})
			}
		})
    
}


module.exports = {
    Register,
    UpadateTeacherInfo
}