const model = require('../../models')
var async = require("async");
const getToken = require('../middlewares/getToken')


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
    let user = null;
    let teacher_id = undefined
    let student_id = undefined
    user = getToken(req, res)
    if (!user) {
        console.log("用户不存在")
        res.json({
            success: false,
            reason: "用户不存在"
        })
        return
    }
//检查类型与权限
        
        //教师可以看问卷，但是不能填写学生问卷
    if (user.type !== 'student' && req.body.type === 'student') {
        res.json({
            success: false,
            reason: "只有学生可以填写"
        })
        return
    }
    if(user.type === 'student') {
        try {
            let s = await model.Student.findById(user.id)
            student_id = s.student_id
        } catch (err) {
            res.json({
                success: false
            })
            return 
        }
    } else {
        teacher_id = user.id
    }

    
    console.log("@@@@@@@")
    console.log(req.body.student_id)

    try {
        let Af = await model.AnswerForm.findOne(
            {
                "form_id": req.body.form_id,
                "course_id": req.body.course_id,
                "student_id": student_id,
                "teacher_id": teacher_id
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
                        multi_choice: answer.multi_choice,
                        choice: answer.choice,
                        student_id: student_id,
                        teacher_id: teacher_id,
                        is_valid: req.body.is_valid
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
                let newAnsForm = new model.AnswerForm({
                    student_id: student_id,
                    form_id: req.body.form_id,
                    course_id: req.body.course_id,
                    teacher_id: teacher_id,
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