const model = require('../../models')
var async = require("async");
const config = require('config-lite')(__dirname)
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const CreateReport  = async (req, res) => {
//判断报告是否已经存在
    try {
        let rr = await model.Report.findOne(
            {'course_id': ObjectId(req.query.course_id)}
        )
        if(rr) {
            res.send(rr)
            return 
        }
       
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }


    let genderNum, gradeNum, organizeNum, selfQ, expertQ, studentQ
    let passion, humor, difficulty, strictness, justice, homework

    console.log("######")
    try {
        console.log(ObjectId(req.query.course_id))
        genderNum = await model.AnswerForm.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            { $match: { type: 'student' }},
            { $match: { is_valid: true }},
            {
                $lookup: {
                    from: "students",
                    localField: "student_id",
                    foreignField: "student_id",
                    as: "personInfo"
                }
            },
            { $group: { _id: '$personInfo.gender', value: { $sum: 1 }}}
        ])
        console.log(genderNum)
        genderNum = genderNum.map((item)=>{
                                    return {
                                        value: item.value,
                                        name: item._id[0]
                                    }
                                })
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }
    
    
    try {
        gradeNum = await model.AnswerForm.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            { $match: { type: 'student' }},
            { $match: { is_valid: true }},
            {
                $lookup: {
                    from: "students",
                    localField: "student_id",
                    foreignField: "student_id",
                    as: "personInfo"
                }
            },
            { $group: { _id: '$personInfo.grade', value: { $sum: 1 }}}
        ])
        gradeNum = gradeNum.map((item)=>{
                                    return {
                                        value: item.value,
                                        name: item._id[0]
                                    }
                                })
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }


    try {
        organizeNum = await model.AnswerForm.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            { $match: { type: 'student' }},
            { $match: { is_valid: true }},
            {
                $lookup: {
                    from: "students",
                    localField: "student_id",
                    foreignField: "student_id",
                    as: "personInfo"
                }
            },
            { $group: { _id: '$personInfo.organize', value: { $sum: 1 }}}
        ])
        organizeNum = organizeNum.map((item)=>{
                                    return {
                                        value: item.value,
                                        name: item._id[0]
                                    }
                                })
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }


//获取问题的id list
    try {
        let stuF = await model.Form.findById( config.student_form )
        studentQ = stuF.question_ids
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }
    try {
        let expF = await model.Form.findById( config.expert_form )
        expertQ = expF.question_ids
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }
    try {
        let selfF = await model.Form.findById( config.self_form )
        selfQ = selfF.question_ids
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }

//TODO计算阅读量
    let readS
    try {
        let readingA = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: studentQ[9]}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        console.log(readingA)
        readS = readingA[0].value
        console.log(readS)
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }

    try {
        let difficultyA = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: studentQ[11]}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        console.log(difficultyA)
        difficulty = difficultyA[0].value
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }

    try {
        let homeworkA = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: studentQ[10]}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        homework = homeworkA[0].value
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }

    try {
        let justiceA = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: studentQ[2]}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        justice = justiceA[0].value
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }

    try {
        let humorA = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: studentQ[4]}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        humor = humorA[0].value
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }


    try {
        let strictnessA = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: {$in: [studentQ[3], studentQ[5]]}}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        strictness = strictnessA[0].value
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }

    try {
        let passionA = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: {$in: [studentQ[6], studentQ[0], studentQ[1]]}}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        passion = passionA[0].value
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }





//教学行为，学生
    let stuBehave = []
    try {
        let behave1 = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: {$in: studentQ.slice(13,21)}}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        stuBehave.push(behave1[0].value)
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }
   
    try {
        let behave2 = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: {$in: studentQ.slice(21,31)}}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        stuBehave.push(behave2[0].value)
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }

    try {
        let behave3 = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: {$in: studentQ.slice(31,40)}}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        stuBehave.push(behave3[0].value)
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }
    try {
        let behave41 = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id )}},
            {$match: {question_id: {$in: studentQ.slice(40,45)}}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        stuBehave.push(behave41[0].value)
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }
    try {
        let behave42 = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: {$in: studentQ.slice(45,54)}}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        stuBehave.push(behave42[0].value)
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }

    try {
        let behave43 = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: {$in: studentQ.slice(54,60).concat(studentQ.slice(61,65))}}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        stuBehave.push(behave43[0].value)
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }
    try {
        let behave5 = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: {$in: studentQ.slice(65,73)}}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        stuBehave.push(behave5[0].value)
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }





//教师满意度
    let teacherSatis = null
    try {
        let ts = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: { question_id: studentQ[7] }},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        teacherSatis = ts[0].value
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }


