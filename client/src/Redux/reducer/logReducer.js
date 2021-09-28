import { LOG_OUT, LOG_IN , LOG_IN_FACEBOOK} from '../actions/index';

const INITIAL_STATE = {
  isAuth: false, 
  user: null,
  id: null,
  message: ''
};

const logReducer = (state = INITIAL_STATE, {type, payload}) => {
  switch (type) {
    case LOG_IN:
      if(payload.login) {
        //Se almacena en el state las respuesta obtenida del server, en caso de afirmativa, el payload queda asi:
        // id: 1
        // login: true
        // username: "pedro"
        // token: "String"
        window.localStorage.setItem("token", payload.token);
        window.localStorage.setItem("isAuth", payload.login);
        window.localStorage.setItem("user", payload.username);
        return {
          ...state,
          isAuth: payload.login,
          user: payload.username,
          id: payload.id,
          message: payload.message,
          token: payload.token
        };
      } else {
        const newState = {
          ...state,
          isAuth: false,
          message: payload.message,
        };
        return newState
      };
    case LOG_IN_FACEBOOK:
      if(payload.login) {
        window.localStorage.setItem("token", payload.token);
        window.localStorage.setItem("isAuth", payload.login);
        window.localStorage.setItem("user", payload.username);
        return {
          ...state,
          isAuth: payload.login,
          user: payload.username,
          id: payload.id,
          message: payload.message,
          token: payload.token
        };
      } else {
        const newState = {
          ...state,
          isAuth: false,
          message: payload.message,
        };
        return newState
      };
    case LOG_OUT:
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("isAuth");
      window.localStorage.removeItem("user");
      return {
        ...state,
        isAuth: false,
        user: null,
        id: null,
      };  
    default:
      return state;    
  };
};

export default logReducer;