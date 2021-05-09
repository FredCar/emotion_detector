import React from "react";
import BestResult from "./BestResult";
import ResultsTable from "./ResultsTable";
import ResultsGraph from "./ResultsGraph";

const ResultUrl = (props) => {
    console.log("sessionStorage : ", JSON.parse(sessionStorage.getItem("data")))
    const data = JSON.parse(sessionStorage.getItem("data"))

    return (
        <>
            <h4><a href={data["url"]} target="_blank" rel="noreferrer" >{data["title"]}</a></h4>
            <br /> <br />
            <BestResult bestResult={data["best_result"]} />
            <br /> <br />
            <ResultsGraph detailedResults={data["detailed_results"]} />
            <br /> <br />
            <ResultsTable detailedResults={data["detailed_results"]} phrases={data["phrases"]} sents={data["sents"]} />
        </>
    )
};

export default ResultUrl;