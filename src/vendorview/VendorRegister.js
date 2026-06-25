import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VendorRegister.css";
import AdBackground from "../common/AdBackground";

function VendorRegister() {

  const [vuserid, setVUserId] = useState("");
  const [vuserpass, setVUserPass] = useState("");
  const [vrepass, setVRePass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showRePass, setShowRePass] = useState(false);

  const [vendername, setVenderName] = useState("");
  const [vaddress, setVAddress] = useState("");
  const [vcontact, setVContact] = useState("");
  const [vemail, setVEmail] = useState("");
  const [vpicname, setVPicName] = useState("");
  const [vid, setVid] = useState("");

  const [image, setImage] = useState({ preview: "", data: null });
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [vendorList, setVendorList] = useState([]);

  const REACT_APP_BASE_API_URL = process.env.REACT_APP_BASE_API_URL || "http://localhost:9191";

  useEffect(() => {
    fetchVendorList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchVendorList = async () => {
    try {
      const res = await axios.get(`${REACT_APP_BASE_API_URL}/vendor/getvendorcount/`);
      setVendorList(res.data || []);
      setVid((res.data && res.data.length ? res.data.length + 1 : 1));
    } catch (err) {
      console.error(err);
    }
  };

  const validateForm = () => {
    let temp = {};
    let valid = true;

    if (!vuserid || vuserid.length < 4) {
      temp.vuserid = "User ID must be at least 4 characters";
      valid = false;
    } else if (vendorList.some((v) => v.VUserId === vuserid)) {
      temp.vuserid = "User ID already exists";
      valid = false;
    }

    if (!vuserpass || vuserpass.length < 6) {
      temp.vuserpass = "Password must be at least 6 characters";
      valid = false;
    }

    if (vrepass !== vuserpass) {
      temp.vrepass = "Passwords do not match";
      valid = false;
    }

    if (!vendername || !/^[A-Za-z ]+$/.test(vendername)) {
      temp.vendername = "Vendor name must contain only letters";
      valid = false;
    }

    if (!vaddress) {
      temp.vaddress = "Address is required";
      valid = false;
    }

    if (!/^\d{10}$/.test(vcontact)) {
      temp.vcontact = "Contact must be 10 digits";
      valid = false;
    }

    if (!/\S+@\S+\.\S+/.test(vemail)) {
      temp.vemail = "Enter a valid email address";
      valid = false;
    } else if (vendorList.some((v) => v.VEmail === vemail)) {
      temp.vemail = "Email already exists";
      valid = false;
    }

    if (!image.data) {
      temp.vpicname = "Please upload a profile photo";
      valid = false;
    }

    setErrors(temp);
    return valid;
  };

  const handleRegisterButton = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const vendorObj = {
        VUserId: vuserid,
        VUserPass: vuserpass,
        VenderName: vendername,
        VAddress: vaddress,
        VContact: vcontact,
        VEmail: vemail,
        VPicName: "",
        Vid: vid,
        Status: "Inactive",
      };

      await axios.post(`${REACT_APP_BASE_API_URL}/vendor/register/`, vendorObj);

      // upload image if present
      if (image.data) {
        const formData = new FormData();
        formData.append("file", image.data);
        formData.append("VenderName", vendername);
        formData.append("VAddress", vaddress);
        formData.append("VContact", vcontact);
        formData.append("VEmail", vemail);

        const uploadRes = await axios.put(`${REACT_APP_BASE_API_URL}/vendor/update/${vuserid}`, formData);

        if (uploadRes?.data?.updatedData?.VPicName) {
          setVPicName(uploadRes.data.updatedData.VPicName);
        }
      }

      setStatus("Registration and image upload successful");
      alert("Vendor Registered Successfully!");

      // reset form
      setVUserId("");
      setVUserPass("");
      setVRePass("");
      setVenderName("");
      setVAddress("");
      setVContact("");
      setVEmail("");
      setImage({ preview: "", data: null });
      fetchVendorList();
    } catch (err) {
      console.error(err);
      const serverMsg = err?.response?.data || err.message;
      alert("Error registering vendor or uploading image: " + serverMsg);
    }
  };

  const handleFileChange = (evt) => {
    const file = evt.target.files && evt.target.files[0];
    if (file) {
      setImage({ preview: URL.createObjectURL(file), data: file });
    }
  };

  return (
    <div className="vendorreg-container">
      <AdBackground />
      <div className="venderreg-form">
        <h2>Vendor Registration</h2>
        <p className="status">{status}</p>

        <form onSubmit={handleRegisterButton}>
          <div className="form-group">
            <label>Vendor ID</label>
            <span className="readonly">{vid}</span>
          </div>

          <div className="form-group">
            <label>User Id</label>
            <input type="text" value={vuserid} onChange={(e) => setVUserId(e.target.value)} />
            <div className="error">{errors.vuserid}</div>
          </div>

          <div className="form-group password-field">
            <label>Enter Password</label>
            <div className="input-with-icon">
              <input type={showPass ? "text" : "password"} value={vuserpass} onChange={(e) => setVUserPass(e.target.value)} />
              <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>{showPass ? 'Hide' : 'Show'}</button>
            </div>
            <div className="error">{errors.vuserpass}</div>
          </div>

          <div className="form-group password-field">
            <label>Re-enter Password</label>
            <div className="input-with-icon">
              <input type={showRePass ? "text" : "password"} value={vrepass} onChange={(e) => setVRePass(e.target.value)} />
              <button type="button" className="eye-btn" onClick={() => setShowRePass(!showRePass)}>{showRePass ? 'Hide' : 'Show'}</button>
            </div>
            <div className="error">{errors.vrepass}</div>
          </div>

          <div className="form-group">
            <label>Vendor Name</label>
            <input type="text" value={vendername} onChange={(e) => setVenderName(e.target.value)} />
            <div className="error">{errors.vendername}</div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input type="text" value={vaddress} onChange={(e) => setVAddress(e.target.value)} />
            <div className="error">{errors.vaddress}</div>
          </div>

          <div className="form-group">
            <label>Contact</label>
            <input type="text" value={vcontact} onChange={(e) => setVContact(e.target.value)} />
            <div className="error">{errors.vcontact}</div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={vemail} onChange={(e) => setVEmail(e.target.value)} />
            <div className="error">{errors.vemail}</div>
          </div>

          <div className="form-group">
            <label>Upload Photo</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {image.preview && <img src={image.preview} alt="preview" className="preview" />}
            <div className="error">{errors.vpicname}</div>
          </div>

          <div className="form-group">
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VendorRegister;