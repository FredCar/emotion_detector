import React from "react";
import BestResult from "./BestResult";
import ResultsTable from "./ResultsTable";

const ResultUrl = (props) => {
    const data = JSON.parse(sessionStorage.getItem("data"))

    return (
        <>
            <h4><a href={data["url"]} target="_blank" >{data["title"]}</a></h4>
            <br /> <br />
            <BestResult bestResult={data["best_result"]}/>
            <br /> <br />
            <ResultsTable detailedResults={data["detailed_results"]} phrases={data["phrases"]} />
        </>
    )
};

export default ResultUrl;