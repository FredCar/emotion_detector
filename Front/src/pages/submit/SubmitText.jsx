import React, { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Routing from "../../Routing";
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles({
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

const SubmitText = ((props) => {
    const [text, setText] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState([]);
    const history = useHistory();
    const classes = useStyle();


    useEffect(() => {
        const passedAlertSeverity = sessionStorage.getItem("alert_severity")
        const passedAlert = sessionStorage.getItem("alert")
        if (passedAlertSeverity && passedAlert) {
            setAlert([passedAlertSeverity, passedAlert])
            sessionStorage.removeItem("alert")
            sessionStorage.removeItem("alert_severity")
        }
    }, [])
    

    const handleSubmit = (() => {
        setAlert([])
        setIsLoading(true)
        let url = `${Routing.baseUrl}/predict`
        let data = {
            "text" : text,
        };
        let config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        };

        axios.post(url, data, config)
        .then(({data}) => {
            console.log("DATA", data.data)
            sessionStorage.setItem("data", JSON.stringify(data.data))
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
            {
                alert.length > 0 && <>
                <Alert severity={alert[0]} className={classes.alert} >
                    {alert[1]}
                </Alert>
                </>
            }
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