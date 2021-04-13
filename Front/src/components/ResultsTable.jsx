import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles({
    table: {
        margin: "auto",
    }
})

const ResultsTable = ({allResults, sents}) => {
    const classes = useStyle();

    console.log("all results", allResults)

    let headers = []
    let rows = []
    let result = ""
    for (const res in allResults) {
        console.log("res", res)
        result = allResults[res]
        console.log("result", result)
        headers.push(<th>{res}</th>)
        rows.push(
            <tr>
                <td>{result[0]}</td>
                <td>{result[1]}</td>
                <td>{result[2]}</td>
                <td>{result[3]}</td>
                <td>{result[4]}</td>
                <td>{result[5]}</td>
            </tr>
        )
    }

    return (
        <>
            <table className={classes.table}>
                <tr>
                    <th>Phrases</th>
                    {headers}
                </tr>
                {rows}
            </table>
        </>
    )
};

export default ResultsTable;