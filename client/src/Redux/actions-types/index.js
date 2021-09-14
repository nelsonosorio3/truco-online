import axios from 'axios';
import { SING_UP } from '../actions/index';

export default function signUpUser(data) {
  return function(dispatch) {
    return axios.post(`http://localhost:3001/users`, data)
      .then(response => {
        dispatch({ type: SING_UP, payload: response.data });
      })
      .catch(error => console.log(error));
  };
};