import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import BestResult from "./BestResult";
import ResultsTable from "./ResultsTable";


const useStyles = makeStyles({
    originalText: {
        width: 480,
        margin: "auto",
    }
})


const ResultText = ((props) => {
    const classes = useStyles();
    const data = JSON.parse(sessionStorage.getItem("data"))

    return (
        <>
            <p className={classes.originalText}>{data["original_text"]}</p>
            <br /> <br />
            <BestResult bestResult={data["best_result"]}/>
            <br /> <br />
            <ResultsTable detailedResults={data["detailed_results"]} phrases={data["phrases"]} sents={data["sents"]} />
            <br /> <br />
        </>
    )
})

export default ResultText;