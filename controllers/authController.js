const catchAsyncError = require("../middlewares/catchAsyncErrors");
const UserSchema = require("../models/userSchema");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Inside signup: ", email, password);
  const user = new UserSchema({
    email: email,
    password: bcrypt.hashSync(req.body.password, 8),
  });
  await user.save(function (error, user) {
    if (error) {
      console.log(error);
      res.status(400).json({
        success: false,
        message: "Sign up failed",
      });
      return;
    }
    res.status(200).json({
      success: true,
      user: user,
    });
  });
};

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);

  //check if email and password is entered
  if (!email || !password) {
    res.status(401).json({
      success: false,
      message: "Please enter email and password",
    });
    return;
  }

  // const user = "rupakchauhan@gmail.com";
  // const userPassword = "rupak@12345";
  let user;
  try {
    user = await UserSchema.findOne({ email: email });
  } catch (error) {
    res.status(400).send("user not found");
    return;
  }

  if(!user){
    res.status(401).json({
      success: false,
      message: "user not found",
    });
    return;
  }
  if (email !== user.email) {
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
    return;
  }

  var passwordIsValid = bcrypt.compareSync(
    password,
    user.password
);
  if (!passwordIsValid) {
    res.status(401).json({
      success: false,
      message: "Invalid password",
    });
    return;
  }

  var token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: 86100,
  });

  res.status(200).json({
    success: true,
    message: "Login successfull",
    user: user,
    token,
  });
});
