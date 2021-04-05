import React from "react";
import { useState, useEffect } from "react";
import Routing from "../Routing";
import axios from 'axios';

const SubmitForm = ((props) => {
    const [response, setResponse] = useState();
    const [text, setText] = useState();


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
        // const url = `${Routing.baseUrl}/predict`
        const data = {
            "text" : text,
        }

        axios.post(Routing.baseUrl, data)
        .then((resp) => {
            setResponse(resp.data.message)
            console.log("resp", resp)
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
                    type="submit" 
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