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
    // data["all_results"] = JSON.parse(data["all_results"])

    // console.log("data", typeof data["all_results"])

    // for (const res in data["all_results"]) {
    //     console.log("res", res, data["all_results"][res])
    // }

    return (
        <>
            <p className={classes.originalText}>{data["original_text"]}</p>
            <br /> <br />
            <BestResult bestResult={data["best_result"]}/>
            <br /> <br />
            <ResultsTable detailedResults={data["detailed_results"]} phrases={data["phrases"]} sents={data["sents"]} />
            <br /> <br />
            {data["sents"]}
        </>
    )
})

export default ResultText;