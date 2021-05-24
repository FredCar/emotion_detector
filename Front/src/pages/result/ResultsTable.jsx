import React from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const ResultsTable = ({detailedResults, phrases, sents}) => {
    let headers = []
    for (const res in detailedResults[Object.keys(detailedResults)[0]]) {
        headers.push(<TableCell>{res}</TableCell>)
    }
    
    let rows = []
    for (let i = 0; i < phrases.length; i++ ) {
        let column = []
        for (const emotion in detailedResults[phrases[i]]) {
            column.push(
                <TableCell>{detailedResults[phrases[i]][emotion]}</TableCell>
            )
        }

        rows.push(
            <TableRow>
                <TableCell ><strong>{phrases[i]}</strong></TableCell>
                {column}
            </TableRow>
        )
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Phrases</TableCell>
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