import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Routing from "../../Routing";
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles({
  submitButton: {
      width: 485,
  },
  progressBar: {
      width: 485,
      margin: "auto",
  },
});

const SubmitText = (({setAlert}) => {
    const [text, setText] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
    const classes = useStyle();
    

    const handleSubmit = (() => {
        setAlert([])
        setIsLoading(true)
        let url = `${Routing.baseUrl}/parse_text`
        let data = {
            "text" : text,
        };
        let config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        };

        axios.post(url, data, config)
        .then(({data}) => {
            sessionStorage.setItem("data", JSON.stringify(data.data))
            sessionStorage.setItem("from", "text")
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
                <TextareaAutosize 
                    placeholder="Entrez votre texte içi..." 
                    cols="50" 
                    rowsMin={10}
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
                    Analyser
                </Button>
                <br /> <br />
                {isLoading && <LinearProgress className={classes.progressBar} />}
                
            </form>
        </>
    )
});

export default SubmitText;