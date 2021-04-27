import React, { useState, useEffect } from "react";
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import SubmitText from "./SubmitText";
import SubmitUrl from "./SubmitUrl";

const useStyle = makeStyles({
  choiceButton: {
      width: 220,
      height: 25,
      margin: 20,
  },
  alert: {
      width: 800,
      margin: "auto",
      marginBottom: 20,
  },
});


const Submits = (props) => {
    const classes = useStyle();
    const [alert, setAlert] = useState([]);
    const [choice, setChoice] = useState("url")
    let component = ""

    useEffect(() => {
        const passedAlertSeverity = sessionStorage.getItem("alert_severity")
        const passedAlert = sessionStorage.getItem("alert")
        if (passedAlertSeverity && passedAlert) {
            setAlert([passedAlertSeverity, passedAlert])
            sessionStorage.removeItem("alert")
            sessionStorage.removeItem("alert_severity")
        }
    }, [])

    switch (choice) {
        case "text":
            component = <SubmitText setAlert={setAlert} />
            break
        case "url":
            component = <SubmitUrl setAlert={setAlert} />
            break
    }

    return(
        <>
            {
                alert.length > 0 && <>
                <Alert severity={alert[0]} className={classes.alert} >
                    {alert[1]}
                </Alert>
                </>
            }
            <div>
             <Button 
                    variant="contained"
                    color={choice === "url" ? "primary" : ""}
                    className={classes.choiceButton}
                    onClick={() => setChoice("url")}
                >
                    Avis clients
                </Button>

                <Button 
                    variant="contained"
                    color={choice === "text" ? "primary" : ""}
                    className={classes.choiceButton}
                    onClick={() => setChoice("text")}
                >
                    Texte libre
                </Button>
            </div>
            {component}
        </>
    )
};

export default Submits;