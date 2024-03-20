import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Comment from "../components/Comment";
import AuthButtons from "../components/AuthButtons";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { SERVER_ADDRESS } from "../config";

const Post = function() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [likers, setLikers] = useState([]);
    const {state, dispatch} = useContext(AuthContext);
    const [display, setDisplay] = useState(true);
    const [editDescription, setEditDescription] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user != null) {
            dispatch({type: 'LOGIN', payload: {...user}}, state);
        }
        
        axios.get('http://' + SERVER_ADDRESS + ':5555/api/post/post/' + id)
        .then((response) => {
            setPost(response.data.post);
            if (user && user.user._id == response.data.post.photographer) {
                document.getElementById('enable-edit-description-btn').style.display = 'inline'
                document.getElementById('enable-delete-description-btn').style.display = 'inline'
            }
            handleViewsIncrement(response.data.post)
            
            axios.get('http://' + SERVER_ADDRESS + ':5555/api/comments/posts/' + id + '/comments')
            .then((response) => {
                setComments([...response.data.comments]);
            })
            .catch((error) => {
                alert("Internal Server Error (" + error.response.status + ")");
            })
        })
        .catch(error => console.log(error.response.status));

    }, [id])

    const showLikes = () => {
        axios.get('http://' + SERVER_ADDRESS + ':5555/api/post/post/' + post._id + '/get-likers')
        .then((response) => {
            setLikers([...response.data.likers])
            document.getElementById('show-likes-container').style.pointerEvents = 'all'
            document.getElementById('show-likes-container').style.top = document.documentElement.scrollTop + 'px' || document.body.scrollTop + 'px'
            document.getElementById('show-likes-container').style.opacity = '1';
        })
        .catch((error) => alert(error.response.status) )
    }

    const handleViewsIncrement = (post) => {
        axios.put('http://' + SERVER_ADDRESS + ':5555/api/post/update/' + post._id, {
            ...post,
            views: post.views + 1
        })
        .then(() => {
            setPost({...post, views: post.views + 1})
        })
        .catch((error) => alert("Internal Server Error (" + error.response.status + ")"));   
    }

    const handleLike = () => {
        if (state.user) {
            if (!post.likes.includes(state.user.user._id)) {
                axios.put('http://' + SERVER_ADDRESS + ':5555/api/post/update/' + post._id, {
                    ...post,
                    likes: [...post.likes, state.user.user._id]
                })
                .then(() => {
                    setPost({...post, likes: [...post.likes, state.user.user._id]})
                })
                .catch((error) => console.log(error.response.status));
            } else {
                alert("You have already liked this post");
            }
        }   
    }

    const handleEditDescription = () => {
        const editedDescription = document.getElementById('edit-description-input').value;
        console.log(editedDescription);
        axios.put('http://' + SERVER_ADDRESS + ':5555/api/post/update/' + post._id, {
            ...post,
            description: editedDescription
        })
        .then((response) => {
            setPost(response.data.post)
            setEditDescription(false)
        })
        .catch((error) => alert("Internal Error Server (" + error.response.status + ")"))
    }

    const handleDeletePost = () => {
        axios.delete('http://' + SERVER_ADDRESS + ':5555/api/post/delete/' + post._id)
        .then(() => {
            document.location.href = 'http://' + SERVER_ADDRESS + ':3000/'
        })
    }

    const toggleCommentSection = () => {
        if (display) {
            document.getElementById('comment-input-' + post._id).style.display = 'inline'
            document.getElementById('comment-share-btn-' + post._id).style.display = 'inline'
            setDisplay(false);
        } else {
            document.getElementById('comment-input-' + post._id).style.display = 'none'
            document.getElementById('#comment-share-btn-' + post._id).style.display = 'none'
            setDisplay(true);
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
                ('comment-share-btn-' + post._id).style.display = 'none';
                setPost({...post, comments: post.comments + 1});
            })
            .catch((error) => alert("Internal Server Error (" + error.response.status + ")"));
        } else {
            alert('Empty comment!');
        }
    }

    return (
        <>
            <div>
            <div>
                <AuthButtons />
                <hr />
            </div>
            <div className="post-info-container">
                <div className="post-image">
                    <span id="enable-delete-description-btn" onClick={() => handleDeletePost()}>❌</span>
                    <img style={{width: '50%', height: '50%'}} src={post ? post.image : ''} alt="" />
                    </div>
                <div className="card-title">📷 {post ? (<Link to={`/users/${post.photographer}`}><b>{post.first} {post.last}</b></Link>) : ''}</div>
                <div className="post-description-paragraph-container">    
                    <div>
                    {
                        editDescription ? <input id="edit-description-input" defaultValue={post ? post.description : ''} /> 
                                        : (<p className="post-description-paragraph" maxlength="10">📜 {post ? post.description : ''}</p>)
                    }
                    </div>
                    <div>
                        <span id="enable-edit-description-btn" 
                            onClick={() => editDescription ? handleEditDescription() 
                                                           : setEditDescription(!editDescription)}
                        >📝</span>
                    </div> 
                </div>
            </div>
                
                <hr />
                <div className="likes-comments">
                    <div className="views">
                        <span>👀 {post ? post.views : ''}</span>
                    </div>
                    <div className="likes">
                        <span onClick={() => state.user ? handleLike() : alert('Login first!')}>👍🏻 </span> 
                        <span onClick={() => showLikes()}>{post ? post.likes.length : ''}</span>
                        <div id="show-likes-container">
                            <div className="show-likes">
                                <div id="close-likers-window" onClick={() => {
                                    document.getElementById('show-likes-container').style.opacity = '0'
                                    document.getElementById('show-likes-container').style.pointerEvents = 'none'
                                    }}>
                                ✖️
                                </div>
                                <ul>
                                    {

                                        likers.map((liker) => <li>{liker.first}</li>)
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="comments">
                        <span onClick={() => state.user ? toggleCommentSection() : alert('Login first!')}>🗣️ {post ? post.comments : ''}</span>
                    </div>
                </div>
                <div className="comment-input-container">
                    <input className="comment-input" id={post ? "comment-input-" + post._id : ''} type="text" />
                    <button id={post ? "comment-share-btn-" + post._id : ''} className="comment-share-btn" onClick={() => shareComment()}>Share</button>
                </div>
                <hr />
                <div>
                    <div className="tags">
                        { post ?
                            post.tags.map(tag => (
                                <div className="tag">#{tag}</div>
                            )) : ''
                        }
                    </div>
                </div>
                <hr />
                <div>
                {
                    [...comments].reverse().map((comment) => (
                        <Comment key={comment._id} comments={comments} setComments={setComments} comment={comment} post={post} setPost={setPost} />
                    ))
                    }
                </div>
            </div>
        </>
    )
}

export default Post;