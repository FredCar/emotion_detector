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

const Login = (props) => {
    const classes = useStyle();
    const history = useHistory();
    const token = localStorage.getItem("access_token")
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [alert, setAlert] = useState([]);

    const handleSubmit = () => {
        setAlert([])

        let url = `${Routing.baseUrl}/login`
        let data = {
            "email": email,
            "password": password,
        }

        axios.post(url, data)
        .then(({data}) => {
            sessionStorage.setItem("alert_severity", "success")
            sessionStorage.setItem("alert", data.msg)
            localStorage.setItem("access_token", JSON.stringify(data.access_token))
            history.push("/")
        })
        .catch((error) => {
            setAlert(["error", "Erreur : Email ou mot de passe incorrect"])
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
                            Email : 
                            {/* TODO Remettre type="email" */}
                            <input type="texte" className={classes.input} onChange={(e) => setEmail(e.target.value)} />
                        </label>

                        <label>
                            Mot de passe : 
                            <input type="password" className={classes.input} onChange={(e) => setPassword(e.target.value)} />
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

export default Login;