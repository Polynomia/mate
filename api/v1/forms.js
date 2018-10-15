const model = require('../../models')
var async = require("async");

//create a form

const Create = async (req, res) => {

    let formCreate = new model.Form({
        title: req.body.title,
	})
	let qs = []
	let id;
	try {
		let newForm = await formCreate.save()
		id = newForm._id
		for (const question of req.body.questions) {
			let questionCreate = new model.Question({
				form_id: newForm._id,
				type: question.type,
				content: question.content,
				choices: question.choices
			})
			try {
				let newQ = await questionCreate.save()
				qs.push(newQ._id)
			} catch (err) {
				console.log(err)
				res.json({success: false})
				return 
			}
		}
	} catch (err) {
		console.log(err)
		res.json({success: false})
		return 
	}


	console.log("**************")
	console.log(qs)
	
	model.Form.findByIdAndUpdate(
		id,
		{
			"question_ids": qs,
		},
		(err, updatedForm) => {
			if (err) {
				console.log(err)
				res.json({
					success: false
				})
				return
			} else {
				console.log('save successfully')
				res.json({
					success: true,
					from_id: updatedForm._id
				})
			}
		}
	)
        
}

const DelteForm = (req, res) => {
    model.Form.findOneAndRemove({
		_id: req.body.id
	}, err => {
		if (err) console.log(err)
		console.log('删除问卷成功')
		res.json({
			success: true
		})
	})
}

const Forms = (req, res) => {
    model.Form.find({'course_id': req.query.course_id}, (err, doc) => {
		if (err) {
			console.log(err)
			res.json({
				success: false
			})
			return
		}
		res.send(doc)
	})

}


module.exports = {
	Create,
	DelteForm,
	Forms
}