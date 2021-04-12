import React from "react";
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    bestResult: {
        width: 480,
        padding: 10,
        margin: "auto",
        backgroundColor: "lightgrey",
    },
    emoji: {
        width: 60,
        height: "auto",
        marginRight: 20,
        verticalAlign: "top",
    },
    bestResultText: {
        fontSize: "2.8em",
        verticalAlign: "top",
    }
})

const BestResult = ({bestResult}) => {
    const classes = useStyles();
    let emoji = ""
    
    switch (bestResult) {
        case "amour":
            emoji = "emoji_love.png"
            break
        case "colère":
            emoji = "emoji_anger.png"
            break
        case "joie":
            emoji = "emoji_joy.png"
            break
        case "peur":
            emoji = "emoji_fear.png"
            break
        case "surprise":
            emoji = "emoji_surprise.png"
            break
        case "tristesse":
            emoji = "emoji_sadness.png"
            break
        default:
            break
    }

    bestResult = bestResult.charAt(0).toUpperCase() + bestResult.slice(1)

    return (
        <Paper elevation={2} className={classes.bestResult} >
            <img src={`images/${emoji}`} alt={emoji} className={classes.emoji}  />
            <span className={classes.bestResultText} >{bestResult}</span>
        </Paper>
    )
};

export default BestResult;