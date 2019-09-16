/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

var expect = require('chai').expect;
var mongodb = require('mongodb');
var mongoose = require('mongoose');

//connect to database
mongoose.connect(process.env.DB, { useNewUrlParser: true });

//create books schema and model
const booksSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  commentcount: {
    type: Number,
    default: 0
  },
  comments: [],
  updated_on :{ type: Number, required: true }
});

const booksModel = mongoose.model("Books", booksSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    booksModel.find({}, function (error, books) {
        if (error) {
          return res.send('no books found')
        }
        const result = books.map(book=>{return {_id:book._id, title: book.title, commentcount: book.commentcount }})
       result.sort( { updated_on: 'desc' } ) 
        return res.json(result)
        })
  })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
  if (!title) {
        return res.send('invalid title')
      } else {
        const bookDetails = {
          "title": title, updated_on: Date.now( )
        }
        const newBookAdded = new booksModel(bookDetails);

        newBookAdded.save();

        res.json(newBookAdded);
      }
  
  })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
     bookModel.remove({},function(err){
     if(err){
          return res.send('complete delete failed');
        }
        return res.send('complete delete successful');
     })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    if (!bookid) {
        return res.send('please put id')
      }
    bookModel.findById({ _id: bookid }, function(err,book){
    if (err || !book) {
          res.send('no book exists');
    }
        return res.json({_id: book._id, title: book.title, comments: book.comments });
    })
  })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    if (!bookid) {
        return res.send('please put id')
      }
    if(!comment || comment === ''){
      return res.send('please put comment')
    }
    bookModel.findById({ _id: bookid }, function(err, book){
    if (err || !book) {
          res.send('no book exists');
    }
      if(comment){
        book.comments.push(comment);
        book.commentcount++;
      }
      book.save(error => {
          if (error) {
            return res.send('could not add comment');
          }
          return res.json({_id: book._id, title: book.title, comments: book.comments });
        })
    })
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    if (!bookid) {
        return res.send('please put id')
      }
     bookModel.deleteOne({ _id: bookid }, function(err){
        if (err){
          res.send( 'no book exists' )
        }
        return res.send('delete successful');
   }) 
  });
  
};
