import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { socket } from "../sockets/socket";
import { SERVER_ADDRESS } from "../config";
import $ from 'jquery'




/**
 * 
 * A component responsible for showing post-related information 
 * (image, description, number of views, number of likes, number of comments)
 * 
 * @param {*} props 
 * @returns 
 */

export default function Card(props) {

    const [post, setPost] = useState(props.post)
    const {state} = useContext(AuthContext);
    const [display, setDisplay] = useState(true);
    const [likers, setLikers] = useState([])
    const navigate = useNavigate();


    const showLikes = () => {

        axios.get('http://' + SERVER_ADDRESS + ':5555/api/post/post/' + post._id + '/get-likers')
        .then((response) => {
            setLikers([...response.data.likers])
            document.getElementById('show-likes-container').style.display = 'flex';
        })
        .catch((error) => alert("Internal Server Error (" + error.response.status + ")"));
    }


    
    useEffect(() => {
        socket.connect();
        socket.on('new like', (like) => {
            if (state.user && state.user.user._id != like.user && post._id == like.post) {
                axios.get('http://' + SERVER_ADDRESS + ':5555/api/post/post/' + like.post)
                .then((response) => {
                    setPost(response.data.post);
                })
                .catch((error) => alert("Internal Server Error (" + error.response.status + ")"));
            }
        })

        socket.on('new comment', (comment) => {
            if (state.user && state.user.user._id != comment.author && post._id == comment.post) {
                axios.get('http://' + SERVER_ADDRESS + ':5555/api/post/post/' + comment.post)
                .then((response) => {   
                    setPost(response.data.post);
                })
                .catch((error) => alert("Internal Server Error (" + error.response.status + ")"));
            } 
        })
    }, [post]);


    const handleLike = () => {
        if (state.user) {
            if (!post.likes.includes(state.user.user._id)) {
                axios.put('http://' + SERVER_ADDRESS + ':5555/api/post/update/' + post._id, {
                    ...post,
                    likes: [...post.likes, state.user.user._id]
                })
                .then(() => {
                    socket.emit('new like', {user: state.user.user._id, post: post._id})
                    setPost({...post, likes: [...post.likes, state.user.user._id]})
                })
                .catch((error) => alert("Internal Server Error (" + error.response.status + ")"));
            } else {
                alert("You have already liked this post");
            }
        }   
    }

    const shareComment = () => {
        const comment = document.getElementById('comment-input-' + post._id).value;
        if (comment.length) {
            axios.post('http://' + SERVER_ADDRESS + ':5555/api/comments/add-comment', {
                author: state.user.user._id,
                post: post._id,
                content: comment
            })
            .then(() => {
                document.getElementById('comment-input-' + post._id).style.display = 'none';
                document.getElementById('comment-input-' + post._id).value = '';
                document.getElementById('comment-share-btn-' + post._id).style.display = 'none';
                socket.emit('new comment', {comment: comment, author: state.user.user._id, post: post._id});
                setPost({...post, comments: post.comments + 1});
            })
            .catch((error) => alert("Internal Server Error (" + error.response.status + ")"));
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
            <div className="card-title">
                📷 
                <Link to={`/users/${post.photographer}`}>
                    <b>{post.first} {post.last}</b>
                </Link>
            </div>
            <div className="post-description-paragraph-container">
                <p 
                    className="post-description-paragraph" 
                    maxlength="10"
                >
                        📜
                        {post.description.length > 100 ? post.description.slice(0, 100) + "..." : post.description}
                </p>
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