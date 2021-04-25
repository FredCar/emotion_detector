import React, { useState } from "react";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SubmitText from "./SubmitText"

const useStyle = makeStyles({
  choiceButton: {
      width: 220,
      height: 25,
      margin: 20,
  }
});


const Submits = (props) => {
    const classes = useStyle();
    const [choice, setChoice] = useState("airbnb")

    return(
        <>
            <div>
             <Button 
                    variant="contained"
                    color={choice === "airbnb" ? "primary" : ""}
                    className={classes.choiceButton}
                    onClick={() => setChoice("airbnb")}
                >
                    Avis AirBnB
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
            <SubmitText />
        </>
    )
};

export default Submits;