import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyle = makeStyles({
    // table: {
    //     margin: "auto",
    //     border: "1px solid red",
    // },
    // tr: {
    //     border: "1px solid red",
    // },
    // th: {
    //     border: "1px solid red",
    // },
    // td: {
    //     border: "1px solid red",
    // },
})

const ResultsTable = ({detailedResults, phrases, sents}) => {
    const classes = useStyle();

    let headers = []
    for (const res in detailedResults[Object.keys(detailedResults)[0]]) {
        headers.push(<TableCell className={classes.th} >{res}</TableCell>)
    }
    
    let rows = []
    for (let i = 0; i < phrases.length; i++ ) {
        let column = []
        for (const emotion in detailedResults[phrases[i]]) {
            console.log("emotion", emotion)
            column.push(
                <TableCell>{detailedResults[phrases[i]][emotion]}</TableCell>
            )
        }

        rows.push(
            <TableRow>
                <TableCell className={classes.td} ><strong>{phrases[i]}</strong> - - {sents[i]}</TableCell>
                {column}
            </TableRow>
        )
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table className={classes.table} >
                    <TableHead>
                        <TableRow className={classes.tr} >
                            <TableCell className={classes.th} >Phrases</TableCell>
                            {headers}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
};

export default ResultsTable;