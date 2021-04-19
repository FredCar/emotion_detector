import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Routing from "../Routing";
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles({
    body: {
        width: 480,
        margin: "auto",
        textAlign: "right",
    },
    input: {
        width: 240,
        marginLeft: 10,
        marginBottom: 10,
    },
    submitButton: {
        width: 480,
    },
    alert: {
        width: 800,
        margin: "auto",
        marginBottom: 20,
    },
});

const Signin = (props) => {
    const classes = useStyle();
    const history = useHistory();
    const token = localStorage.getItem("access_token")
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [alert, setAlert] = useState([]);

    // localStorage.removeItem("access_token")
    // sessionStorage.removeItem("alert_severity")
    // sessionStorage.removeItem("alert")

    const handleSubmit = () => {
        setAlert([])
        if (password !== confirmPassword) {
            setAlert(["error", "Les mots de passe sont différents !"])
            return ""
        }

        let url = `${Routing.baseUrl}/join`
        let data = {
            "username": name, 
            "email": email,
            "password": password,
        }

        axios.post(url, data)
        .then(({data}) => {
            sessionStorage.setItem("alert_severity", "success")
            sessionStorage.setItem("alert", data.msg)
            localStorage.setItem("access_token", data.access_token)
            history.push("/")
        })
        .catch((error) => {
            setAlert(["error", "Erreur : ce nom ou cet email éxiste déjà !"])
            console.error(error)
        })
    }

    return (
        token && token !== "" && token !== undefined
            ? <h3>Vous êtes déjà connecté !</h3>
            : <>
                {
                    alert.length > 0 && <>
                    <Alert severity={alert[0]} className={classes.alert} >
                        {alert[1]}
                    </Alert>
                    </>
                }
                <div className={classes.body}>
                    <form>
                        <label>
                            Nom : 
                            <input type="texte" className={classes.input} onChange={(e) => setName(e.target.value)} />
                        </label>
                        <label>
                            Email : 
                            {/* TODO Remettre type="email" */}
                            <input type="texte" className={classes.input} onChange={(e) => setEmail(e.target.value)} />
                        </label>
                        <label>
                            Mot de passe : 
                            <input type="password" className={classes.input} onChange={(e) => setPassword(e.target.value)} />
                        </label>
                        <label>
                            Confirmation du mot de passe : 
                            <input type="password" className={classes.input} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </label>
                        <Button 
                        variant="contained"
                        color="primary"
                        className={classes.submitButton}
                        onClick={handleSubmit}
                    >
                        Envoyer
                    </Button>
                    </form>
                </div>
            </>
    )
};

export default Signin;