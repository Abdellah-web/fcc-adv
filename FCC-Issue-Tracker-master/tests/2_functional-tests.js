/*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
let id1, id2;

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('POST /api/issues/apitest => object with issue data', function() {
    test('Every field filled in', function(done) {
      chai.request(server)
      .post('/api/issues/apitest')
      .send({
        issue_title: 'Title',
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in',
        assigned_to: 'Chai and Mocha',
        status_text: 'In QA'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "Title");
        assert.equal(res.body.issue_text, "text");
        assert.equal(res.body.created_by, "Functional Test - Every field filled in");
        assert.equal(res.body.assigned_to, "Chai and Mocha");
        assert.equal(res.body.status_text, "In QA");
        id1 = res.body._id;
        done();
      });
    });
    
    test('Required fields filled in', function(done) {
      chai.request(server)
      .post('/api/issues/apitest')
      .send({
        issue_title: 'Title',
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in',
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "Title");
        assert.equal(res.body.issue_text, "text");
        assert.equal(res.body.created_by, "Functional Test - Every field filled in");
        id2 = res.body._id;
        done();
      });
    });
    
    test('Missing required fields', function(done) {
      chai.request(server)
      .post('/api/issues/apitest')
      .send({})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.failure, "Missing required info");
        done();
      });
    });
  });
  
  
  suite('PUT /api/issues/apitest => text', function() {
    test('No body', function(done) {
      chai.request(server)
      .put('/api/issues/apitest')
      .send()
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, 'no updated field sent');
        done();
      })
    });
    
    test('One field to update', function(done) {
      chai.request(server)
      .put('/api/issues/apitest')
      .send({
        _id: id1,
        issue_title: 'new_title'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, 'successfully updated');
        done();
      })
    });
    
    test('Multiple fields to update', function(done) {
      chai.request(server)
      .put('/api/issues/apitest')
      .send({
        _id: id1,
        issue_title: 'new title',
        issue_text: 'new text',
        created_by: 'new creator',
        assigned_to: 'new assignee',
        status_text: 'new status',
        open: 'false'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, 'successfully updated');
        done();
      })
    });
  });
  

  suite('GET /api/issues/apitest => Array of objects with issue data', function() {      
    test('No filter', function(done) {
      chai.request(server)
      .get('/api/issues/apitest')
      .query({})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], '_id');
        done();
      });
    });
    
    test('One filter', function(done) {
      chai.request(server)
      .get('/api/issues/apitest')
      .query({ issue_title: 'new title' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.equal(res.body[0].issue_title, 'new title');
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], '_id');
        done();
      });
    });
    
    test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
      chai.request(server)
      .get('/api/issues/apitest')
      .query({ issue_title: 'new title', issue_text: 'new text' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.equal(res.body[0].issue_title, 'new title');
        assert.equal(res.body[0].issue_text, 'new text');
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], '_id');
        done();
      });      
    });
  });
  

  suite('DELETE /api/issues/apitest => text', function() {
    test('No _id', function(done) {
      chai.request(server)
      .delete('/api/issues/apitest')
      .send({})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, '_id error');
        done();
      })
    });
    
    test('Valid _id', function(done) {
      chai.request(server)
      .delete('/api/issues/apitest')
      .send({
        _id: id1
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, `deleted ${id1}`);
        done();
      })
    });

    test('Clean up issues created in tests', function(done) {
      chai.request(server)
      .delete('/api/issues/apitest')
      .send({
        _id: id2
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, `deleted ${id2}`);
        done();
      })
    });
  });
});
