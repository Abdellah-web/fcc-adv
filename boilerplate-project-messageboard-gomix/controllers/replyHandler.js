var ObjectId = require('mongodb').ObjectID;
const Thread = require('../models/Thread')

function ReplyHandler() {
  
  this.replyList = function(req, res) {
    var board = req.params.board;
    const { thread_id } = req.query;

      Thread.find({_id: thread_id},
      {
        reported: 0,
        delete_password: 0,
        "replies.delete_password": 0,
        "replies.reported": 0
      })
      .toArray(function(err,doc){
        res.json(doc[0]);
      });
  };
  
  this.newReply = function(req, res) {
    var board = req.params.board;
    const { thread_id } = req.body;
    var reply = {
      text: req.body.text,
      created_on: new Date(),
      reported: false,
      delete_password: req.body.delete_password,
    };
      Thread.findAndModify(
        {_id: thread_id},
        [],
        {
          $set: {bumped_on: new Date()},
          $push: { replies: reply  }
        },
        function(err, doc) {
        });
    });
    res.redirect('/b/'+board+'/'+req.body.thread_id);
  };
  
  this.reportReply = function(req, res) {
    var board = req.params.board;
    Thread.findAndModify(
        {
          _id: req.body.thread_id,
          "replies._id": req.body.reply_id
        },
        [],
        { $set: { "replies.$.reported": true } },
        function(err, doc) {
        });
    });
    res.send('reported');
  };
  
  this.deleteReply = function(req, res) {
    const reply = thread.replies.filter(r => r._id == reply_id)[0]

      if (reply.delete_password !== delete_password) {
        return res.send('incorrect password')
      }

      await Thread.updateOne({
        _id: thread_id,
        'replies._id': reply_id
      },
        {
          'replies.$.text': '[deleted]'
        }
      )
      res.send('success')
  };
  
}

module.exports = ReplyHandler;
