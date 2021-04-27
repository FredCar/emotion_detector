import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Routing from "../../Routing";
import axios from 'axios';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles({
  submitButton: {
      width: 485,
  },
  address: {
    width: 485,
  },
  progressBar: {
      width: 485,
      margin: "auto",
  },
});

const SubmitUrl = (({setAlert}) => {
    const [text, setText] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
    const classes = useStyle();


    const handleSubmit = (() => {
        setAlert([])
        setIsLoading(true)
        let url = `${Routing.baseUrl}/scrap_url`
        let data = {
            "url" : text,
        };
        let config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        };

        axios.post(url, data, config)
        .then(({data}) => {
            console.log("DATA", data.data)
            sessionStorage.setItem("data", JSON.stringify(data.data))
            sessionStorage.setItem("from", "url")
            setIsLoading(false)
            history.push("/result")
        })
        .catch((error) => {
            setIsLoading(false)
            setAlert(["error", "Une erreur s'est produite !"])
            console.error(error)
        })
    });


    const handleChange = ((event) => {
        setText(event.target.value)
    });


    return (
        <>
            <form>
                <input 
                    placeholder="Entrez l'adresse de l'annonce" 
                    className={classes.address}
                    onChange={handleChange}
                />
                <br />
                <br />
                <Button 
                    variant="contained"
                    color="primary"
                    className={classes.submitButton}
                    onClick={handleSubmit}
                >
                    Rechercher
                </Button>
                <br /> <br />
                {isLoading && <LinearProgress className={classes.progressBar} />}
                
            </form>
        </>
    )
});

export default SubmitUrl;