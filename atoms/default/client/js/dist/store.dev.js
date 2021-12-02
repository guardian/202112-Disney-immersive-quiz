"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.fetchData = exports.ACTION_GENERATE_QUESTIONS = exports.ACTION_SET_VIEW = exports.ACTION_SET_SCORE = exports.ACTION_SET_SHEETS = exports.ACTION_DATA_LOADED = exports.assetsPath = void 0;

var _redux = require("redux");

var _reduxThunk = _interopRequireDefault(require("redux-thunk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = {
  dataLoaded: false,
  sheets: null,
  content: {},
  UI: {
    view: 'home'
  }
};
var assetsPath = "<%= path %>";
exports.assetsPath = assetsPath;
var ACTION_DATA_LOADED = 'action_data_loaded',
    ACTION_SET_SHEETS = 'action_set_sheets',
    ACTION_SET_SCORE = 'action_set_score',
    ACTION_SET_VIEW = 'action_set_view',
    ACTION_GENERATE_QUESTIONS = 'action_gen_questions';
exports.ACTION_GENERATE_QUESTIONS = ACTION_GENERATE_QUESTIONS;
exports.ACTION_SET_VIEW = ACTION_SET_VIEW;
exports.ACTION_SET_SCORE = ACTION_SET_SCORE;
exports.ACTION_SET_SHEETS = ACTION_SET_SHEETS;
exports.ACTION_DATA_LOADED = ACTION_DATA_LOADED;

var setSheets = function setSheets(sheets) {
  return {
    type: ACTION_SET_SHEETS,
    payload: sheets
  };
};

var setDataLoaded = function setDataLoaded() {
  return {
    type: ACTION_DATA_LOADED,
    payload: true
  };
};

var genQuestions = function genQuestions(data, count) {
  return data.sort(function () {
    return Math.random() - .5;
  }).slice(0, count);
};

var rootReducer = function rootReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case ACTION_SET_SHEETS:
      var content = {};
      action.payload.global.forEach(function (v) {
        content[v.key] = v.content;
      });
      content['sections'] = {};
      action.payload.sections.forEach(function (v) {
        content.sections[v.panel] = v;
      });
      content['questions'] = genQuestions(action.payload.questions, content.questionCount); // content['questions'] = action.payload.questions.sort(()=>Math.random() - .5).slice(0,8);
      // action.payload.questions.forEach(v => {
      //     content.questions[v.panel] = v;
      // })

      return _objectSpread({}, state, {
        sheets: action.payload,
        content: content
      }); // return {...state, sheets: action.payload };

      break;

    case ACTION_DATA_LOADED:
      return _objectSpread({}, state, {
        dataLoaded: true
      });

    case ACTION_SET_SCORE:
      return _objectSpread({}, state, {
        UI: _objectSpread({}, state.UI, {
          score: action.payload
        })
      });

    case ACTION_SET_VIEW:
      return _objectSpread({}, state, {
        UI: _objectSpread({}, state.UI, {
          view: action.payload
        })
      });

    case ACTION_GENERATE_QUESTIONS:
      return _objectSpread({}, state, {
        content: _objectSpread({}, state.content, {
          questions: genQuestions(state.sheets.questions, state.content.questionCount)
        })
      });

    default:
      return state;
  }
};

var fetchData = function fetchData(url) {
  return function (dispatch) {
    fetch("".concat(url, "?t=").concat(new Date().getTime())).then(function (resp) {
      return resp.json();
    }).then(function (d) {
      console.log(d);
      dispatch(setSheets(d.sheets));
      dispatch(setDataLoaded());
    }) // // .then(setTimeout(this.intro, 2000))
    // .then(this.intro)
    ["catch"](function (err) {
      console.log(err);
    });
  };
};

exports.fetchData = fetchData;

var _default = (0, _redux.createStore)(rootReducer, (0, _redux.applyMiddleware)(_reduxThunk["default"]));

exports["default"] = _default;