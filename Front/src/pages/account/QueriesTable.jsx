import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { decodeToken } from "react-jwt";
import axios from "axios";
import Routing from "../../Routing";
import Alert from '@material-ui/lab/Alert';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Button from '@material-ui/core/Button';
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles({
    deleteCell: {
        textAlign: "center",
    },
    delete: {
        color: "red",
        fontSize: 30,
    },
    alert: {
        width: 800,
        margin: "auto",
        marginBottom: 20,
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


const deleteQuery = (deleteId, setAlert) => {
    let url = `${Routing.baseUrl}/delete/${deleteId}`
    let config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    };

    axios.delete(url, config)
    .then((resp) => {
        sessionStorage.setItem("alert_severity", "success")
        sessionStorage.setItem("alert", "Suppression réussie")
        // HACK Force te reload because the state change is not alwais detected
        document.location.reload();
    })
    .catch((error) => {
        console.error(error)
        setAlert(["error", "Echec de la suppression"])
    })
}


const QueriesTable = (props) => {
    const classes = useStyle();
    const history = useHistory();
    const [alert, setAlert] = useState([]);
    const [queries, setQueries] = useState();
    const userName = decodeToken(localStorage.getItem('access_token'))?.sub.username;

    useEffect(() => {
        fetchQueries(setQueries)
    }, [])

    useEffect(() => {
        const passedAlertSeverity = sessionStorage.getItem("alert_severity")
        const passedAlert = sessionStorage.getItem("alert")
        if (passedAlertSeverity && passedAlert) {
            setAlert([passedAlertSeverity, passedAlert])
            sessionStorage.removeItem("alert")
            sessionStorage.removeItem("alert_severity")
        }
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

    const handleDelete = (event) => {
        // BUG Parfois undefined !! POURQUOI ??
        let deleteId = event.target.attributes.delete_id?.value
        deleteQuery(deleteId, setAlert)
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
                <TableCell className={classes.deleteCell}>
                    <Button variant="contained" onClick={handleDelete} delete_id={queries[idx]["id"]} >
                        <DeleteForeverIcon className={classes.delete} delete_id={queries[idx]["id"]} />
                    </Button>
                </TableCell>
            </TableRow>
        )
    }

    return (
        <>
            {
                alert.length > 0 && <>
                <Alert severity={alert[0]} className={classes.alert} >
                    {alert[1]}
                </Alert>
                </>
            }
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