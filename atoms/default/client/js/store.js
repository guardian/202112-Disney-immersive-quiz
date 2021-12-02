import {createStore, applyMiddleware, combineReducers} from "redux";
import thunk from "redux-thunk";

const initialState = {
    dataLoaded: false,
    sheets: null,
    content: {},
    UI: {
        view: 'home'
    }
};

export const assetsPath = "<%= path %>";

export const 
    ACTION_DATA_LOADED = 'action_data_loaded',
    ACTION_SET_SHEETS = 'action_set_sheets',
    ACTION_SET_SCORE = 'action_set_score',
    ACTION_SET_VIEW = 'action_set_view',
    ACTION_GENERATE_QUESTIONS = 'action_gen_questions'
    ;

const setSheets = (sheets) => {
    return {
        type: ACTION_SET_SHEETS,
        payload: sheets
    };
}
const setDataLoaded = () => {
    return {
        type: ACTION_DATA_LOADED,
        payload: true
    };
}

const genQuestions = (data, count) => data.sort(()=>Math.random() - .5).slice(0,count);

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_SET_SHEETS:
            const content = {};
            action.payload.global.forEach(v => {
                content[v.key] = v.content;
            });

            content['sections'] = {};
            action.payload.sections.forEach(v => {
                content.sections[v.panel] = v;
            })
            content['questions'] = genQuestions(action.payload.questions, content.questionCount)
            // content['questions'] = action.payload.questions.sort(()=>Math.random() - .5).slice(0,8);
            // action.payload.questions.forEach(v => {
            //     content.questions[v.panel] = v;
            // })
            
            return {...state, sheets: action.payload, content: content };
            // return {...state, sheets: action.payload };

            break;
        case ACTION_DATA_LOADED:
            return {...state, dataLoaded: true};
        case ACTION_SET_SCORE:
            return {...state, UI: {...state.UI, score: action.payload}};        
        case ACTION_SET_VIEW:
            return {...state, UI: {...state.UI, view: action.payload}};
        case ACTION_GENERATE_QUESTIONS:
            return {...state, content: {...state.content, questions: genQuestions(state.sheets.questions, state.content.questionCount)}};
        default:
            return state;
    }
}

export const fetchData = (url) => {
    return  (dispatch) => {
        fetch(`${url}?t=${new Date().getTime()}`)
            .then(resp=> resp.json())
            .then((d)=>{
                console.log(d);
                dispatch(setSheets(d.sheets));
                dispatch(setDataLoaded());

            })
            // // .then(setTimeout(this.intro, 2000))
            // .then(this.intro)
            .catch(err => {
                console.log(err);
            });
        }
    
}

export default createStore(rootReducer, applyMiddleware(thunk));