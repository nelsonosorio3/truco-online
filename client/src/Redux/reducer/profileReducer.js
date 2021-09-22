import { GET_PROFILE, GET_FRIENDS, GET_HISTORY, DELETE_FRIEND } from '../actions/index';

const INITIAL_STATE = {
  userProfile: {},
  userFriends: {
    requested: [],
    sender: []
  },
  userHistory: {},
};

const profileReducer = (state = INITIAL_STATE, {type, payload}) => {
  switch (type) {
    
    case GET_PROFILE:
    return {
      ...state,
      userProfile: {
          id: payload.id,
          username: payload.username,
          email: payload.email,
          gamesPlayed: payload.gamesPlayed,
          gamesWon: payload.gamesWon,
          gamesLost: payload.gamesLost,
      },
    };
      
    case GET_FRIENDS:
      console.log("REDUCER", payload)

      const ansFriends = {
        ...state,
        userFriends: {
          requested: payload.userRequested,
          sender: payload.userSender.userSender
        }
      }
    return ansFriends 

    case DELETE_FRIEND:
      const ans = {
        ...state,
        userFriends: {
          ...state.userFriends,
          sender: state.userFriends.sender.filter(f => f.id !== payload)
        }
      }
    return ans  

    // case GET_HISTORY:
    // return {
    //   userHistory: {
          
    //   },
    // };

    default:
      return state;    
  };
};

export default profileReducer;