import { createContext, useState } from "react";


export const PostContext = createContext()


export const AuthContextProvider = function({ children }) {
    
    

    return (
        <AuthContext.Provider value={{posts, setPosts}}>
            {children}
        </AuthContext.Provider>
    )
}