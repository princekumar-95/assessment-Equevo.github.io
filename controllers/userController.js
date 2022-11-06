const User = require("../models/user");
const Todo = require("../models/todo");
// const TOKEN_KEY = "safaid";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
module.exports.register = async (req, res) => {
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
};

module.exports.login = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email: email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(user.toJSON(), "TODO_API", {
        expiresIn: "30m",
      });
      user.token = token;
      user.save();
      return res.status(200).json({
        data: {
          user,
        },
      });
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
};

module.exports.welcome = (req, res) => {
  res.status(200).send("welcome dear user ");
};

module.exports.CreateTodo = async (req, res) => {
  Todo.create(
    {
      title: req.body.title,
      date: req.body.date,
    },
    function (err, newTodo) {
      if (err) {
        res.status(402).send("error is creating a todo ", err);
        return;
      }
      res.status(201).json({
        data: newTodo,
      });
    }
  );
};

module.exports.GetAllTodo = async (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
  const page = req.query.page ? parseInt(req.query.page) : 0;

  Todo.find({}, function (err, todo) {
    if (err) {
      res.status(401).json({
        message: "Error in Finding todo list ",
      });
    }
    res.status(200).json({
      todoList: todo,
    });
  })
    .limit(pageSize)
    .skip(pageSize * page);
};

module.exports.GetTodoByDate = async (req, res) => {
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;

  const filter_stage = {
    $match: {
      date: {
        $gte: fromDate,
        $lte: toDate,
      },
    },
  };

  const pipeline = [filter_stage];
  const history_events_with_aggregate = await User.aggregate(pipeline);

  res.status(200).json({
    data: history_events_with_aggregate,
  });
};

module.exports.GetTodoById = async (req, res) => {
  const id = req.params.id;

  Todo.findById(id, function (err, todoById) {
    if (err) {
      res.status(401).json({
        message: "Error in Finding Todo By Id ",
      });
    }

    res.status(200).json({
      todoListById: todoById,
    });
  });
};
module.exports.UpdateTodo = async (req, res) => {
  Todo.findByIdAndUpdate(
    { _id: req.params.id },

    {
      title: req.body.title,
      date: req.body.date,
    },
    { new: true },
    function (err, newTodo) {
      if (err) {
        console.log("error is creating a todo ", err);
        return;
      }
      res.status(200).json({
        updatedData: newTodo,
      });
    }
  );
};

module.exports.DeleteTodo = async (req, res) => {
  const id = req.params.id;

  Todo.findByIdAndDelete(id, (err) => {
    if (err) {
      res.status(401).json({
        message: "Error in Delete Todo ",
      });
    }
    res.status(200).json({
      message: "Successfully Delete ",
    });
  });
};
