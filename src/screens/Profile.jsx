import { useContext, useEffect, useState } from "react";
import Card from "../components/Card";
import { AuthContext } from "../contexts/AuthContext";
import { useLoaderData, useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import axios from "axios";
import AuthButtons from "../components/AuthButtons";
import { SERVER_ADDRESS } from "../config";

const Profile = function() {
    
    const { state, dispatch, posts } = useContext(AuthContext); 
    const [user, setUser] = useState(null);
    const [showedPosts, setShowedPosts] = useState([]);
    const {tag} = useLoaderData();
    const { id } = useParams();
    
    const showPostsByTag = (tag) => {
        window.history.pushState({}, null, 'http://' + SERVER_ADDRESS + ':3000/?search=' + tag);
        window.history.pushState({}, null, 'http://' + SERVER_ADDRESS + ':3000/?search=' + tag);
        document.getElementById('search').value = tag
        setShowedPosts(posts.filter((post) => post.tags.includes(tag) && post.photographer == id));    
      }

      useEffect(() => {
        document.getElementById('search').value = tag
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if (loggedUser != null) {
            dispatch({type: 'LOGIN', payload: {...loggedUser}}, state);
        }
        setShowedPosts(tag.length ? posts.filter((post) => post.tags.includes(tag) && post.photographer == id)
                                  : posts.filter((post) => post.photographer == id));
        
        axios.get('http://' + SERVER_ADDRESS + ':5555/api/users/' + id)
        .then((response) => {
            setUser(response.data.user);
        })
        .catch((error) => alert("Internal Server Error (" + error.response.status + ")"));
    }, [tag, posts])

    return (
        <>
        <div>
            <AuthButtons showSearchBar={true} tag={tag} />
            <hr />
        </div>
        <h3>👤 {user ? user.first : ''} {user ? user.last : ''}</h3>
        <hr />
        <div className="container">
        {
            showedPosts.map((post) => <Card key={post._id}  post={post} showPostsByTag={showPostsByTag} />)
        }
        </div>
        </>
    );
}

export default Profile;