
const Thread = require('../models/Thread')

function ThreadHandler() {

  this.threadList = function(req, res) {
    var board = req.params.board;
    Thread.find(
        {},
        {
          reported: 0,
          delete_password: 0,
          "replies.delete_password": 0,
          "replies.reported": 0
        })
      .sort({bumped_on: -1})
      .limit(10)
      .toArray(function(err,docs){
        docs.forEach(function(doc){
          doc.replycount = doc.replies.length;
          if(doc.replies.length > 3) {
            doc.replies = doc.replies.slice(-3);
          }
        });
        res.json(docs);
      });
    });
  };
  
  this.newThread = function(req, res) {
    var board = req.params.board;
    const { delete_password, text } = req.body
    
    new Thread({ text, delete_password, board })
      .save((err, thread) => {
        if (err) {
          return next(Error(err))
        }
       res.redirect('/b/'+board+'/');
        })
  };
  
  //reported_id name
  this.reportThread = function(req, res) {
    var board = req.params.board;
    Thread.findAndModify(
        {_id: req.body.report_id},
        [],
        {$set: {reported: true}},
        function(err, doc) {});
    });
    res.send('reported');
  };
  
  //check doc return to return right res
  this.deleteThread = function(req, res) {
    var board = req.params.board;
    Thread.findAndModify(
        {
          _id: req.body.thread_id,
          delete_password: req.body.delete_password
        },
        [],
        {},
        {remove: true, new: false},
        function(err, doc){
          if (doc.value === null) {
            res.send('incorrect password');
          } else {
            res.send('success');
          }
        });
        
    });
  };
  
}

module.exports = ThreadHandler;
