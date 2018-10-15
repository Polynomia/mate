const model = require('../../models')
var async = require("async");


const getStatus =async (req, res) => {
    let all = 0;
    let inv = 0;
    try {
        all = await model.AnswerForm.count({
            "course_id": req.query.course_id,
            "form_id": req.query.form_id
        })

    } catch (err) {
        console.log(err)
        res.json({success: false})
        return 
    }
    try {
        inv = await model.AnswerForm.count({
            "course_id": req.query.course_id,
            "form_id": req.query.form_id,
            "is_valid": false
        })

    } catch (err) {
        console.log(err)
        res.json({success: false})
        return 
    }
    res.json({
        filled: all,
        invalid: inv
    })

}

const saveAnswer = async (req, res) => {
    let ansList = [];
    try {
        let Af = await model.AnswerForm.findOne(
            {
                "form_id": req.body.form_id,
                "course_id": req.body.course_id,
                "student_id": req.body.student_id
            }
        )
        if(Af) {
            res.json({
                success: false,
                reason: "此学生已经填写过问卷"
            })
        } else {
                for(answer of req.body.answers) {
                    let answerCreate = new model.Answer({
                        question_id: answer.question_id,
                        course_id: req.body.course_id,
                        form_id: req.body.form_id,
                        content: answer.content,
                        choices: answer.choices
                    })
                    try {
                        let newAns = await answerCreate.save()
                        ansList.push(newAns._id)
                        console.log(ansList)
                    } catch (err) {
                        console.log(err)
                        res.json({success: false})
                        return 
                    }     
                }
                console.log("**************")
                let newAnsForm = new model.AnswerForm({
                    student_id: req.body.student_id,
                    form_id: req.body.form_id,
                    course_id: req.body.course_id,
                    answer_ids: ansList,
                    is_valid: req.body.is_valid
                })
                newAnsForm.save((err, newAF) => {
                    if(err){
                        console.log(err)
                        res.json({success: false})
                        return 
                    } else {
                        res.json({
                            success: true
                        })
                    }
                })
        }

    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
        return 
    }
}



module.exports = {
    getStatus,
    saveAnswer
}