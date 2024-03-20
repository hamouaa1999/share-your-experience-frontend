import { createContext, useReducer, useState } from "react";
import axios from "axios";
import { SERVER_ADDRESS } from "../config";


export const AuthContext = createContext()

const authReducer = (state, action) => {

    switch(action.type) {
        case 'LOGIN':
            return {user: action.payload}
        case 'LOGOUT':
            return {user: null}
        default:
            return state;
    }
}

export const AuthContextProvider = function({ children }) {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })
    const [posts, setPosts] = useState([]);
    const [firstRetrieveDone, setFirstRetrieveDone] = useState(false);

    if (!firstRetrieveDone) {
        axios.get('http://' + SERVER_ADDRESS + ':5555/api/post/posts')
        .then((response) => {
            setFirstRetrieveDone(true);
            setPosts(response.data.posts);
        })
        .catch(() => alert('Internal Server Error'));
    }

    return (
        <AuthContext.Provider value={{state, dispatch, posts, setPosts}}>
            {children}
        </AuthContext.Provider>
    )
}