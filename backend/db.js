// const mongoose = require("mongoose");
// const mongoURI =
//   "mongodb+srv://gofood:Utkarsh2002@cluster0.o1mzgc4.mongodb.net/gofoodmern?retryWrites=true&w=majority";

// const mongoDB = async () => {
//   await mongoose.connect(
//     mongoURI,
//     { useNewUrlParser: true },
//     async (err, result) => {
//       if (err) console.log("...", err);
//       else {
//         console.log("connected successfull");
//         const fetched_data = await mongoose.connection.db.collection(
//           "food_items"
//         );
//         fetched_data.find({}).toArray(function (err, data) {
//           if (err) console.log(err);
//           else console.log(data);
//         });
//       }
//     }
//   );
// };

// module.exports = mongoDB;

const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://gofood:Utkarsh2002@cluster0.o1mzgc4.mongodb.net/gofoodmern?retryWrites=true&w=majority";

const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    });
    console.log("Connected successfully to MongoDB");

    const fetched_data = await mongoose.connection.db.collection("food_items"); //1
    // fetched_data.find({}).toArray(function (err, data) {
    //   if (err) console.log(err);
    //   else console.log(data);
    // });

    const data = await fetched_data.find({}).toArray(); //2
    // console.log(data);
    console.log();

    const foodCategory = await mongoose.connection.db.collection(
      //1
      "foodCategory"
    );
    // foodCategory.find({}).toArray(function (err, catData) {
    //   if (err) console.log(err);
    //   else {
    //     global.food_items = data;
    //     global.foodCategory = catData;
    //   }
    // });

    const catData = await foodCategory.find({}).toArray(); //2
    global.foodCategory = catData;

    global.food_items = data;
    // // console.log(global.food_items);
    // console.log();

    // Additional connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });
    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = mongoDB;
