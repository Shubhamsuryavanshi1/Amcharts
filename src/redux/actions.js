import axios from "axios";

const API_URL = "http://localhost:3000";

export const FETCH_DATA_SUCCESS = "FETCH_DATA_SUCCESS";
export const FETCH_DATA_FAILURE = "FETCH_DATA_FAILURE";

export const fetchDataSuccess = (data) => ({
    type:"FETCH_DATA_SUCCESS",
    payload:data
})

export const fetchDataFailure = (error) =>({
    type:"FETCH_DATA_FAILURE",
    payload:error,
})


export const fetchData = () =>{
    return(dispatch) => {
        axios.get(`${API_URL}/posts`)
        .then((response)=>{
            dispatch(fetchDataSuccess(response.data))
        })
        .catch((error)=>{
            dispatch(fetchDataFailure(error.message))
        })
    }
}