'use strict';
var P = require('bluebird');
var Inflector = require('inflected');
var SchemaUtils = require('../utils/schema');

function StripeReferenceFinder(secretKey, reference, params, opts) {

  function getReferenceModelId() {
    var referenceId = Inflector.singularize(reference.split('.')[0]) + 'Id';
    return params[referenceId];
  }

  function getCustomer() {
    return new P(function (resolve, reject) {
      var referenceModel = SchemaUtils.getReferenceModel(opts.mongoose,
        reference);
      if (!referenceModel) { return resolve(null); }

      referenceModel.findById(getReferenceModelId(), function (err, model) {
        if (err) { return reject(err); }
        resolve(model);
      });
    });
  }

  this.perform = function () {
    return getCustomer();
  };
}

module.exports = StripeReferenceFinder;

