const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const expHbs = require("express-handlebars");
const bd = require(`./bd`);
const expSession = require("express-session");

const funcs = require("./modulos/funcs");
const { Db } = require("mongodb");

app.use(
  expSession({
    secret: "bla bla bla",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.static(path.join(__dirname, "../front")));
app.use(express.urlencoded({ extended: true }));

app.engine(
  "handlebars",
  expHbs({
    defaultLayout: "main",
    layoutsDir: "views/layouts",
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.get("/", function (req, res) {
  if (req.session.nick) {
    res.redirect("/home");
  } else res.render("login", { dato: "saludo" });
});

app.post("/iniciar", function (req, res) {
  const user = req.body.txtUser;
  const pass = req.body.txtPassword;
  bd.obtenerUsuario(
    user,
    pass,
    (err) => {
      res.render("mainLogin", { error: `ERROR: Se presento un error ${err}` });
      console.log("Error");
    },
    (cbDatos) => {
      let usuario = cbDatos;
      if (usuario) {
        req.session.nick = usuario.nick;
        req.session.id = usuario.perfil.id;
        req.session.nombre = usuario.perfil.nombre;
        req.session.foto = usuario.perfil.fotoPerfil;
        res.redirect("/home");
      } else {
        res.redirect("/");
      }
    }
  );
});

app.get("/home", function (req, res) {
  let usuario = req.session.nick;
  if (usuario) {
    let nombre = req.session.nombre;
    let fotoPerfil = req.session.foto;
    let id = req.session.id;
    let datos = req.session;
    res.render("home", { usuario, nombre, fotoPerfil, datos });
  } else res.redirect("/");
});

app.get("/cerrarSesion", function (req, res) {
  req.session.destroy();
  res.redirect("/");
});

app.get("/tusEventos", function (req, res) {
  if (!req.session.nick) {
    res.redirect("/");
  } else {
    console.log("Usuario Logueado: " + req.session.nick);
    bd.obtenerEventosPorUsuario(
      req.session.nick,
      (error) => {
        res.render(`ERROR: Se presento un error al consultar el evento: ${error}`);
        console.log("Error");
      },
      (cbdatosEventos) => {
        let eventos = cbdatosEventos;
        let datos = req.session;
        res.render("tusEventos", { eventos, usuario: req.session.nick, fotoPerfil: req.session.foto, datos });
      }
    );
  }
});

app.get("/eventosProximos", function (req, res) {
  if (!req.session.nick) {
    res.redirect("/");
  } else {
    console.log("Usuario Logueado: " + req.session.nick);
    bd.obtenerEventosSiguientes(
      (error) => {
        res.render(`ERROR: Se presento un error al consultar el evento: ${error}`);
        console.log("Error");
      },
      (cbdatosEventos) => {
        let eventos = cbdatosEventos;
        let fotoPerfil = req.session.foto;
        let datos = req.session;
        res.render("tusEventos", { eventos, usuario: req.session.nick, fotoPerfil, datos }); //// no hay datos
      }
    );
  }
});

app.get("/registro", function (req, res) {
  if (!req.session.nick) {
    res.render("registro");
  } else {
    res.redirect("/");
  }
});

app.post("/registrarse", function (req, res) {
  const usuario = req.body.txtUser;
  const email = req.body.txtEmail;
  const pass = req.body.txtPassword;
  const rePass = req.body.txtRePassword;
  // const btnLogin = req.body.btnRegistrarse;
  const newUsuario = funcs.validarRegistro(usuario, email, pass, rePass);
  console.log(newUsuario);
  if (newUsuario) {
    bd.registrarUsuario(
      newUsuario,
      (err) => {
        res.render("error", {
          error: err,
        });
      },
      () => {
        console.log(`Usuario ${usuario} registrado`);
        res.render("registro", { mensaje: `Se registro con exito el Usuario: ${usuario}` });
      }
    );
  } else {
    res.render("registro", { mensaje: `No se pudo registrar en usuario: ${usuario}` });
  }
});

app.get("/perfil", function (req, res) {
  if (!req.session.nick) {
    res.redirect("/");
  } else {
    res.render("perfil", { datos: req.session, usuario: req.session.nick, fotoPerfil: req.session.foto });
  }
});

app.get("/registroEvento", function (req, res) {
  if (!req.session.nick) {
    res.redirect("/");
  } else {
    console.log(req.session);
    res.render("registroEvento", { datos: req.session, fotoPerfil: req.session.foto });
  }
});

/* aqui el listen */

app.listen(port, function () {
  console.log(`escuchando el puerto: ${port} para Klandestinos`);
});
