import React, { useEffect, useState } from "react";
import axios from "axios";
function CityMgt() {
    const [ctid, setCtId] = useState("");
    const [ctname, setCtName] = useState("");
    const [stid, setStId] = useState("");
    const [status, setStatus] = useState("");
    const [ctlist, setCtList] = useState([]);
    const [stlist, setStList] = useState([]);

    const BASE_URL = "http://localhost:9191";

    useEffect(() => {
        axios.get(BASE_URL + "/state/show")
            .then((res) => {
                setStList(res.data);
            })
            .catch((err) => {
                alert(err);
            });
    }, []);

    const getNextId = () => {
        axios.get(BASE_URL + "/city/getall")
            .then((res) => {
                setCtId(res.data.length + 1);
                setStatus(1);
            })
            .catch((err) => {
                alert(err);
            });
    };

    const handleCtIdText = (evt) => {
        setCtId(evt.target.value);
    };

    const handleCtNameText = (evt) => {
        setCtName(evt.target.value);
    };

    const handleStIdSelect = (evt) => {
        setStId(evt.target.value);
    };

    const handleStatusText = (evt) => {
        setStatus(evt.target.value);
    };

    const handleNewButton = () => {
        setCtName("");
        setStId("");
        setStatus(1);
        setCtList([]);
        getNextId();
    };

    const handleSaveButton = () => {
        if (
            ctid === "" ||
            ctname === "" ||
            stid === "" ||
            stid === "0" ||
            status === ""
        ) {
            alert("Please Fill all fields");
            return;
        }

        axios.get(BASE_URL + "/city/searchbyname/" + ctname)
            .then((res) => {

                if (res.data.ctname !== undefined) {
                    alert("City Name already Exist");
                }
                else {

                    const obj = {
                        ctid,
                        ctname,
                        stid,
                        status
                    };

                    axios.post(BASE_URL + "/city/save/", obj)
                        .then((res) => {
                            alert(res.data);

                            setCtId("");
                            setCtName("");
                            setStId("");
                            setStatus("");
                        })
                        .catch((err) => {
                            alert(err);
                        });
                }
            })
            .catch((err) => {
                alert(err);
            });
    };

    const handleShowButton = () => {
        axios.get(BASE_URL + "/city/getall")
            .then((res) => {
                setCtList(res.data);
            })
            .catch((err) => {
                alert(err);
            });
    };

    const handleSearchButton = () => {

        if (ctid !== "") {

            axios.get(BASE_URL + "/city/search/" + ctid)
                .then((res) => {

                    if (res.data.stid !== undefined) {
                        setCtId(res.data.ctid);
                        setCtName(res.data.ctname);
                        setStId(res.data.stid);
                        setStatus(res.data.status);
                    }
                    else {
                        alert("Data Not Found");
                    }
                })
                .catch((err) => {
                    alert(err);
                });
        }
        else if (ctname !== "") {

            axios.get(BASE_URL + "/city/searchbyname/" + ctname)
                .then((res) => {

                    if (res.data.stid !== undefined) {
                        setCtId(res.data.ctid);
                        setCtName(res.data.ctname);
                        setStId(res.data.stid);
                        setStatus(res.data.status);
                    }
                    else {
                        alert("Data Not Found");
                    }
                })
                .catch((err) => {
                    alert(err);
                });
        }
    };

    const handleUpdateButton = () => {

        const obj = {
            ctid,
            ctname,
            stid,
            status
        };

        axios.put(BASE_URL + "/city/update/", obj)
            .then((res) => {
                alert(res.data);
            })
            .catch((err) => {
                alert(err);
            });
    };

    const handleDeleteButton = () => {

        if (ctid !== "") {

            axios.delete(BASE_URL + "/city/delete/" + ctid)
                .then((res) => {
                    alert(res.data);

                    setCtId("");
                    setCtName("");
                    setStId("");
                    setStatus("");
                    setCtList([]);
                })
                .catch((err) => {
                    alert(err);
                });
        }
        else {
            alert("Fill City Id to Delete");
        }
    };

    return (
        <div>
            <center>

                <h1>City Management</h1>

                <table>
                    <tbody>

                        <tr>
                            <td>City Id</td>
                            <td>
                                <input
                                    type="number"
                                    value={ctid}
                                    onChange={handleCtIdText}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>City Name</td>
                            <td>
                                <input
                                    type="text"
                                    value={ctname}
                                    onChange={handleCtNameText}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>State Name</td>
                            <td>
                                <select
                                    value={stid}
                                    onChange={handleStIdSelect}
                                >
                                    <option value="0">
                                        Select State
                                    </option>

                                    {
                                        stlist.map((item, index) => (
                                            <option
                                                key={index}
                                                value={item.stid}
                                            >
                                                {item.stname}
                                            </option>
                                        ))
                                    }
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <td>Status</td>
                            <td>
                                <input
                                    type="text"
                                    value={status}
                                    onChange={handleStatusText}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td></td>
                            <td>
                                <button onClick={handleNewButton}>
                                    New
                                </button>

                                <button onClick={handleSaveButton}>
                                    Save
                                </button>

                                <button onClick={handleShowButton}>
                                    Show
                                </button>

                                <button onClick={handleSearchButton}>
                                    Search
                                </button>

                                <button onClick={handleUpdateButton}>
                                    Update
                                </button>

                                <button onClick={handleDeleteButton}>
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
                            <th>City Id</th>
                            <th>City Name</th>
                            <th>State Name</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        {
                            ctlist.map((item, index) => {

                                const stateObj = stlist.find(
                                    (s) => s.stid === item.stid
                                );

                                return (
                                    <tr key={index}>
                                        <td>{item.ctid}</td>
                                        <td>{item.ctname}</td>

                                        <td>
                                            {stateObj
                                                ? stateObj.stname
                                                : ""}
                                        </td>

                                        <td>
                                            {item.status === 1
                                                ? "Enabled"
                                                : "Disabled"}
                                        </td>
                                    </tr>
                                );
                            })
                        }

                    </tbody>
                </table>

            </center>
        </div>
    );
}

export default CityMgt;