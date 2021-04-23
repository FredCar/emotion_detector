import React from "react";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles({
    button: {
        height: 30,
    }
})

const handleLogout = (e) => {
    localStorage.removeItem("access_token")
}

const LogoutButton = (props) => {
    const classes = useStyle();
    
    return (
        <Button 
            variant="contained" 
            color="primary" 
            size="small" 
            className={classes.button}
            onClick={handleLogout}
        >
            <a className="nav-link" href="/#login">Deconnexion <span className="sr-only">(current)</span></a>
        </Button>
    )
};

export default LogoutButton;