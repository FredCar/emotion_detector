import React from "react";
import BestResult from "./BestResult";
import ResultsTable from "./ResultsTable";

const ResultUrl = (props) => {
    const data = JSON.parse(sessionStorage.getItem("data"))

    return (
        <>
            <h1>URL</h1>
            <BestResult bestResult={data["best_result"]}/>
            <br /> <br />
            <ResultsTable detailedResults={data["detailed_results"]} phrases={data["phrases"]} />
        </>
    )
};

export default ResultUrl;