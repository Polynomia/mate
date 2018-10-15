const model = require('../../models')
var async = require("async");

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
                "form_id": req.body.form_id
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
    let f;
    try {
        let fl = await model.FormLink.findOne({"seq": seq})
        if(fl) {
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
                    console.log("###########")
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
    res.json({
        success: true,
        form: f,
        questions: qs
    })
}

module.exports = {
    getLink,
    Form
}