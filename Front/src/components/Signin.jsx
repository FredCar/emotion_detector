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

const Signin = (props) => {
    const classes = useStyle();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [alert, setAlert] = useState();

    const handleSubmit = () => {
        if (password != confirmPassword) {
            setAlert("Les mots de passe sont différents !")
        }

        let url = `${Routing.baseUrl}/login`
        let data = {
            "username": name, 
            "email": email,
            "password": password,
        }

        axios.post(url, data)
        .then(({data}) => {
            console.log("DATA", data)
        //     sessionStorage.setItem("data", JSON.stringify(data.data))
        //     history.push("/result")
        })
        .catch((error) => {
        //     setIsLoading(false)
        //     setAlert("Une erreur s'est produite !")
            console.error(error)
        })
    }

    return (
        <>
            {
                alert && <>
                <Alert severity="error" className={classes.alert} >
                    {alert}
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