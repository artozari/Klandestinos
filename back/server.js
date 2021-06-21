const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const expHbs = require("express-handlebars");
const bd = require(`./bd`);
const session = require("express-session");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static(path.join(__dirname, "../front")));
app.use(express.urlencoded({ extended: true }));

app.engine(
  "handlebars",
  expHbs({
    defaultLayout: "main.handlebars",
    layoutsDir: "views/layouts",
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

/* Aqui estan los routers */

app.get("/", function (req, res) {
  res.render("mainLogin", {});
});

app.post("/login", function (req, res) {
  const user = req.body.txtUser;
  const pass = req.body.txtPassword;
  let TodosLosDatos = { dato: [{ mensaje: "Tus eventos:" }] };
  bd.obtenerUsuario(
    user,
    pass,
    (err) => {
      res.render("mainLogin", { error: `ERROR: Se presento un error ${err}` });
      console.log("Error");
    },
    (cbdatos) => {
      TodosLosDatos.usuario = cbdatos;
      bd.obtenerEvento(
        1,
        (error) => {
          res.render(`ERROR: Se presento un error al consultar el evento: ${error}`);
          console.log("Error");
        },
        (cbdatosEvento) => {
          TodosLosDatos.evento = cbdatosEvento;
          console.log(TodosLosDatos);
          res.render("mainLogin", { TodosLosDatos });
        }
      );
    }
  );
});

app.get("/evento", function (req, res) {
  const evento = bd.obtenerEvento(
    1,
    (error) => {
      res.render(`ERROR: Se presento un error al consultar el evento: ${error}`);
      console.log("Error");
    },
    (cbdatos) => {
      res.render("evento", { cbdatos });
    }
  );
});

/*  */

app.listen(port, function () {
  console.log(`escuchando el puerto: ${port} para Klandestinos`);
});
