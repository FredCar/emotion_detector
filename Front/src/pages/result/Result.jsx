import React from "react";
import ResultText from "./ResultText"
import ResultUrl from "./ResultUrl"

const Result = (props) => {
    let from = sessionStorage.getItem("from")

    switch (from) {
        case "url":
            return <ResultUrl />
        case "text":
            return <ResultText />
    }
};

export default Result;