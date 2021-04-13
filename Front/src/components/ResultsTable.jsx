import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles({
    table: {
        margin: "auto",
        border: "1px solid red",
    },
    tr: {
        border: "1px solid red",
    },
    th: {
        border: "1px solid red",
    },
    td: {
        border: "1px solid red",
    },
})

const ResultsTable = ({detailedResults, phrases}) => {
    const classes = useStyle();

    console.log("phrases", phrases)

    let headers = []
    let rows = []
    for (const res in detailedResults) {
        headers.push(<th className={classes.th} >{res}</th>)
    }

    for (let i=0; i < phrases.length; i++ ) {
        let column = []
        column.push(

        )

        rows.push(
            <tr>
                <td className={classes.td} >{phrases[i]}</td>
                {column}
            </tr>
        )
    }

    return (
        <>
            <table className={classes.table} >
                <tr className={classes.tr} >
                    <th className={classes.th} >Phrases</th>
                    {headers}
                </tr>
                {rows}
            </table>
        </>
    )
};

export default ResultsTable;