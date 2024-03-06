import { Form, useSubmit } from "react-router-dom";

export default function SearchBar({ tag }) {

    const submit = useSubmit();
    
    
    return (
        <div>
            <Form onChange={(e) => submit(e.currentTarget, {
                replace: !(tag == null)
                })}>
                    <div className="search-bar">
                    <input id="search" className="search-field" type="text" placeholder="Search by tag..." name="search" defaultValue={tag} /> <button className="search-btn">🔍</button>
                    </div>
            </Form>
        </div>
        
    )
}