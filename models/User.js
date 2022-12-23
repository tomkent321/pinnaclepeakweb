mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  unitNumber: { type: String, required: true },
  buildingNumber: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  spouseName: { type: String, required: false },
  userName: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  address2: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  remoteOwner: { type: Boolean, required: true },
  access: { type: String, required: true },
  avatar: {type: String, required: false},
  date: { type: Date, defaul: Date.now},
})

module.exports = User = mongoose.model('user', UserSchema)