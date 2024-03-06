import { createContext, useReducer, useState } from "react";
import axios from "axios";


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
        axios.get('http://localhost:5555/api/post/posts')
        .then((response) => {
            setFirstRetrieveDone(true);
            setPosts(response.data.posts);
        })
        .catch((error) => console.log("Error getting posts"));
    }

    return (
        <AuthContext.Provider value={{state, dispatch, posts, setPosts}}>
            {children}
        </AuthContext.Provider>
    )
}