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
    },
    originalText: {
        width: 480,
        margin: "auto",
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
}

const Result = ((props) => {
    const classes = useStyles();
    const data = JSON.parse(sessionStorage.getItem("data"))
    // data["all_results"] = JSON.parse(data["all_results"])

    // console.log("data", typeof data["all_results"])

    for (const res in data["all_results"]) {
        console.log("res", res, data["all_results"][res])
    }


    return (
        <>
            <p className={classes.originalText}>{data["original_text"]}</p>
            <br /><br />
            <BestResult bestResult={data["best_result"]}/>
        </>
    )
})

export default Result;