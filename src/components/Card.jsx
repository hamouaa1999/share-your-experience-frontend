import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSubmit } from "react-router-dom"
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { socket } from "../sockets/socket";

export default function Card(props) {

    const submit = useSubmit();
    const [post, setPost] = useState(props.post)
    const {state} = useContext(AuthContext);
    const [display, setDisplay] = useState(true);
    const [likers, setLikers] = useState([])
    const navigate = useNavigate();


    const showLikes = () => {
        axios.get('http://localhost:5555/api/post/post/' + post._id + '/get-likers')
        .then((response) => {
            setLikers([...response.data.likers])
            console.log(likers)
            document.getElementById('show-likes-container').style.display = 'flex';
        })
        .catch((error) => console.log(error.message));
    }


    
    useEffect(() => {
        socket.connect();
        socket.on('new like', (like) => {
            if (state.user && state.user.user._id != like.user && post._id == like.post) {
                axios.get('http://localhost:5555/api/post/post/' + like.post)
                .then((response) => {   
                    console.log('HERE ' + response.data.post);
                    setPost(response.data.post);
                })
                .catch((error) => console.log('Error: ' + error.message));
            } else {
                console.log("User is null!");
            }
        })

        socket.on('new comment', (comment) => {
            if (state.user && state.user.user._id != comment.author && post._id == comment.post) {
                axios.get('http://localhost:5555/api/post/post/' + comment.post)
                .then((response) => {   
                    setPost(response.data.post);
                })
                .catch((error) => console.log('Error: ' + error.message));
            } else {
                console.log("User is null!");
            }
        })
    }, [post]);


    const handleLike = () => {
        if (state.user) {
            if (!post.likes.includes(state.user.user._id)) {
                console.log('Likes performed');
                axios.put('http://localhost:5555/api/post/update/' + post._id, {
                    ...post,
                    likes: [...post.likes, state.user.user._id]
                })
                .then(() => {
                    console.log('Likes incremented successfully');
                    socket.emit('new like', {user: state.user.user._id, post: post._id})
                    setPost({...post, likes: [...post.likes, state.user.user._id]})
                })
                .catch((error) => console.log(error.message));
            } else {
                alert("Already liked");
            }
        }   
    }

    const shareComment = () => {
        const comment = document.getElementById('comment-input-' + post._id).value;
        if (comment.length) {
            axios.post('http://localhost:5555/api/comments/add-comment', {
                author: state.user.user._id,
                post: post._id,
                content: comment
            })
            .then(() => {
                document.getElementById('comment-input-' + post._id).style.display = 'none';
                document.getElementById('comment-input-' + post._id).value = '';
                document.getElementById('comment-share-btn-' + post._id).style.display = 'none';
                console.log(state.user.user._id);
                socket.emit('new comment', {comment: comment, author: state.user.user._id, post: post._id});
                setPost({...post, comments: post.comments + 1});
                console.log('comments updated');
            })
            .catch((error) => console.log(error));
        } else {
            alert('Empty comment!');
        }
    }

    const toggleCommentSection = () => {
        if (display) {
            document.getElementById('comment-input-' + post._id).style.display = 'inline'
            document.getElementById('comment-share-btn-' + post._id).style.display = 'inline'
            setDisplay(false);
        } else {
            document.getElementById('comment-input-' + post._id).style.display = 'none'
            document.getElementById('comment-share-btn-' + post._id).style.display = 'none'
            setDisplay(true);
        }
    }

    return (
        <div className="card">
            <img className='image' src={post.image} alt="" onClick={() => navigate('/posts/' + post._id)} />
            <div className="card-title">📷 <Link to={`/users/${post.photographer}`}><b>{post.first} {post.last}</b></Link></div>
            <div className="post-description-paragraph-container">
                <p className="post-description-paragraph" maxlength="10">📜{post.description.length > 100 ? post.description.slice(0, 100) + "..." : post.description}</p>
            </div>
            <hr />
            
                <div className="likes-comments">
                    <div className="views">
                        <span>👀 {post.views}</span>
                    </div>
                    <div className="likes">
                        <span onClick={() => state.user ? handleLike() : alert('Login first buddy!')}>👍🏻 {post.likes.length}</span>
                    </div>
                    <div className="comments">
                        <span onClick={() => state.user ? toggleCommentSection() : alert('Login first buddy!')}>🗣️ {post.comments}</span>
                    </div>
                </div>
                <hr />
                <div className="comment-input-container">
                    <input className="comment-input" id={"comment-input-" + post._id} type="text" />
                    <button id={"comment-share-btn-" + post._id} className="comment-share-btn" onClick={() => shareComment()}>Share</button>
                </div>
                <div>
                    <div className="tags">
                        {
                            post.tags.map(tag => (
                                <div className="tag" onClick={() => {
                                    props.showPostsByTag(tag);
                                }}>#{tag}</div>
                            ))
                        }
                    </div>
                </div>
            </div>
    )
}