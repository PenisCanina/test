import { combineReducers } from 'redux'


//TEMP
const Tree = (state = null, action) => {
    switch (action.type){
        case 'fetch' :
            return action.payload
        default:
            return state
    }
};

const CurrentId = (state = null, action) => {
    switch  (action.type) {
        case 'ADD':
            return ({id: action.payload, type : action.type});
        case 'KILL':
            return ({id: action.payload, type : action.type});
        case null:
            return null;
        default:
            return state
    }
};

const NodeForm = (state = null, action) => {
    switch (action.type){
        case 'set':
            return action.payload;
    default:
        return state
    }

};

export default combineReducers({
    Tree,
    CurrentId,
    NodeForm
});