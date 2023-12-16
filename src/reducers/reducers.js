
import {combineReducers} from "redux";
import storage from "redux-persist/lib/storage";
import {persistReducer} from "redux-persist";


const initialStateTokenLife = {
    isTimeHas: false,
    expiredTime: null
}



const tokenReducer = (state = initialStateTokenLife, action) =>{
    switch (action.type){
        case "REQUEST":
            return {
                ...state,
                isTimeHas: true,
                expiredTime: action.payload
            }
        default:
            return state
    }
}
const requestReducerConfig = {
    key: 'token',
    storage,
    whitelist: ["isTimeHas", "expiredTime"]
}
const rootReducer = combineReducers({
    token: persistReducer(requestReducerConfig, tokenReducer)
})

export default rootReducer;