"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function User() {
  _classCallCheck(this, User);

  /**
   * User id
   * @type {number}
   * */
  this.id = undefined;

  /**
   * User email address
   * @type {string}
   * */
  this.email = undefined;

  /**
   * User first name
   * @type {string}
   * */
  this.firstName = undefined;

  /**
   * User last name
   * @type {string}
   * */
  this.lastName = undefined;
};

exports.default = User;