import React from "react";

const Result = ((props) => {
    // let sessionStorage  = window.sessionStorage;

    return (
        <h1>{sessionStorage.getItem("result")}</h1>
    )
})

export default Result;