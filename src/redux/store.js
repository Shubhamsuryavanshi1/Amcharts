import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer"
import thunkMiddleware from 'redux-thunk';

const middleWare = [thunkMiddleware];
const store = configureStore({
    reducer:{
        data:rootReducer,
    },
    middleware:middleWare
})

export default store;