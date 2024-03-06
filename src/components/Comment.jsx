import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Comment = function({ comment, comments, setComments, post, setPost, user }) {

    const [commentAuthor, setCommentAuthor] = useState(null);
    const [commentContent, setCommentContent] = useState(comment.content);
    const [editContent, setEditContent] = useState(false);
    const {state} = useContext(AuthContext)

    const handleDeleteComment = () => {
        axios.delete('http://localhost:5555/api/comments/delete/' + comment._id)
        .then(() => {
            console.log('Comment deleted successfully!');
            setComments(comments = comments.filter(item => item !== comment))
            setPost({...post, comments: post.comments > 1 ? (post.comments - 1) : 0})
        })
        .catch((error) => console.log(error.message))
    }

    const handleEditContent = () => {
        const editedContent = document.getElementById('edit-comment-description-input').value;
        axios.put('http://localhost:5555/api/comments/update/' + comment._id, {
            ...comment,
            content: editedContent
        })
        .then((response) => {
            setCommentContent(response.data.comment.content)
            console.log(response.data.comment.content)
            setEditContent(false)
        })
        .catch((error) => console.log(error.message))
    }

    useEffect(() => {
        axios.get('http://localhost:5555/api/users/' + comment.author)
        .then((response) => {
            if (state.user && state.user.user._id == response.data.user._id) {
                document.getElementById('enable-edit-content-btn-' + comment._id).style.display = 'inline'
                document.getElementById('enable-delete-content-btn-' + comment._id).style.display = 'inline'
            }
            setCommentAuthor(response.data.user);
        })
        .catch((error) => console.log('Error: ' + error.message))
    }, [comment])

    return (
        <>
            <div className="comment-card">
                <div className="comment-author">👤<b>{commentAuthor ? commentAuthor.first : ''} {commentAuthor ? commentAuthor.last : ''}</b></div>
                <>
                    <div className="comment-content">
                    {
                        editContent ? <input id="edit-comment-description-input" defaultValue={commentContent} /> : (<p className="post-description-paragraph">🗣️ {commentContent}</p>)
                    }
                    </div>
                    <span className="enable-edit-content-btn" id={"enable-edit-content-btn-" + comment._id} onClick={() => editContent ? handleEditContent() : setEditContent(!editContent)}>📝</span>
                    <span className="enable-delete-content-btn" id={"enable-delete-content-btn-" + comment._id} onClick={() => handleDeleteComment()}>❌</span> 
                </>
            </div>
        </>
    )
}

export default Comment;