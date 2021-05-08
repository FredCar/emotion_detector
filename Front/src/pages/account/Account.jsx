import React, { useEffect, useState } from "react";
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


const AccountTable = ({data}) => {
    let rows = []
    for (const query in data?.queries) {
        console.log(">>>>> : ", data.queries[query])
        rows.push(
            <TableRow>
                <TableCell>{data.queries[query]["title"]}</TableCell>
                <TableCell>{data.queries[query]["url"]}</TableCell>
                <TableCell>{data.queries[query]["emotion"]}</TableCell>
                <TableCell>{data.queries[query]["date"]}</TableCell>
            </TableRow>
        )
    }

    return (
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
    )
}


const Account = (props) => {
    const [data, setData] = useState();

    useEffect(() => {
        fetchData(setData)
    }, [])

    console.log("<<<<>>>>", data)
    
    return (
        <>
            <h1>Account</h1>
            <AccountTable data={data} />
        </>
    )
};

export default Account;