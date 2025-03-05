const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return new RegExp('^\\d{2,3}-\\d+$').test(v)
      },
      message: props => `${props.value} is not a valid phone number! Format must be XX-XXXXXXX or XXX-XXXXXXXX.`
    },
  },
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person