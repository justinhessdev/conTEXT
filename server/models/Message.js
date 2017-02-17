// Message.js
const
    mongoose = require('mongoose'),
    messageSchema = new mongoose.Schema({
      _author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      to: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      body: {type: String},
      context: {type: Boolean},
      customContext: {type: String},
      urgent: {type: Boolean}
    }, {timestamps: true})

// middleware that runs before it returns User object back to you
// Instead of just getting objectId it grabs the user matching the objectId
messageSchema.pre('findOne', function() {
  this.populate('_author to')
})
messageSchema.pre('find', function() {
  this.populate('_author to')
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message



/*
jj - { "_id" : ObjectId("58a39219fc4c98025a646ff1"), "local" : { "password" : "$2a$08$wt/xJYY/J7ZLBdLcJ19luuVdmjCVC4fcluBUdTP8KG1kTF4R49nF2", "email" : "jj@jj.com", "name" : "jj" }, "__v" : 0 }
aa - { "_id" : ObjectId("58a3a756c8a707068b15dd1a"), "local" : { "password" : "$2a$08$tEVLqMTWJpWVdP75ATg9xuVWcL9kncelWFICG/aVH0G8XpulzTDyi", "email" : "aa@aa.com", "name" : "AA" }, "__v" : 0 }
bb - { "_id" : ObjectId("58a3a765c8a707068b15dd1b"), "local" : { "password" : "$2a$08$3p.krGboDzaeJnGr80ovou1ZQqVROyT7IIJ40REjYMK.9BMLEzKPa", "email" : "bb@bb.com", "name" : "BB" }, "__v" : 0 }
dd - { "_id" : ObjectId("58a3a774c8a707068b15dd1c"), "local" : { "password" : "$2a$08$0zmyu04G10onTm4tw.LUg.yOIe6LiHLL7gyRCvjJrfshGlikKis12", "email" : "dd@dd.com", "name" : "DD" }, "__v" : 0 }
cc - { "_id" : ObjectId("58a3a7d9c8a707068b15dd1d"), "local" : { "password" : "$2a$08$j6Z/YkboIJp6yvCfp1/cKOFcpqwmfHy0F/5NUdQ2j56p1KPSx03Jy", "email" : "cc@cc.com", "name" : "CC" }, "__v" : 0 }
zz - { "_id" : ObjectId("58a4cfd54fcb281bce077e10"), "local" : { "password" : "$2a$08$.E3KZcJo8.QmkXxthDKLhOhdxuUY4P3oL9oAHvECmdzRX/IPHyKhC", "email" : "zz@zz.com", "name" : "ZZ" }, "__v" : 0 }
yy - { "_id" : ObjectId("58a4cfe94fcb281bce077e11"), "local" : { "password" : "$2a$08$kM4kwOo5ZB/PpxRUba.p6.5oAMgn5R.OZym0a.JQyJUst6aUNjZni", "email" : "yy@yy.com", "name" : "yy" }, "__v" : 0 }
*/

// Message.create({_author: "58a39219fc4c98025a646ff1", to: "58a3a756c8a707068b15dd1a", body: "Booom"}, (err, message) => {
//   console.log(err || message)
// })
// "58a3a7d9c8a707068b15dd1d"
