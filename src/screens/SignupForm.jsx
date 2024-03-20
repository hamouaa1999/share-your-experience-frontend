import axios from "axios";
import AuthButtons from "../components/AuthButtons";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { SERVER_ADDRESS } from "../config";

const SignupForm = function() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState(''); 
    const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const {state, dispatch} = useContext(AuthContext);
     const navigate = useNavigate();

    const handleSignup = () => {
        axios.post('http://' + SERVER_ADDRESS + ':5555/api/auth/signup', {
            first: firstName,
            last: lastName,
            email: email,
            password: password
        })
        .then((response) => {
            let user = response.data;
            dispatch(state, {type: 'LOGIN', payload: user});
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/auth-login');
        })
        .catch(error => alert("Internal Server Error (" + error.response.status + ")"));
    }
    return (
        <>
            <div>
                <AuthButtons />
            </div>
            <div className="form-container">
                <div className="authentication-form">
                    <div className="login-signup">
                        <h3 id="signup">Sign Up</h3>
                    </div>
                    <div className="first-name">
                        <input 
                            className="auth-input" 
                            type="text" 
                            placeholder="Enter your first name here..." 
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="last-name">
                        <input 
                            className="auth-input" 
                            type="text" 
                            placeholder="Enter last name here..." 
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="email">
                        <input 
                            className="auth-input" 
                            type="email" 
                            placeholder="Enter email here..." 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="password">
                        <input 
                            className="auth-input" 
                            type="password" 
                            placeholder="Enter password here..." 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="signup-btn-container">
                        <button className="signup-btn" onClick={() => handleSignup()}>
                            <img className="signup-img" src="https://static.thenounproject.com/png/587164-200.png" alt="" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignupForm;