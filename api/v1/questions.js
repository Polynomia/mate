const model = require('../../models')
var async = require("async");
/*
const Create = (req, res) => {
    model.Form.findById(req.body.form_id, function(err, formDoc){
        if (err) {
			console.log(err)
			res.send(err)
        } else {
            req.questions.forEach(function(question){
                let questionCreate = new model.Question({
                    form_id: formDoc.id,
                    type: question.type,
                    content: question.content, 
                    choices: question.choices
                })
                questionCreate.save((err, newQues) => {
                    if (err) {
                        console.log(err)
                        return handleError(err)
                    }
                    // if(question.type === 'multi_choice' || question.type === 'single_choice'){
                    //     question.choices.forEach(function(choice){
                    //         let choiceCreate = new model.Choice({
                    //             content: choice,
                    //             question_id: newQues.id,
                    //             order: choice.order
                    //         })
                    //         choiceCreate.save((err, newChoice) => {
                    //             if (err) {
                    //                 console.log(err)
                    //                 return handleError(err)
                    //             } else {
                    //                 res.json({
                    //                     success: true
                    //                 })
                    //             }
                    //         })
                    //     })
                        
                    // } else {
                    //     res.json({
                    //         success: true
                    //     })
                    // }
                })
                
            })
            res.json({
                success: true
            })
        }
    })

}
*/

const Create = (req, res) => {
    let questionCreate = new model.Question({
        form_id: req.body.form_id,
        type: req.body.type,
        content: req.body.content,
        choices: req.body.choices,
        ans: req.body.ans
    })
    questionCreate.save((err, question) => {
        if (err) {
            console.log(err)
            res.json({
                success: false
            })
        }
        res.json({
            success: true,
            question_id: question._id
        })
    })
}

const Question = (req, res) => {
    model.Form.find({'form_id': req.query.form_id}, (err, doc) => {
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
    Question
}