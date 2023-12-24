import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
export default function Signup() {
  const [credentials, setcredentials] = useState({
    name: "",
    email: "",
    password: "",
    geolocation: "",
  });
  let [address, setAddress] = useState("");
  let navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    let navLocation = () => {
      return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
      });
    };
    let latlong = await navLocation().then((res) => {
      let latitude = res.coords.latitude;
      let longitude = res.coords.longitude;
      return [latitude, longitude];
    });
    // console.log(latlong)
    let [lat, long] = latlong;
    console.log(lat, long);
    const response = await fetch("http://localhost:4000/api/getlocation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ latlong: { lat, long } }),
    });
    const { location } = await response.json();
    console.log(location);
    setAddress(location);
    setcredentials({ ...credentials, [e.target.name]: location });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(
    //   JSON.stringify({
    //     name: credentials.name,
    //     email: credentials.email,
    //     password: credentials.password,
    //     location: credentials.geolocation,
    //   })
    // );
    const response = await fetch("http://localhost:4000/api/creatuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        location: credentials.geolocation,
      }),
    });

    const json = await response.json();
    console.log(json);

    // if (!json.success) {
    //   alert("Enter Valid Credentials");
    // }

    if (json.success) {
      localStorage.setItem("token", json.authToken);
      navigate("/login");
    } else {
      alert("Enter Valid Credentials");
    }
  };

  const onChange = (event) => {
    setcredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  return (
    <div
      style={{
        backgroundImage:
          'url("https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
        backgroundSize: "cover",
        height: "100vh",
      }}
    >
      <div>
        <Navbar />
      </div>
      <div
        className="container"
        // style={{
        //   display: "flex",
        //   alignItems: "center",
        //   backgroundColor: "#222",
        //   height: "100vh",
        //   // width: "100vh",
        //   justifyContent: "center",
        // }}
      >
        <form
          className="w-50 m-auto mt-4 border border-White rounded p-4"
          onSubmit={handleSubmit}
          // style={{ height: "80%" }}
          style={{ height: "100%", backgroundColor: "#222" }}
        >
          <div className="mb-3">
            <label
              htmlFor="name"
              className="form-label"
              style={{ color: "white", fontSize: "18px", marginBottom: "8px" }}
            >
              Name :
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Write name here"
              value={credentials.name}
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="exampleInputEmail1"
              className="form-label"
              style={{ color: "white", fontSize: "18px", marginBottom: "8px" }}
            >
              Email address :
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Write Email here"
              value={credentials.email}
              onChange={onChange}
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
            <div
              id="emailHelp"
              className="form-text"
              style={{ color: "yellow" }}
            >
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label
              htmlFor="exampleInputPassword1"
              className="form-label"
              style={{ color: "white", fontSize: "18px", marginBottom: "8px" }}
            >
              Password :
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={credentials.password}
              onChange={onChange}
              id="exampleInputPassword1"
            />
            <div
              id="emailHelp"
              className="form-text"
              style={{ color: "yellow" }}
            >
              Contains character and 1 uppercase Letter
            </div>
          </div>
          <div className="mb-3">
            <label
              htmlFor="exampleInputPassword1"
              className="form-label"
              style={{ color: "white", fontSize: "18px", marginBottom: "8px" }}
            >
              Address :
            </label>
            {/* <input
              type="text"
              className="form-control"
              name="geolocation"
              value={credentials.geolocation}
              onChange={onChange}
              id="exampleInputPassword1"
            /> */}

            <fieldset>
              <input
                type="text"
                className="form-control"
                name="address"
                placeholder="Click below for fetching address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                aria-describedby="emailHelp"
              />
            </fieldset>
          </div>
          <div className="m-3">
            <button
              type="button"
              onClick={handleClick}
              name="geolocation"
              className=" btn btn-success"
            >
              Click for current Location{" "}
            </button>
          </div>

          <button type="submit" className=" m-3 btn btn-primary">
            Submit
          </button>
          <Link to="/login" className="m-3 btn btn-danger">
            {" "}
            Already a User
          </Link>
        </form>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
