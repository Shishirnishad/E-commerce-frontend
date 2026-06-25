import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_API_URL || BASE_URL;

function StateMgt() {
    const [stid, setStid] = useState("");
    const [stname, setStname] = useState("");
    const [status] = useState(1);
    const [stlist, setStlist] = useState([]);

    const handleStIdText = (evt) => {
        setStid(evt.target.value);
    };

    const handleStNameText = (evt) => {
        setStname(evt.target.value);
    };

    const handleSaveButton = () => {
        const obj = {
            stid: Number(stid),
            stname: stname,
            status: status
        };

        axios.post("http://localhost:9191/state/save", obj)
            .then((res) => {
                alert("Data Saved");
            })
            .catch((err) => {
                alert(err);
            });
    };

    useEffect(() => {
        axios.get("http://localhost:9191/state/getall")
            .then((res) => {
                const nextStId = res.data.length + 1;
                setStid(nextStId);
            })
            .catch((err) => {
                alert(err);
            });
    }, []);

    const handleShowButton = () => {
        axios.get("http://localhost:9191/state/getall")
            .then((res) => {
                setStlist(res.data);
            })
            .catch((err) => {
                alert(err);
            });
    };

    const handleSearchButton = () => {
        axios.get("http://localhost:9191/state/search/" + stid)
            .then((res) => {
                setStname(res.data.stname);
                setStlist([res.data]);
            })
            .catch((err) => {
                alert(err);
            });
    };

    const handleNewButton = () => {
        axios.get("http://localhost:9191/state/getall")
            .then((res) => {
                const nextStId = res.data.length + 1;
                setStid(nextStId);
                setStname("");
                setStlist([]);
            })
            .catch((err) => {
                alert(err);
            });
    };

    const handleUpdateButton = () => {
        const obj = {
            stid: Number(stid),
            stname: stname,
            status: 1
        };

        axios.put("http://localhost:9191/state/update", obj)
            .then((res) => {
                alert("Data Updated");
                setStname("");
            })
            .catch((err) => {
                alert(err);
            });
    };

    const handleDeleteButton = () => {
        axios.delete("http://localhost:9191/state/delete/" + stid)
            .then((res) => {
                alert("Data Deleted");
                setStname("");
                setStlist([]);
            })
            .catch((err) => {
                alert(err);
            });
    };

    return (
        <div>
            <center>
                <h1>Save State Details Form</h1>

                <table>
                    <tbody>
                        <tr>
                            <td>Enter State Id</td>
                            <td>
                                <input
                                    type="number"
                                    value={stid}
                                    onChange={handleStIdText}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>Enter State Name</td>
                            <td>
                                <input
                                    type="text"
                                    value={stname}
                                    onChange={handleStNameText}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td></td>
                            <td>
                                <button type="button" onClick={handleSaveButton}>
                                    Save
                                </button>

                                <button type="button" onClick={handleShowButton}>
                                    Show
                                </button>

                                <button type="button" onClick={handleSearchButton}>
                                    Search
                                </button>

                                <button type="button" onClick={handleUpdateButton}>
                                    Update
                                </button>

                                <button type="button" onClick={handleNewButton}>
                                    New
                                </button>

                                <button type="button" onClick={handleDeleteButton}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <br />

                <table border="1">
                    <thead>
                        <tr>
                            <th>State Id</th>
                            <th>State Name</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {stlist.map((item, index) => (
                            <tr key={index}>
                                <td>{item.stid}</td>
                                <td>{item.stname}</td>
                                <td>{item.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </center>
        </div>
    );
}

export default StateMgt;