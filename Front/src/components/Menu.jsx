import React, { useState, useEffect } from "react";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import LogoutButton from "./LogoutButton";

const useStyle = makeStyles({
    connexionDiv: {
        position: "absolute",
        right: 15,
    },
    buttonLi: {
        display: "inline-block",
        marginLeft: 10,
    },
    button: {
        height: 30,
    }
})

const Menu = (({accessToken, ...pros}) => {
    const classes = useStyle();
    const [token, setToken] = useState();
    
    useEffect(() => {
        setToken(localStorage.getItem("access_token"))
    }, [localStorage])

    console.log("token >>> ", token)

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand" href="/#">Détecteur d'émotions</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <a className="nav-link" href="/#result">Résultat <span className="sr-only">(current)</span></a>
                    </li>
                    <div className={classes.connexionDiv}>
                        <li className="nav-item active" className={classes.buttonLi}>
                            <Button size="small" className={classes.button}>
                                <a className="nav-link" href="/#signin">Inscription <span className="sr-only">(current)</span></a>
                            </Button>
                        </li>
                        <li className="nav-item active"className={classes.buttonLi}>
                            {
                                token && token !== "" && token !== undefined
                                    ? <LogoutButton />
                                    : <Button 
                                        variant="contained" 
                                        color="primary" 
                                        size="small" 
                                        className={classes.button}
                                    >
                                        <a className="nav-link" href="/#login">Connexion <span className="sr-only">(current)</span></a>
                                    </Button>
                            }
                            
                        </li>
                    </div>
                    </ul>
                </div>
            </nav>
            <br />
            <br />
        </>
    )
});

export default Menu;