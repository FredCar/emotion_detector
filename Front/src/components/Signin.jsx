import React, { useState } from "react";
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
            <form onSubmit={handleSubmit}>
                <label>
                    Nom : 
                    <input type="texte" onChange={(e) => setName(e.target.value)} />
                </label>
                <br />
                <label>
                    Email : 
                    <input type="email" onChange={(e) => setEmail(e.target.value)} />
                </label>
                <br />
                <label>
                    Mot de passe : 
                    <input type="password" onChange={(e) => setPassword(e.target.value)} />
                </label>
                <br />
                <label>
                    Confirmation du mot de passe : 
                    <input type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
                </label>
                <br />
                <input type="submit" value="Envoyer" />
            </form>
        </>
    )
};

export default Signin;