//课程满意度
    let courseSatis = null
    try {
        let cs = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: studentQ[8]}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        courseSatis = cs[0].value
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }




//TODO学习方式
    let daidx = [74,75,78,79,82,83,86,87,90,91]
    let saidx = [76,77,80,81,84,85,88,89,92,93]
    let daQ = []
    let saQ = []
    let dam = []
    let sam = []
    let learningMethod = []
    for (i of daidx) {
        daQ.push(studentQ[i-1])
    }
    for (i of saidx) {
        saQ.push(studentQ[i-1])
    }
    try {
        dam = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: {$in: daQ}}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$student_id',
                    value: {$sum: '$choice'}
                }
            },
            {$sort: {"student_id": -1}}
        ])
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }
    try {
        sam = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: {$in: saQ}}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$student_id',
                    value: {$sum: '$choice'}
                }
            },
            {$sort: {"student_id": -1}}
        ])
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }
    for(let k =0; k< sam.length; k++) {
        learningMethod.push([dam[k].value,sam[k].value])
    }





//教学行为 自评
    let selfBehave = []
    try {
        let behave1 = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: {$in: selfQ.slice(7,15)}}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        selfBehave.push(behave1[0].value)
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }
    try {
        let behave2 = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: {$in: selfQ.slice(16,25)}}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        selfBehave.push(behave2[0].value)
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }
    try {
        let behave3 = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: {$in: selfQ.slice(25,34)}}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        selfBehave.push(behave3[0].value)
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }
    try {
        let behave41 = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id)}},
            {$match: {question_id: {$in: selfQ.slice(34,39)}}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        selfBehave.push(behave41[0].value)
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }
    try {
        let behave42 = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: {$in: selfQ.slice(39,48)}}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        selfBehave.push(behave42[0].value)
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }

    try {
        let behave43 = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: {$in: selfQ.slice(48,58)}}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        selfBehave.push(behave43[0].value)
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }
    try {
        let behave5 = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: {$in: selfQ.slice(58,66)}}},
            { $match: { is_valid: true }},
            {
                $group: {
                    _id: '$form_id',
                    value: {$avg: '$choice'}
                }
            }
        ])
        selfBehave.push(behave5[0].value)
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }




//教学行为 同行
    let expBehave = []
    try {
        let behave1 = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: {$in: expertQ.slice(0,8)}}},
            { $match: { is_valid: true }},
            {
                $project: {
                    question_id: 1,
                    form_id: 1,
                    course_id: 1,
                    teacher_id: 1,
                    newChoice: {
                        $cond: { if: { $gte: [ "$choice", 2 ] }, then: 2, else: 1 }
                    },
                }
            },
            {
                $group: {
                    _id: '$form_id',
                    AVGvalue: {$avg: '$newChoice'}
                }
            }
        ])
        expBehave.push(behave1[0].AVGvalue*3-2)
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }


    try {
        let behave2 = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: {$in: expertQ.slice(9,18)}}},
            { $match: { is_valid: true }},
            {
                $project: {
                    question_id: 1,
                    form_id: 1,
                    course_id: 1,
                    teacher_id: 1,
                    newChoice: {
                        $cond: { if: { $gte: [ "$choice", 2 ] }, then: 2, else: 1 }
                    },
                }
            },
            {
                $group: {
                    _id: '$form_id',
                    AVGvalue: {$avg: '$newChoice'}
                }
            }
        ])
        expBehave.push(behave2[0].AVGvalue*3-2)
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }

    try {
        let behave3 = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: {$in: expertQ.slice(19,25)}}},
            { $match: { is_valid: true }},
            {
                $project: {
                    question_id: 1,
                    form_id: 1,
                    course_id: 1,
                    teacher_id: 1,
                    newChoice: {
                        $cond: { if: { $gte: [ "$choice", 2 ] }, then: 2, else: 1 }
                    },
                }
            },
            {
                $group: {
                    _id: '$form_id',
                    AVGvalue: {$avg: '$newChoice'}
                }
            }
        ])
        expBehave.push(behave3[0].AVGvalue*3-2)
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }

    try {
        let behave41 = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id )}},
            {$match: {question_id: {$in: expertQ.slice(26,31)}}},
            { $match: { is_valid: true }},
            {
                $project: {
                    question_id: 1,
                    form_id: 1,
                    course_id: 1,
                    teacher_id: 1,
                    newChoice: {
                        $cond: { if: { $gte: [ "$choice", 2 ] }, then: 2, else: 1 }
                    },
                }
            },
            {
                $group: {
                    _id: '$form_id',
                    AVGvalue: {$avg: '$newChoice'}
                }
            }
        ])
        expBehave.push(behave41[0].AVGvalue*3-2)
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }

    try {
        let behave42 = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: {$in: expertQ.slice(32,41)}}},
            { $match: { is_valid: true }},
            {
                $project: {
                    question_id: 1,
                    form_id: 1,
                    course_id: 1,
                    teacher_id: 1,
                    newChoice: {
                        $cond: { if: { $gte: [ "$choice", 2 ] }, then: 2, else: 1 }
                    },
                }
            },
            {
                $group: {
                    _id: '$form_id',
                    AVGvalue: {$avg: '$newChoice'}
                }
            }
        ])
        expBehave.push(behave42[0].AVGvalue*3-2)
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }

    try {
        let behave43 = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id) }},
            {$match: {question_id: {$in: expertQ.slice(42,49)}}},
            { $match: { is_valid: true }},
            {
                $project: {
                    question_id: 1,
                    form_id: 1,
                    course_id: 1,
                    teacher_id: 1,
                    newChoice: {
                        $cond: { if: { $gte: [ "$choice", 2 ] }, then: 2, else: 1 }
                    },
                }
            },
            {
                $group: {
                    _id: '$form_id',
                    AVGvalue: {$avg: '$newChoice'}
                }
            }
        ])
        expBehave.push(behave43[0].AVGvalue*3-2)
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }

    try {
        let behave5 = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id )}},
            {$match: {question_id: {$in: expertQ.slice(50,56)}}},
            { $match: { is_valid: true }},
            {
                $project: {
                    question_id: 1,
                    form_id: 1,
                    course_id: 1,
                    teacher_id: 1,
                    newChoice: {
                        $cond: { if: { $gte: [ "$choice", 2 ] }, then: 2, else: 1 }
                    },
                }
            },
            {
                $group: {
                    _id: '$form_id',
                    AVGvalue: {$avg: '$newChoice'}
                }
            }
        ])
        expBehave.push(behave5[0].AVGvalue*3-2)
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }

