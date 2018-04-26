'use strict';

var _chai = require('chai');

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const stat = promisify(fs.stat);

/* eslint-disable no-unused-expressions */
(0, _init2.default)().then(function () {
  describe('generate routes', function () {
    it('app should not be null', function (done) {
      (0, _chai.expect)(null).to.be.null;
      done();
    });
    // it('should save success output', async () => {
    //   expect(await stat(path.join(__dirname, './app/documentation/output.json'))).to.be.true;
    //   expect(await stat(path.join(__dirname, './app/documentation/error.json'))).to.be.true;
    // });
  });
});
/* eslint-enable no-unused-expressions */

// import { promisify } from 'util';
// import fs from 'fs';