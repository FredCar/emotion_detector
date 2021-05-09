import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { decodeToken } from "react-jwt";
import axios from "axios";
import Routing from "../../Routing";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const fetchData = (setData) => {
    let url = `${Routing.baseUrl}/account`
    let config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    };

    axios.get(url, config)
    .then(({data}) => {
        console.log("DATA", data)
        setData(data)
    })
    .catch((error) => {
        console.error(error)
    })
}


const QueriesTable = (props) => {
    const history = useHistory();
    const [data, setData] = useState();
    const userName = decodeToken(localStorage.getItem('access_token'))?.sub.username;

    useEffect(() => {
        fetchData(setData)
    }, [])

    const handleClick = (event) => {
        let payload = {}
        for (const query in data?.queries) {
            if (data?.queries[query].title === event.target.text) {
                payload = {
                    "url": data.queries[query].url,
                    "title": data.queries[query].title,
                    "best_result": data.queries[query].emotion,
                    "detailed_results": {},
                    "phrases": [],
                    "sents": [],
                }

                // TODO Load good data
                sessionStorage.setItem("data", JSON.stringify(payload))
                sessionStorage.setItem("from", "url")

                history.push('result')
            }
        }
    }

    let rows = []
    for (const query in data?.queries) {
        rows.push(
            <TableRow>
                <TableCell><a onClick={handleClick} >{data.queries[query]["title"]}</a></TableCell>
                <TableCell><a href={data.queries[query]["url"]} target="_blank" rel="noreferrer" >{data.queries[query]["url"]}</a></TableCell>
                <TableCell>{data.queries[query]["emotion"]}</TableCell>
                {/* TODO Format date */}
                <TableCell>{data.queries[query]["date"]}</TableCell>
            </TableRow>
        )
    }

    return (
        <>
            <h3>Historique des requêtes de <strong>{userName}</strong></h3>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Titre</TableCell>
                            <TableCell>URL</TableCell>
                            <TableCell>Émotion</TableCell>
                            <TableCell>Date</TableCell>
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


export default QueriesTable;