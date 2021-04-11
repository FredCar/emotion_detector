import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Routing from "../Routing";
import axios from 'axios';

const SubmitForm = ((props) => {
    // const sessionStorage = window.sessionStorage;
    const [text, setText] = useState();
    const history = useHistory();
    

    const handleSubmit = (() => {
        let url = `${Routing.baseUrl}/predict`
        let data = {
            "text" : text,
        };

        axios.post(url, data)
        .then(({data}) => {
            sessionStorage.setItem("result", data.message)
            history.push("/result")
        })
        .catch((error) => {
            console.error(error)
        })
    });


    const handleChange = ((event) => {
        setText(event.target.value)
    });


    return (
        <>
            <form>
                <textarea 
                    placeholder="Entrez votre texte içi..." 
                    cols="50" 
                    rows="5"
                    wrap="on"
                    onChange={handleChange}
                >
                </textarea>
                <br />
                <br />
                <input 
                    type="button" 
                    value="Envoyer" 
                    onClick={handleSubmit}
                />
            </form>
        </>
    )
});

export default SubmitForm;