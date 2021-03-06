'use strict';

var merge = require('../helper/object_helper').merge;

var InjectedFieldData = module.exports = function (values) {
  var defaults = {
    name: '',
    type: '',
    association: '',
    'class': '',
    isUpperValuePresent: false,
    cardinality: ''
  };

  var merged = merge(defaults, values);
  this.name = merged.name;
  this.type = merged.type;
  this.association = merged.association;
  this['class'] = merged['class'];
  this.isUpperValuePresent = merged.isUpperValuePresent;
  this.cardinality = merged.cardinality;
};
