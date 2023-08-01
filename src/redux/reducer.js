import { combineReducers } from "redux";
import { FETCH_DATA_FAILURE,  FETCH_DATA_SUCCESS } from "./actions";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DATA_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        data:[],
        error:action.payload,
      };
      default:
        return state;
  }
};

const rootReducer = combineReducers({
    data: dataReducer,
  });
  
export default rootReducer;