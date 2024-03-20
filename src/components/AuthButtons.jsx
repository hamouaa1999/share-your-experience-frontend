import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import SearchBar from "./SearchBar";

/**
 * A component that contains the login/logout/signup buttons
 * 
 * @param {*} param0 
 * @returns 
 */

export default function AuthButtons({ showSearchBar }) {
    const navigate = useNavigate();
    const {state, dispatch} = useContext(AuthContext);

    const handleLogout = () => {
        localStorage.setItem('user', null); 
        dispatch({type: 'LOGOUT', payload: null})
        navigate('/')
    }

    return (
        <div>
            {state.user ? (
                <div className="nav-bar">
                    <div className="home" onClick={() => navigate('/')}>🏠 <b>Home</b></div>
                    {showSearchBar ? <SearchBar /> : ''}
                    <div>
                        <span><Link to={`/users/${state.user.user._id}`}><b>{state.user.user.first} {state.user.user.last}</b></Link></span>
                        <button 
                            className="nav-bar-login-btn" 
                            onClick={handleLogout}
                        >
                            <img className="login-img" src="https://cdn-icons-png.flaticon.com/512/154/154347.png" alt="" />
                        </button>
                    </div> 
                </div>
            ) : (<div className="nav-bar">
                    <div className="home" onClick={() => navigate('/')}>🏠 <b>Home</b></div>
                    {showSearchBar ? <SearchBar /> : ''}
                    <div className='notification-icon'>
                        <div id='notification'>
                        🔔
                        </div>
                    </div>
                    <div>
                        <button className="nav-bar-login-btn" onClick={() => navigate('/auth-login')}>
                            <img className="login-img" src="https://cdn-icons-png.flaticon.com/512/152/152532.png" alt="" />
                        </button>
                        <button className="nav-bar-signup-btn" onClick={() => navigate('/auth-signup')}>
                            <img className="login-img" src="https://static.thenounproject.com/png/736543-200.png" alt="" />
                        </button>
                    </div>
                </div>)
            }
        </div>
    );
}

