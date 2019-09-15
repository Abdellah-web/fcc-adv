'use strict';

const expect = require('chai').expect;
const Issue  = require('./issueModel')
require("dotenv").config({ path: "./.env" });

module.exports = function (app) {
  app.route('/api/issues/apitest')
  .get(function (req, res){
    const query = req.query;
    const { issue_title, issue_text, created_by, assigned_to, status_text, open } = req.query;


    if(Object.keys(query).length === 0) {
      //no query returns all issues
      Issue.find({}, (err, issues) => {
        if(err) {
          return res.send('error finding issues');
        }
        return res.send(issues);
      });
    } else {
      Issue.find({}, (err, issues) => {
        if(issue_title) {
          issues = issues.filter(issue => {
            return issue.issue_title === issue_title  
          });
        }
        if(issue_text) {
          issues = issues.filter(issue => {
            return issue.issue_text === issue_text
          });
        }
        if(created_by) {
          issues = issues.filter(issue => {
            return issue.created_by === created_by
          });
        }
        if(assigned_to) {
          issues = issues.filter(issue => {
            return issue.assigned_to === assigned_to
          });
        }
        if(status_text) {
          issues = issues.filter(issue => {
            return issue.status_text === status_text
          });
        }
        if(open) {
          console.log('open');
          issues = issues.filter(issue => {
            return issue.open.toString() === open
          });
        }

        return res.send(issues);
      });
    }
  })


  .post(function (req, res){
    const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

    //if required field missing
    if(!issue_title || !issue_text || !created_by) {
      return res.json({ failure: "Missing required info" })
    }

    const newIssue = new Issue({
      issue_title: issue_title,
      issue_text: issue_text,
      created_on: new Date(),
      updated_on: new Date(),
      created_by: created_by,
      assigned_to: assigned_to || "",
      status_text: status_text || "",
      open: true
    });

    newIssue.save((err, issue) => {
      if (err) {
        return res.json({ failure: `Something went wrong` })
      }

      return res.json({
        _id: issue._id,
        issue_title: issue.issue_title,
        issue_text: issue.issue_text,
        created_on: issue.created_on,
        updated_on: issue.updated_on,
        created_by: created_by,
        assigned_to: issue.assigned_to || "",
        status_text: issue.status_text || "",
        open: issue.open
      });
    });
  })


  .put(function (req, res){
    //give default value of "" if not sent with request
    const _id = req.body._id || "",
      issue_title = req.body.issue_title || "",
      issue_text = req.body.issue_text || "",
      created_by = req.body.created_by || "",
      assigned_to = req.body.assigned_to || "",
      status_text = req.body.status_text || "",
      open = req.body.open || "";

    if(!_id) {
      return res.send(`no ID sent`);
    }

    if(!issue_title && !issue_text && !created_by && !assigned_to && !status_text && !open) {
      return res.send(`no updated field sent`)
    }

    Issue.findById(_id, (err, issue) => {
      if(err || !issue) { 
        return res.send(`could not update ${_id}`) 
      }

      //update issue fields that have new info
      issue.updated_on = new Date();
      if (issue_title) { issue.issue_title = issue_title }
      if (issue_text)  { issue.issue_text  = issue_text  }
      if (created_by)  { issue.created_by  = created_by  }
      if (assigned_to) { issue.assigned_to = assigned_to }
      if (status_text) { issue.status_text = status_text }
      open ? issue.open = false : issue.open = true;

      issue.save((err, data) => {
        if (err) { 
          return res.json({ failure: `Could not save`}) 
        }
        return res.send('successfully updated')
      })
    });
  })


  .delete(function (req, res){
    const { _id } = req.body;

    if(!_id) {
      return res.send('_id error');
    }

    Issue.deleteOne({ _id: _id }, function (err) {
      if (err) {
        return res.send(`could not delete ${_id}`);
      }
      return res.send(`deleted ${_id}`);
    });
  });
};
