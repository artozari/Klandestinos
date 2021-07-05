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
app.use(express.json());

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

app.post("/registroEvento", function (req, res) {
  if (!req.session.nick) {
    res.redirect("/");
  } else {
    let nombreEvento = req.body.txtEvento;
    let fechaEvento = req.body.txtFechaEvento;
    let fechaFinEvento = req.body.txtFechafinEvento;
    let ubicacionEvento = req.body.txtUbicacion;
    let maxAsistentes = req.body.txtLimiteAsistentes;
    let descripcion = req.body.txtDescripcion;
    let imgEvento = req.body.imgEvento;
    let evento = funcs.validarEvento(
      nombreEvento,
      fechaEvento,
      fechaFinEvento,
      ubicacionEvento,
      maxAsistentes,
      descripcion,
      imgEvento,
      req.session.nick
    );
    console.log(evento);
    if (evento) {
      bd.registrarEvento(
        evento,
        (err) => {
          res.render("registroEvento", { error: "ERROR: El evento no pudo ser registrado" });
        },
        (cbDatos) => {
          let datos = req.session;
          res.render("registroEvento", { datos, mensaje: `El evento ${nombreEvento}, fue registrado!` });
        }
      );
    } else {
      res.render("registroEvento", { datos: req.session });
    }
  }
});

app.post("/asistirAlEvento", function (req, res) {
  if (!req.session.nick) {
    res.redirect("/");
  } else {
    bd.asistirAlEvento(
      req.body.id,
      req.session.nick,
      (err) => {
        console.log("ocurrio un Error al validar el id del evento o del asistente");
        return;
      },
      (cbOk) => {
        console.log("asistente agregado");
        res.send({ datos: req.session, mensaje: "Asistente agregado", idEvento: req.body.id });
      }
    );
  }
});

app.post("/entradaDeComentario", function (req, res) {
  if (!req.session.nick) {
    res.redirect("/");
  } else {
    let userComenta = req.session.nick;
    let comentario = req.body.comentario;
    let idEvento = req.body.id;
    const validado = funcs.validarComentario(userComenta, comentario);
    if (validado) {
      bd.userAsistenteDeEvento(
        userComenta,
        idEvento,
        (err) => {
          console.log("ocurrio un Error al validar el id del evento a comentar");
          return;
        },
        (cbDatos) => {
          if (cbDatos != "") {
            bd.comentarEnEvento(
              idEvento,
              validado,
              (err) => {
                console.log("Error al guardar el mensaje");
                res.send(`tu comentario no pudo se agregado intenta en unos minutos`);
              },
              (cbOk) => {
                console.log("comentario guardado");
                res.send({ datos: req.session, comentario, idEvento });
              }
            );
          } else {
            console.log("Usuario no es asistente de ese evento");
            res.send({ datos: req.session, comentario: "Usuario no es asistente de ese evento", idEvento });
          }
        }
      );
    }
  }
});

/* aqui el listen */

app.listen(port, function () {
  console.log(`escuchando el puerto: ${port} para Klandestinos`);
});
