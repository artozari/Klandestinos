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
    res.render("home", { usuario, nombre, fotoPerfil });
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
        console.log(eventos);
        res.render("tusEventos", { eventos, usuario: req.session.nick });
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
      req.session.nick,
      (error) => {
        res.render(`ERROR: Se presento un error al consultar el evento: ${error}`);
        console.log("Error");
      },
      (cbdatosEventos) => {
        let eventos = cbdatosEventos;
        console.log(eventos);
        res.render("tusEventos", { eventos, usuario: req.session.nick });
      }
    );
  }
});

/* aqui el listen */

app.listen(port, function () {
  console.log(`escuchando el puerto: ${port} para Klandestinos`);
});

// app.post("/login", function (req, res) {
//   const user = req.body.txtUser;
//   const pass = req.body.txtPassword;
//   let todosLosDatos = { datos: { mensaje: "algo" } };
//   bd.obtenerUsuario(
//     user,
//     pass,
//     (err) => {
//       res.render("mainLogin", { error: `ERROR: Se presento un error ${err}` });
//       console.log("Error");
//     },
//     (cbdatos) => {
//       todosLosDatos.usuario = cbdatos;
//       req.session.nick = todosLosDatos.usuario.nick;
//       // console.log(req.session.nick);
//       bd.obtenerEvento(
//         1,
//         (error) => {
//           res.render(`ERROR: Se presento un error al consultar el evento: ${error}`);
//           console.log("Error");
//         },
//         (cbdatosEvento) => {
//           todosLosDatos.evento = cbdatosEvento;
//           bd.obtenerPerfil(
//             "Angel",
//             (error) => {
//               res.render(`ERROR: Se presento un error al consultar el evento: ${error}`);
//               console.log("Error");
//             },
//             (cbdatosPerfil) => {
//               todosLosDatos.perfil = cbdatosPerfil;
//               console.log(todosLosDatos);
//               if (req.session.nick) {
//                 res.render("mainLogin", { todosLosDatos });
//               } else {
//                 console.log("no se conecto un usuario");
//                 return;
//               }
//             }
//           );
//         }
//       );
//     }
//   );
// });
