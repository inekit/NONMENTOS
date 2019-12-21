const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mysql = require("mysql");
const MySQLStore = require("express-mysql-session")(session);
const app = express();
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
var users = [];
var port = 3000;
var webs = http.createServer(function(req, res) {
  console.log("createServer");
});
webs.listen(3000);

var io = require("socket.io").listen(webs);

io.on("connection", function(socket) {
  let rid;
  let lst = "";
  socket.on("Client 2 Server Message", function(message) {
    console.log(message);
    if (rid)
      io.sockets.in("room-" + rid).emit("Server 2 Client Message", message);
  });
  socket.on("todialog", function(message) {
    rid = message;
    console.log(message);
    if (lst != "room-" + message) {
      socket.join("room-" + message);
      socket.leave(lst);
      lst = "room-" + message;
    }
    console.log(socket.rooms);
  });
});
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true
  })
);

passport.serializeUser(function(user, done) {
  console.log("Сериализация: ", user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log("Десериализация: ", id);
  var user = false;
  for (const userN of users) {
    user = userN.id === id ? userN : user;
  }
  done(null, user);
});

function Connect() {
  var connection = mysql.createConnection(param);
  connection.query("SELECT * FROM userslist.users", function(
    error,
    result,
    fields
  ) {
    //console.log(result)
    users = result;
  });
  connection.end();
}

passport.use(
  new LocalStrategy({ usernameField: "email" }, function(
    email,
    password,
    done
  ) {
    Connect();
    console.log(email + password);
    for (const userN of users) {
      //console.log(bcrypt.hashSync(password, salt));
      //console.log(userN.password);
      //console.log(bcrypt.compareSync(password, userN.password));
      if (
        email === userN.email &&
        bcrypt.compareSync(password, userN.password)
      ) {
        console.log("логин правильный, вы ", userN.id);
        return done(null, userN);
      }
    }
    console.log("логин неправильный");
    return done(null, false);
  })
);

port = 5000;
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var param = {
  host: "localhost",
  user: "test",
  password: "12345678",
  database: "userslist"
};

var sessionConnection = mysql.createConnection(param);
var sessionStore = new MySQLStore(
  {
    expiration: 10800000,
    createDatabaseTable: false,
    schema: {
      tableName: "USERS_SESSIONS",
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data"
      }
    }
  },
  sessionConnection
);

app.use(
  session({
    secret: "hghtyNN23h",
    store: sessionStore,
    cookie: {
      path: "/",
      httpOnly: false,
      resave: false,
      maxAge: 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: true
  })
);

//require("./config-passport");
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  console.log(req.headers);
  return res.json("index");
});

app.post("/login", (req, res, next) => {
  req.logOut();

  passport.authenticate("local", function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      //console.log("Укажите правильный email или пароль!");
      return res.send("Укажите правильный email или пароль!");
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/dialogs");
      c;
    });
  })(req, res, next);
});

const auth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.redirect("/");
  }
};

app.get("/dialogs", auth, (req, res) => {
  var connection = mysql.createConnection(param);
  idd = req.session.passport.user.toString();
  const dialog = [idd, idd];
  const sql =
    "SELECT d.id,d.user_id,nick FROM userslist.dialogs d, userslist.users u, userslist.dialogs d2 where  d.user_id=u.id and d.id=d2.id and d2.user_id=(?) and d.user_id<>(?)";
  connection.query(sql, dialog, function(error, result, fields) {
    return res.send(result);
  });
  connection.end();
});

app.post("/messages", auth, (req, res) => {
  var connection = mysql.createConnection(param);
  idd = req.session.passport.user.toString();
  const dialog = [idd, req.body.dialog];
  const sql =
    "SELECT m.user_id,m.message,m.date FROM userslist.dialogs d, userslist.users u, userslist.dialogs d2 ,userslist.messages m where  d.user_id=u.id and d.id=d2.id and d2.user_id=(?) and m.dialog_id=d.id and d.id=(?) group by m.id";
  connection.query(sql, dialog, function(error, result, fields) {
    return res.send(JSON.stringify(result));
  });
  connection.end();
});

app.post("/add", auth, (req, res) => {
  var connection = mysql.createConnection(param);
  idd = req.session.passport.user.toString();
  const dialog = [idd, req.body.message, req.body.dialog];
  const sql =
    "insert into userslist.messages (user_id,message,date,dialog_id) values ((?),(?),now(),(?))";
  connection.query(sql, dialog, function(error, result, fields) {
    return res.send(JSON.stringify(result));
  });
  connection.end();
});

app.get("/id", auth, (req, res) => {
  return res.send({ id: req.session.passport.user.toString() });
});

app.post("/register", (req, res, next) => {
  if (!req.body.password || !req.body.nick || !req.body.email) {
    res.send("Пожалуйста, введите данные");
  } else {
    var connection = mysql.createConnection(param);
    let ps = bcrypt.hashSync(req.body.password, salt);
    const dialog = [req.body.email, ps, req.body.nick];
    const sql =
      "insert into userslist.users (email,password,nick) values ((?),(?),(?))";
    connection.query(sql, dialog, function(error, result, fields) {
      if (error) res.send("Пользователь уже существует");
      else res.send(JSON.stringify("Пользователь добавлен"));
    });
    connection.end();
  }
});

//////////////////////////////////
app.post("/adddial", auth, (req, res) => {
  var connection = mysql.createConnection(param);
  idd = req.session.passport.user.toString();
  const dialog = [idd, req.body.i, req.body.dialog];
  const sql =
    "insert into userslist.messages (user_id,message,date,dialog_id) values ((?),(?),now(),(?))";
  connection.query(sql, dialog, function(error, result, fields) {
    return res.send(JSON.stringify(result));
  });
  connection.end();
});

app.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/hhhh");
});

//app.listen(port, () => console.log(`Example app listening on port ${port}!`));
let srv = http.createServer(app).listen(5000);
