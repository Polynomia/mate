const model = require('../../models')
var async = require("async");
const getToken = require('../middlewares/getToken')

//code from https://blog.csdn.net/LEOxiaoD/article/details/38521545
function handleAutoInc(argObj, callback) {
 
    model.FormLink.find({}).sort({'seq' : -1}).exec(function(err, results){
        if(err) {
            callback(err, null);
        } else {
            let last = results[0];
            console.log(last)
            let seq = last ? last['seq'] + 1 : 1;
            argObj['seq'] = seq;
 
            let newModel = new model.FormLink(argObj);
 
            newModel.save(function(err, nm){
                if(err) {
                    if(err.code == 11000) {
                        handleAutoInc(argObj, callback);
                    } else {
                        callback(err, null);
                    }
                } else {
                    callback(null, nm);
                }
            });
        }
    })
}


const getLink = async (req, res) => {
    // model.FormLink.find({}).sort({'seq':-1}).exec((err,res)=>{
    //     console.log(res[0])
    //     return
    // })
    let t;
    switch(req.body.type) {
        case 'self':
            t = 'self_form_link'
            break;
        case 'expert':
            t = 'expert_form_link'
            break;  
        case 'student':
            t = 'student_form_link'
            break;  
        default:
            res.json({
                success: false,
                reason: "type not exist"
            })
            return 
    }
    async function mycb(err, newlink){
        if(err){
            console.log(err)
            res.json({success: false})
            return 
        } else {
            let upObj = {};
            upObj[t] = "/form/"+String(newlink.seq)
            try {
                let newC = await model.Course.findOneAndUpdate(
                    {"_id": req.body.course_id},
                    upObj,
                    {new: true}
                )
                res.json({
                    route: newC[t]
                })
            } catch (err) {
                console.log(err)
                res.json({success: false})
                return 
            }
        }
    }
    
    try {
        let link = await model.FormLink.findOne({
            "course_id": req.body.course_id,
            "form_id": req.body.form_id
        })
        if(link) {
            res.json({
                route: "/form/"+String(link.seq)
            })
        } else {
            handleAutoInc({
                "course_id": req.body.course_id,
                "form_id": req.body.form_id,
                "type": req.body.type
            }, mycb)
        }
    } catch (err) {
        console.log(err)
        res.json({success: false})
        return 
    }

}

const Form =async (req, res) => {
    let seq = parseInt(req.params.seq, 10);
    let qs = [];
    let f,fl;
    let user = null;
    try {
        fl = await model.FormLink.findOne({"seq": seq})
        if(fl) {

        //问卷填写权限

            //学生问卷需要登录
            if (fl.type === 'student') {
                user = getToken(req, res)
                if (!user) {
                    console.log("用户不存在")
                    res.json({
                        success: false,
                        reason: "用户不存在"
                    })
                    return
                }
                // if (user.type !== 'student') {
                //     res.json({
                //         success: false,
                //         reason: "只有学生能填写此问卷"
                //     })
                //     return
                // }
            } 

            //自评只有开课教师可以填写
            if (fl.type === 'self') {
                user = getToken(req, res)
                if (!user) {
                    console.log("用户不存在")
                    res.json({
                        success: false,
                        reason: "用户不存在"
                    })
                    return
                }
                //防止学生填写
                if (user.type !== 'teacher') {
                    res.json({
                        success: false,
                        reason: "只有教师本人可以填写"
                    })
                    return
                }
                //确保只有老师本人可以填写
                try {
                    let cour = await model.Course.findById(fl.course_id)
                    if (String(cour.teacher_id) !== user.id) {
                        console.log(user.id)
                        console.log(cour.teacher_id)
                        res.json({
                            success: false,
                            reason: "只有开课教师本人可以填写"
                        })
                        return
                    }
                } catch (err) {
                    console.log(err)
                    res.json({success: false})
                    return
                }
            }

            try {
                f = await model.Form.findById(fl.form_id)
                if(f) {
                    for(qid of f.question_ids) {
                        try {
                            let question = await model.Question.findById(qid)
                            if(question) {
                                qs.push(question)
                            } else {
                                res.json({
                                    success: false,
                                    reason: "Oops, question not found"
                                })
                                return
                            }
                        } catch (err) {
                            console.log(err)
                            res.json({success: false})
                            return
                        }
                    }

                } else {
                    console.log(fl.form_id)
                    res.json({
                        success: false,
                        reason: "form not exist"
                    })
                    return
                }
            } catch (err) {
                console.log(err)
                res.json({success: false})
                return
            }
        } else {
            res.status(404).send({ error: 'not found' });
        }
        
    } catch (err) {
        console.log(err)
        res.json({success: false})
        return
    }

    try {
        let commonQues =  await model.Question.findOne(
            {"type": "common"}
        )
        res.json({
            success: true,
            type: fl.type,
            form: f,
            questions: qs,
            common: commonQues,
            course_id: fl.course_id
        })

    } catch (err) {
        console.log(err)
        res.json({success: false})
        return
    }
    
    
}

module.exports = {
    getLink,
    Form
}