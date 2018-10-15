const mongoose = require('./db/mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const FormLinkSchema = new Schema({

    seq: { type: Number, unique: true},
    form_id: { type: ObjectId, ref: 'Form' },
    course_id: { type: ObjectId, ref: 'Course' }
});


mongoose.model('FormLink', FormLinkSchema);