/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  const convertHandler = new ConvertHandler();

  app.route('/api/convert')
    .get(function (req, res, next){
      const input = req.query.input;

      const initNum = convertHandler.getNum(input);
      const initUnit = convertHandler.getUnit(input);    

      res.body = {};
      res.body.initNum = initNum;
      res.body.initUnit = initUnit;

      if (res.body.initNum !== 'invalid input' && res.body.initUnit !== 'invalid input') {
        res.body.returnNum = convertHandler.convert(initNum, initUnit);
        res.body.returnUnit = convertHandler.getReturnUnit(initUnit);
        res.body.string = convertHandler.getString(initNum, initUnit, res.body.returnNum, res.body.returnUnit);
      }
      next();
    }, function(req, res) {
      let response;
      
      if (res.body.initNum === 'invalid input' && res.body.initUnit === 'invalid input') {
        response = Object.assign({}, res.body, { string: 'invalid number and unit' }); 
      } else if (res.body.initNum === 'invalid input') {
        response = Object.assign({}, res.body, { string: 'ivalid number' });
      } else if (res.body.initUnit === 'invalid input') {
        response = Object.assign({}, res.body, { string: 'invalid unit' });
      } else {
        response = {
          initNum: res.body.initNum,
          initUnit: res.body.initUnit,
          returnNum: res.body.returnNum,
          returnUnit: res.body.returnUnit,
          string: res.body.string
        }
      }
      
      res.status(200).json(response);
    });    
};
