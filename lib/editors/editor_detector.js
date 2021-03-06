'use strict';

var modelio = require('./editors').MODELIO,
    umldesigner = require('./editors').UMLDESIGNER,
    genmymodel = require('./editors').GENMYMODEL,
    visualparadigm = require('./editors').VISUALPARADIGM,
    UndetectedEditors = require('./editors').UndetectedEditors;

/**
 * Detects the editor that made the document represented by its passed root.
 * @param root {Object} the document's root.
 * @return {string} the editor's name.
 */
exports.detect = function(root) {
  if (!root) {
    throw new NullPointerException('The root element can not be null.');
  }

  if (root.eAnnotations && root.eAnnotations[0].$.source === 'Objing') {
    console.info('Parser detected: MODELIO.\n');
    return modelio;
  } else if (root.eAnnotations
      && root.eAnnotations[0].$.source === 'genmymodel') {
    console.info('Parser detected: GENMYMODEL.\n');
    return genmymodel;
  } else if(root['xmi:Documentation']
      && root['xmi:Documentation'][0].$.exporter === 'Visual Paradigm') {
    console.info('Parser detected: VISUAL PARADIGM.\n');
    return visualparadigm;
  }

  switch (UndetectedEditors.length) {
    case 0: // this should not be happening
      throw new UndetectedEditorException(
        'Your editor has not been detected, and this should not be happening.'
        + '\nPlease report this issue by mentioning what your editor is.');
    //case 1:
    //  return UndetectedEditors[0];
    default:
      return askForEditor();
  }
};

function askForEditor() {
  var choice = null;
  var choices = UndetectedEditors;
  choices.push({ value:'I don\'t see my editor.', name: "I don't see my editor." });
  require('inquirer').prompt([
    {
      type: 'list',
      name: 'answer',
      message: 'Please choose between the available Editors:',
      choices: choices,
      filter: function(val) {
        switch (val) { // only put undetected editors here
          case 'UML Designer':
            return umldesigner;
          case "I don't see my editor.":
            return 'error';
          default:
            return val.toLowerCase();
        }
      }
    }
  ], function(answers) {
      choice = answers.answer;
    }
  );
  while(!choice) {
    require('deasync').sleep(100);
  }
  if (choice === 'error') {
    throw new UndetectedEditorException(
      'You should report this issue by mentioning what your editor is.');
  }
  return choice;
}

function NullPointerException(message) {
  this.name = 'NullPointerException';
  this.message = (message || '');
}
NullPointerException.prototype = new Error();

function UndetectedEditorException(message) {
  this.name = 'UndetectedEditorException';
  this.message = (message || '');
}
UndetectedEditorException.prototype = new Error();
