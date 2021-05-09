import React from "react";
import { decodeToken } from "react-jwt";
import QueriesTable from "./QueriesTable";

const Account = (props) => {
    const userName = decodeToken(localStorage.getItem('access_token'))?.sub.username;
    
    return (
        <>
            <h3>Historique des requêtes de {userName}</h3>
            <QueriesTable />
        </>
    )
};

export default Account;