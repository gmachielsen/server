const User = require("../models/user");
const jwt = require("jsonwebtoken");



exports.register = async (req, res) => {
  const { email } = req.body;
  console.log(email, "emaaaail??", "req.body????", req.body);
  const ifUserExist = await User.findOne({ email }).exec();
  if (ifUserExist) {
    return res.status(400).send("User already exist");
  } else {
    const newUser = await new User({
      email,
      name: email.split("@")[0],
    }).save();

    // login user 
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // return user and token to client, exclude hashed password
    // send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true, // only works on https
    });
    console.log("USER CREATED", newUser);
    res.json(newUser);
  }
}

exports.createOrUpdateUser = async (req, res) => {
    const { name, email } = req.user;

    const user = await User.findOneAndUpdate(
      { email },
      { name: email.split("@")[0] },
      { new: true }
    );
    if (user) {
      console.log("USER UPDATED", user);
      res.json(user);
    } else {
      const newUser = await new User({
        email,
        name: email.split("@")[0],
      }).save();
      console.log("USER CREATED", newUser);
      res.json(newUser);
    }
}

// exports.login = async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email }).exec();
//     if (!user) return res.status(400).send("No user found");
    
//     // create signed jwt
//     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: "7d",
//       });
// }

exports.login = async (req, res) => {


  // console.log(req, "req, req????");
  try {
    let firebaseToken = req.headers["authtoken"];
    console.log(firebaseToken, "TOkenetoktokene???");
    const { user } = req.body;
    console.log(user.email, "email??????");
    const email = user.email;
    // check if our db has user with that email
    const userResult = await User.findOne({ email }).exec();
    if (!userResult) return res.status(400).send("No user found");
    // create signed jwt
  
    const token = jwt.sign({ _id: userResult._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // return user and token to client, exclude hashed password
    // send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true, // only works on https
    });
    // console.log(req.cookie.token, "req coooookie tooooken");
    // send user as json response
    res.json(userResult);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};


exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Signout success" });
  } catch (err) {
    console.log(err);
  }
}

exports.currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec();
    console.log("CURRENT_USER", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};