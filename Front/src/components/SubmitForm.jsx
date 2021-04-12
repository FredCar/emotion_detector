import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Routing from "../Routing";
import axios from 'axios';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  submitButton: {
      width: 485,
  },
  progressBar: {
      width: 485,
      margin: "auto",
  },
  alert: {
      width: 800,
      margin: "auto",
      marginBottom: 20,
  },
});

const SubmitForm = ((props) => {
    const [text, setText] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState();
    const history = useHistory();
    const classes = useStyles();
    

    const handleSubmit = (() => {
        setIsLoading(true)
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
            setIsLoading(false)
            setAlert("Une erreur s'est produite !")
            console.error(error)
        })
    });


    const handleChange = ((event) => {
        setText(event.target.value)
    });


    return (
        <>
            {
                alert && <>
                <Alert severity="error" className={classes.alert} >
                    {alert}
                </Alert>
                </>
            }
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

export default SubmitForm;