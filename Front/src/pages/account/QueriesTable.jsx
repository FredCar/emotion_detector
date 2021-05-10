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
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles({
    deleteCell: {
        textAlign: "center",
    },
    delete: {
        color: "red",
        fontSize: 30,

    },
})


const fetchQueries = (setQueries) => {
    let url = `${Routing.baseUrl}/account`
    let config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    };

    axios.get(url, config)
    .then(({data}) => {
        setQueries(data.queries)
    })
    .catch((error) => {
        console.error(error)
    })
}


const fetchResults = (queryId, query, history) => {
    let url = `${Routing.baseUrl}/detail/${queryId}`
    let config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    };

    axios.get(url, config)
    .then(({data}) => {
        const payload = {
            "url": query.url,
            "title": query.title,
            "best_result": query.emotion,
            "detailed_results": data.detailed_result,
            "phrases": data.phrases,
            "sents": [],
        }
    
        // TODO Load good data
        sessionStorage.setItem("data", JSON.stringify(payload))
        sessionStorage.setItem("from", "url")
    
        history.push('result')
    })
    .catch((error) => {
        console.error(error)
    })
}


const QueriesTable = (props) => {
    const styles = useStyle();
    const history = useHistory();
    const [queries, setQueries] = useState();
    const userName = decodeToken(localStorage.getItem('access_token'))?.sub.username;

    useEffect(() => {
        fetchQueries(setQueries)
    }, [])

    const handleClick = (event) => {  
        let queryId = event.target.attributes.query_id.value
        for (const idx in queries) {
            if (queries[idx].id == queryId) {
                const query = queries[idx]
                fetchResults(queryId, query, history)
            }
        }
    }

    let rows = []
    for (const idx in queries) {
        rows.push(
            <TableRow>
                <TableCell><a onClick={handleClick} query_id={queries[idx]["id"]} >{queries[idx]["title"]}</a></TableCell>
                <TableCell><a href={queries[idx]["url"]} target="_blank" rel="noreferrer" >{queries[idx]["url"]}</a></TableCell>
                <TableCell>{queries[idx]["emotion"]}</TableCell>
                {/* TODO Format date */}
                <TableCell>{queries[idx]["date"]}</TableCell>
                <TableCell className={styles.deleteCell}><DeleteForeverIcon className={styles.delete} /></TableCell>
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
                            <TableCell>Supprimer</TableCell>
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