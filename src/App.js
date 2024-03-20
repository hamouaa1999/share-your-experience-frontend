import './App.css';
import Card from './components/Card';
import { useLoaderData } from 'react-router-dom';
import { useContext, useEffect, useReducer, useState } from 'react';
import AuthButtons from './components/AuthButtons'
import { AuthContext } from './contexts/AuthContext';
import PostUpload from './components/PostUploader';
import { socket } from './sockets/socket';
import { SERVER_ADDRESS } from './config';
import ClipLoader from "react-spinners/ClipLoader";
import $ from 'jquery';

function App() {

  const {posts, setPosts} = useContext(AuthContext);
  const [showedPosts, setShowedPosts] = useState([]);
  const {tag} = useLoaderData();
  const {state, dispatch} = useContext(AuthContext);


  useEffect(() => {
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (user != null) {
      dispatch({type: 'LOGIN', payload: {...user}}, state);
    }
    
    setShowedPosts(tag.length ? posts.filter((post) => post.tags.includes(tag)) : posts);
    
    socket.on('new post', (post) => {
      if (state.user && state.user.user._id != post.post.photographer) {
        setPosts([...posts, post.post]);
      }
    })

    $('#search').value = tag

  }, [tag, posts]);

  const showPostsByTag = (tag) => {
    
    window.history.pushState({}, null, 'http://' + SERVER_ADDRESS + ':3000/?search=' + tag);
    window.history.pushState({}, null, 'http://' + SERVER_ADDRESS + ':3000/?search=' + tag);
    
    $('#search').value = tag
    
    setShowedPosts(posts.filter((post) => post.tags.includes(tag)));    
  }
  
  return (
    <div className="App">
      <div>
        <AuthButtons showSearchBar={true} tag={tag} />
        <hr />
      </div>
      <div className="post-upload-container">
        {state.user ? (<PostUpload post={{
              photographer: state.user._id,
              first: state.user.first,
              last: state.user.last,
              image: "https://static.thenounproject.com/png/16251-200.png",
              description: "",
              likes: 0,
              comments: 0,
              views: 0,
              tags: []
          }}/>) : ('')}
      </div>
      <div className='container'>
      {
        [...showedPosts].reverse().map((post, index) => (
          <Card key={post._id} post={post} index={index} showPostsByTag={showPostsByTag}/>
        )) 
      }
      <ClipLoader
        color={"gray"}
        loading={showedPosts.length == 0}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      </div>
    </div>
  );
}

export default App;
