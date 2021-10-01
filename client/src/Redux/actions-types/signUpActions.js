import axios from 'axios';
import { SIGN_UP } from '../actions/index';

const signUpActions = (data) => {
  return function(dispatch) {
    return axios.post(`https://trucohenry.com/api/user`, data)
      .then(response => {
        dispatch({ type: SIGN_UP, payload: response.data });
      })
      .catch(error => console.log(error));
  };
};

export default {
  signUpActions,
};