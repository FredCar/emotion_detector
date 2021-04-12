import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Routing from "../Routing";
import axios from 'axios';
import Button from '@material-ui/core/Button';

const SubmitForm = ((props) => {
    const [text, setText] = useState();
    const history = useHistory();
    

    const handleSubmit = (() => {
        let url = `${Routing.baseUrl}/predict`
        let data = {
            "text" : text,
        };

        axios.post(url, data)
        .then(({data}) => {
            sessionStorage.setItem("data", JSON.stringify(data.data))
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
                <Button 
                    variant="contained"
                    onClick={handleSubmit}
                >
                    Analyser
                </Button>
            </form>
        </>
    )
});

export default SubmitForm;