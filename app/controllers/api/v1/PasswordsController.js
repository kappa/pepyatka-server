"use strict";

var models = require('../../../models')
  , UserMailer = require('../../../mailers').UserMailer
  , exceptions = require('../../../support/exceptions')

exports.addController = function(app) {
  var PasswordsController = function() {
  }

  PasswordsController.create = function(req, res) {
    var email = req.body.email

    if (email == null || email.length == 0) {
      return res.jsonp({ err: "Email cannot be blank" })
    }

    models.User.findByEmail(email).bind({})
      .then(function(user) {
        this.user = user
        return user.updateResetPasswordToken()
      })
      .then(function(token) {
        UserMailer.resetPassword(this.user, { user: this.user })
        res.jsonp({ message: 'We will send a password reset link to ' + this.user.email + ' in a moment' })
      })
      .catch(exceptions.reportError(res))
  }

  PasswordsController.update = function(req, res) {
    var token = req.params.resetPasswordToken

    if (token == null || token.length == 0) {
      return res.jsonp({ err: "Token cannot be blank" })
    }

    models.User.findByResetToken(token).bind({})
      .then(function(user) {
        this.user = user
        return user.updatePassword(req.body.newPassword, req.body.passwordConfirmation)
      })
      .then(function() { this.user.updateResetPasswordToken() })
      .then(function(user) { res.jsonp({ message: 'Your new password has been saved' }) })
      .catch(exceptions.reportError(res))
  }

  return PasswordsController
}