//TODO 建议行为
    let advBehavePos = []
    let advBehaveNeg = []

    try {
        let adv = await model.Answer.aggregate([
            { $match: { course_id: ObjectId(req.query.course_id )}},
            {$match: {question_id: {$in: expertQ.slice(0,8)
                                            .concat(expertQ.slice(9,18))
                                            .concat(expertQ.slice(19,25))
                                            .concat(expertQ.slice(26,31))
                                            .concat(expertQ.slice(32,41))
                                            .concat(expertQ.slice(42,49))
                                            .concat(expertQ.slice(50,56))}}},
            {
                $project: {
                    question_id: 1,
                    newChoice: {
                        "$cond": {
                            "if": { "$eq": [ "$choice", 2 ] }, 
                            "then": -1,
                            "else": {
                                "$cond": {
                                    "if": { "$eq": ["$choice",4]}, 
                                    "then": 1, 
                                    "else": 0
                                }
                            }
                        }
                    },
                }
            },
            {
                $lookup: {
                    from: "questions",
                    localField: "question_id",
                    foreignField: "_id",
                    as: "question"
                }
            },
            {
                $group: {
                    _id: '$question.content',
                    sumValue: {$sum: '$choice'}
                }
            },
            {$sort: {"sumValue": -1}}
        ])
        for(let j=0; j< config.MAX_ADV_NUM && j<adv.length; j++){
            if(adv[j].sumValue > 0) {
                advBehavePos.push(adv[j]._id[0])
            }
        }
        for(let j=0; j< config.MAX_ADV_NUM && j<adv.length; j++){
            if(adv[adv.length - j -1].sumValue < 0) {
                advBehaveNeg.push(adv[adv.length - j-1]._id[0])
            }
        }
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }


//TODO保存生成的报告

    try {
        let reportCreate = new model.Report({
            course_id: req.query.course_id,
            genderNum: genderNum,
            gradeNum: gradeNum,
            organizeNum: organizeNum,
            reading: readS,
            difficulty: difficulty,
            homework: homework,
            passion: passion,
            justice: justice,
            strictness: strictness,
            humor: humor,
            behavior_student: stuBehave,
            behavior_self: selfBehave,
            behavior_expert: expBehave,
            advBehavePos: advBehavePos,
            advBehaveNeg: advBehaveNeg,
            teacherSatisfaction: teacherSatis,
            courseSatisfaction: courseSatis,
            learningStyle: learningMethod
        })
        let nr = await reportCreate.save()
        res.send(nr)
        
    } catch (err) {
        console.log(err)
        res.json({
            success: false
        })
    }
}

const GetReport  = (req, res) => {

}


module.exports = {
    GetReport,
    CreateReport
 }