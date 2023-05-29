import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";

/* Import Reducers */
import {decentralizedexchange, provider, tokens} from "./reducers"

const reducer = combineReducers({
    provider,
    tokens,
    decentralizedexchange
})

const initialState = {}

const middleware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store;
