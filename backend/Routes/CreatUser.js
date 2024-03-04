const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

const axios = require("axios");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const jwtSecret = "MynameisUtkarshGaneshTipre!$*&^%";

router.post(
  "/creatuser",
  [
    body("email").isEmail(),
    //password must be at least 5 chars long
    body("name").isLength({ min: 5 }),
    body("password", "Incorrect Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // console.log(
    //   req.body.name,
    //   req.body.password,
    //   req.body.email,
    //   req.body.location
    // );
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt);

    try {
      await User.create({
        //   name: "Utkarsh Tipre",

        //   password: "123456",
        //   email: "utkarsh2002@gmail.com",
        //   location: "Anjangaon",
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
        location: req.body.location,
      }).then;
      res.json({ success: true });
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  }
);

router.post(
  "/loginuser",
  [
    body("email").isEmail(),
    //password must be at least 5 chars long

    body("password", "Incorrect Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let email = req.body.email;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let userData = await User.findOne({ email });
      if (!userData) {
        return res
          .status(400)
          .json({ errors: "Try logging with correct credentials" });
      }

      const pwdCompare = await bcrypt.compare(
        req.body.password,
        userData.password
      );

      if (!pwdCompare) {
        return res
          .status(400)
          .json({ errors: "Try logging with correct credentials" });
      }

      const data = {
        user: {
          id: userData.id,
        },
      };
      const authToken = jwt.sign(data, jwtSecret);
      return res.json({ success: true, authToken: authToken });
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  }
);

// router.post("/getlocation", async (req, res) => {
//   try {
//     let lat = req.body.latlong.lat;
//     let long = req.body.latlong.long;
//     console.log(lat, long);

//     let location = await axios
//       .get(
//         "https://api.opencagedata.com/geocode/v1/json?q=" +
//           lat +
//           "+" +
//           long +
//           "&key=74c89b3be64946ac96d777d08b878d43"
//       )
//       .then((response) => {
//         console.log(response.data.results);
//         let result = response.data.results[0].components;
//         console.log(result);

//         let { village, county, state_district, state, postcode } = result;
//         return String(
//           village +
//             "," +
//             county +
//             "," +
//             state_district +
//             "," +
//             state +
//             "\n" +
//             postcode
//         );
//       });

//     res.json({ location });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.post("/getlocation", async (req, res) => {
  try {
    let lat = req.body.latlong.lat;
    let long = req.body.latlong.long;
    console.log(lat, long);

    let response = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json?q=" +
        lat +
        "+" +
        long +
        "&key=74c89b3be64946ac96d777d08b878d43"
    );

    console.log(response.data); // Log the entire response to see its structure

    let location = response.data.results[0]?.components;

    if (!location) {
      throw new Error("Location not found");
    }

    let { village, county, state_district, state, postcode } = location;

    let formattedLocation = `${village},${county},${state_district},${state}\n${postcode}`;

    res.json({ location: formattedLocation });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
