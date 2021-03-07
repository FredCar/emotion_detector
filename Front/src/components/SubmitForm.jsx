import React from "react";
import { useState, useEffect } from "react";
import Routing from "../Routing";
import axios from 'axios';

const SubmitForm = ((props) => {
    const [test, setTest] = useState();


    const fetcher = (() => {
            axios.get(Routing.baseUrl)
            .then((data) => {
                setTest(data.data.message)
            })
            .catch((error) => {
                console.error(error)
            })
    });

    useEffect(() => {
        fetcher();
    }, [])


    return (
        <>
            <form>

                <textArea 
                    placeholder="Entrez votre code içi..." 
                    cols="130" 
                    rows="25"
                    wrap="off"
                >
                </textArea>

                <br />
                <br />

                <input 
                    type="submit" 
                    value="Envoyer" 
                />

            </form>

            <h3>TEST</h3>
            <p>{test}</p>

        </>
    )
});

export default SubmitForm;