import { useContext, useState } from "react";
import AuthButtons from "./AuthButtons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const LoginForm = function() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {state, dispatch} = useContext(AuthContext);

    const handleLogin = (email, password) => {
        axios.post('http://localhost:5555/api/auth/login', {
            email: email,
            password: password
          })
          .then(function (response) {
            let user = response.data;
            dispatch(state, {type: 'LOGIN', payload: user});
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/');
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    return (
        <>
            <div>
                <AuthButtons />
            </div>
            <div className="form-container">
                <div className="authentication-form">
                    <div className="login-signup">
                        <h3 id="login">Login</h3>
                    </div>
                    <div className="input-container">
                        <input className="auth-input" type="email" placeholder="Enter email here..." onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="input-container">
                        <input className="auth-input" type="password" placeholder="Enter password here..." onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="login-btn-container">
                    <button className="login-btn" onClick={() => handleLogin(email, password)}><img className="login-img" src="https://static.thenounproject.com/png/587164-200.png" alt="" /></button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginForm;