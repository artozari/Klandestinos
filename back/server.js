const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const expHbs = require("express-handlebars");
const bd = require(`./bd`);

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
  res.render("login", {});
});

app.post("/login", function (req, res) {
  const user = req.body.txtUser;
  const pass = req.body.txtPassword;
  let us = bd.obtenerUsuario(
    user,
    pass,
    (err) => {
      res.render(`ERROR: Se presento un error al consultar el usuario: ${error}`);
      console.log("Error");
    },
    (cbdatos) => {
      res.render("mainLogin", { cbdatos });
      console.log(cbdatos.nick);
    }
  );
  if (us) {
    console.log(us);
  }
});

/*  */

app.listen(port, function () {
  console.log(`escuchando el puerto: ${port} para Klandestinos`);
});
