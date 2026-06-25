import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_API_URL || "http://localhost:9191";

function ProductMgt() {
    const [pcatgid, setPcatgid] = useState("");
    const [pcatgname, setPcatgname] = useState("");
    const [plist, setPlist] = useState([]);

    const getNextId = () => {
        axios.get(BASE_URL + "/productcatg/showproductcatg")
            .then((res) => {
                const data = res.data;

                if (data.length > 0) {
                    const maxId = Math.max(
                        ...data.map(item => Number(item.pcatgid))
                    );
                    setPcatgid(maxId + 1);
                } else {
                    setPcatgid(1);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getNextId();
    }, []);

    const handlePcatgIdText = (evt) => {
        setPcatgid(evt.target.value);
    };

    const handlePcatgNameText = (evt) => {
        setPcatgname(evt.target.value);
    };

    const handleSaveButton = () => {
        axios.post(
            BASE_URL + "/productcatg/addproductcatg/" +
            pcatgid +
            "/" +
            pcatgname
        )
        .then((res) => {
            alert("Product Category Saved Successfully");
            setPcatgname("");
            getNextId();
        })
        .catch((err) => {
            alert(err);
        });
    };

    const handleShowButton = () => {
        axios.get(BASE_URL + "/productcatg/showproductcatg")
            .then((res) => {
                setPlist(res.data);
            })
            .catch((err) => {
                alert(err);
            });
    };

    const handleSearchButton = () => {
        axios.get(BASE_URL + "/productcatg/showproductcatg")
            .then((res) => {
                const data = res.data.filter(
                    item => Number(item.pcatgid) === Number(pcatgid)
                );

                if (data.length > 0) {
                    setPcatgname(data[0].pcatgname);
                    setPlist(data);
                } else {
                    alert("Record Not Found");
                }
            })
            .catch((err) => {
                alert(err);
            });
    };

    const handleUpdateButton = () => {
        axios.put(
            BASE_URL + "/productcatg/updateproductcatg/" +
            pcatgid +
            "/" +
            pcatgname
        )
        .then((res) => {
            alert(res.data);
        })
        .catch((err) => {
            alert(err);
        });
    };

    const handleDeleteButton = () => {
        axios.put(
            BASE_URL + "/productcatg/deleteproductcatg/" +
            pcatgid
        )
        .then((res) => {
            alert(res.data);
            setPcatgname("");
            setPlist([]);
            getNextId();
        })
        .catch((err) => {
            alert(err);
        });
    };

    const handleNewButton = () => {
        setPcatgname("");
        setPlist([]);
        getNextId();
    };

    return (
        <div>
            <center>
                <h1>Product Category Management</h1>

                <table>
                    <tbody>
                        <tr>
                            <td>Product Category ID</td>
                            <td>
                                <input
                                    type="number"
                                    value={pcatgid}
                                    onChange={handlePcatgIdText}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>Product Category Name</td>
                            <td>
                                <input
                                    type="text"
                                    value={pcatgname}
                                    onChange={handlePcatgNameText}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td></td>
                            <td>
                                <button onClick={handleSaveButton}>Save</button>
                                <button onClick={handleShowButton}>Show</button>
                                <button onClick={handleSearchButton}>Search</button>
                                <button onClick={handleUpdateButton}>Update</button>
                                <button onClick={handleNewButton}>New</button>
                                <button onClick={handleDeleteButton}>Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <br />

                <table border="1">
                    <thead>
                        <tr>
                            <th>Category ID</th>
                            <th>Category Name</th>
                        </tr>
                    </thead>

                    <tbody>
                        {plist.map((item, index) => (
                            <tr key={index}>
                                <td>{item.pcatgid}</td>
                                <td>{item.pcatgname}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </center>
        </div>
    );
}

export default ProductMgt;