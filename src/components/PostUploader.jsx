import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { socket } from "../sockets/socket";
import { SERVER_ADDRESS } from "../config";


function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          resolve(fileReader.result)
        };
        fileReader.onerror = (error) => {
          reject(error)
        }
      })
}

const uploadPost = () => {
    document.getElementById("file-uploader").click();
}

const PostUpload = function() {

    const [file, setFile] = useState(null);
    const {state, posts, setPosts} = useContext(AuthContext);
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [tagToAdd, setTagToAdd] = useState('');
    

    const handleUpload = async () => {
        if (file != null) {
            const base = await convertToBase64(file);
            axios.post('http://' + SERVER_ADDRESS + ':5555/api/post/posts', {
                "photographer": state.user ? state.user.user._id : '',
                "first": state.user ? state.user.user.first : '',
                "last": state.user ? state.user.user.last : '',
                "image": base,
                "description": description,
                "likes": [],
                "comments": 0,
                "views": 0,
                "tags": tags
            })
            .then((response) => {
                socket.emit('new post', {post: response.data.post})
                setPosts([...posts, response.data.post])
                setFile(null);
                setTags([]);
                setTagToAdd('');
                setDescription('');
                document.getElementById('image-for-upload').src = "https://static.thenounproject.com/png/16251-200.png"
            })
            .catch((error) => console.log(error.message))
        } else {
            alert('Upload a file !');
        }

    }

    return (
        <>
        <div>
            <div id="card-share-container">
                <div id="card-for-upload">
                <div className="image-photographer">
                    <img id='image-for-upload' src="https://cdn-icons-png.flaticon.com/512/1665/1665578.png" alt="" onClick={() => uploadPost()} />
                    <div className="card-title-for-upload">📷 <b>{state.user ? state.user.user.first : ''} {state.user ? state.user.user.last : ''}</b></div>
                </div>
                <div className="other-infos">
                    <div className="description-emoji-container">
                    <div id="description-emoji-for-upload">📜</div>
                    <div>
                    <textarea id="post-description-paragraph-container-for-upload" 
                        name="post-description-paragraph-container-for-upload"
                        placeholder="Enter description here..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>
                    </div>
                    <hr />
                    <div className="likes-comments">
                        <div className="views">
                            <span>👀 0</span>
                        </div>
                        <div className="likes">
                            <span>👍🏻 0</span>
                        </div>
                        <div className="comments">
                            <span>🗣️ 0</span>
                        </div>
                    </div>
                    <hr />
                    <div>
                        <div>
                            <input id="add-tag-input" placeholder="Enter tags here..." type="text" onChange={(e) => {setTagToAdd(e.target.value);}} />
                            <span className="add-tag-btn" onClick={() => {
                                document.getElementById('add-tag-input').value = '';
                                setTags([...tags, tagToAdd]);
                                setTagToAdd('');
                            }}>➕</span><span className="share-btn" onClick={() => handleUpload()}>✅</span>
                        </div>
                        <div className="tags">
                            {
                                tags.map(tag => (<div className="tag">#{tag}</div>))
                            }
                        </div>
                    </div>
                </div>
                </div>
                <div>
                </div>
            </div>
            <div className="upload-share-btns">
                    <div>
                        <input 
                            id="file-uploader" 
                            type="file" 
                            onChange={(e) => {
                                document.getElementById('image-for-upload').src = URL.createObjectURL(e.target.files[0]); 
                                setFile(e.target.files[0]);
                            }} 
                        />
                    </div>
                </div>
            </div>        
        </>
    )
}

export default PostUpload;