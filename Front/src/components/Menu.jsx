import React from "react";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles({
    connexion: {
        position: "absolute",
        right: 15,
    },
    button: {
        display: "inline-block",
    }
})

const Menu = ((props) => {
    const classes = useStyle();

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
                    <div className={classes.connexion}>
                        <li className="nav-item active" className={classes.button}>
                            <Button variant="contained" color="primary">
                                <a className="nav-link" href="/#signin">Inscription <span className="sr-only">(current)</span></a>
                            </Button>
                        </li>
                        <li className="nav-item active" className={classes.button}>
                            <Button variant="contained" color="secondary">
                                <a className="nav-link" href="/#login">Connexion <span className="sr-only">(current)</span></a>
                            </Button>
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