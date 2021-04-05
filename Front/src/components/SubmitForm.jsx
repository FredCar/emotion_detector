import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Routing from "../Routing";
import axios from 'axios';

const SubmitForm = ((props) => {
    const [response, setResponse] = useState();
    const [text, setText] = useState();
    const history = useHistory();


    const fetcher = (() => {
            axios.get(Routing.baseUrl)
            .then((resp) => {
                setResponse(resp.data.message)
            })
            .catch((error) => {
                console.error(error)
            })
    });


    const handleSubmit = (() => {
        let url = `${Routing.baseUrl}/predict`
        let data = {
            "text" : text,
        };

        axios.post(url, data)
        .then(({data}) => {
            setResponse(data.message)
            history.push("/result")
            console.log("data", data)
        })
        .catch((error) => {
            console.error(error)
        })
    });


    const handleChange = ((event) => {
        setText(event.target.value)
    });


    useEffect(() => {
        fetcher();
    }, [])


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

            <h3>REPONSE :</h3>
            <p>{response}</p>

        </>
    )
});

export default SubmitForm;