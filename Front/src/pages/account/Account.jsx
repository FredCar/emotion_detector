import React from "react";
import axios from "axios";
import Routing from "../../Routing";

const fetchData = () => {
    let url = `${Routing.baseUrl}/account`
    let config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    };

    axios.get(url, config)
    .then((data) => {
        console.log("DATA", data)
    })
    .catch((error) => {
        console.error(error)
    })
}

const Account = (props) => {
    return (
        <h1>Account</h1>
    )
};

export default Account;