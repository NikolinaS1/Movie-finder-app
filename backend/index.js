const mongoose = require("mongoose");
require("dotenv").config();

const connectToMongo = async () => {
  console.log(process.env.MONGO_URI);
  mongoose.connect(
    "mongodb+srv://user1:uYdEYzyk4n3xcZA2@cluster0.w6j6g53.mongodb.net/?retryWrites=true&w=majority",
    await console.log("Connected to mongo Successful")
  );
};

connectToMongo();

// Schema for users of app
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: false,
  },
  favorites: {
    type: String,
    required: false,
  },
});
const User = mongoose.model("users", UserSchema);
User.createIndexes();

// For backend and express
const express = require("express");
const app = express();
const cors = require("cors");
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());
const bcrypt = require("bcrypt");
app.get("/", (req, resp) => {
  resp.send("App is Working");
});

app.post("/register", async (req, resp) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return resp.status(409).send("User with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    let result = await user.save();
    result = result.toObject();
    if (result) {
      delete result.password;
      console.log(result);
      resp.status(200).json({ message: "Registration successful" });
    } else {
      console.log("User already registered");
      resp.status(500).send("User registration failed");
    }
  } catch (e) {
    resp.status(500).send("Something Went Wrong");
  }
});

var rand = function () {
  return Math.random().toString(36).substr(2); // remove `0.`
};

function generateToken() {
  return rand() + rand(); // to make it longer
}

app.post("/favorite", async (req, resp) => {
  const token = req.header("token");

  if (!token) {
    return resp.status(403).json({ error: "Token not provided" });
  }

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return resp.status(404).json({ error: "User not found" });
    }

    const favoriteId = req.body.favoriteId;

    let favoritesArray = [];

    if (user.favorites) {
      favoritesArray = user.favorites.split(",");
    }

    if (!favoritesArray.includes(favoriteId.toString())) {
      favoritesArray.push(favoriteId);
      user.favorites = favoritesArray.join(",");
      await user.save();
      resp.status(200).json({ message: "Favorite added successfully" });
    } else {
      favoritesArray = favoritesArray.filter((id) => id != favoriteId);
      user.favorites = favoritesArray.join(",");
      await user.save();
      resp.status(200).json({ message: "Movie removed from favorites" });
    }
  } catch (error) {
    console.error("Error adding favorite:", error);
    resp.status(500).json({ error: "Error adding favorite" });
  }
});

app.post("/login", async (req, resp) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // Compare the provided password with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (passwordMatch) {
        // Password is correct, generate token and send user data
        const token = generateToken();
        const result = {
          token: token,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          favorites: user.favorites,
        };

        await User.updateOne({ email: req.body.email }, { token: token });

        resp.send(result);
      } else {
        // Password is incorrect
        resp.status(401).send("Wrong email or password");
      }
    } else {
      // User doesn't exist
      resp.status(404).send("User doesn't exist in database.");
    }
  } catch (e) {
    resp.status(500).send("Something Went Wrong");
  }
});

app.listen(5000);

// Move the route definition here, after app.listen(5000)
app.get("/api/get-user-by-token", async (req, res) => {
  try {
    const token = req.header("token");

    if (!token) {
      return res.status(403).json({ error: "Token not provided" });
    }

    const user = await User.findOne({ token: token }, { _id: 0, __v: 0 });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Error fetching user data" });
  }
});
