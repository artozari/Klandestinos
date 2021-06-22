const bd = require("../bd");

function iniciarSesion(user, pass) {
  return bd.obtenerUsuario(
    user,
    pass,
    (err) => {
      res.render("mainLogin", { error: `ERROR: Se presento un error ${err}` });
      console.log("Error");
    },
    (cbDatos) => {
      cbDatos;
    }
  );
}

function validarRegistro(usuario, email, pass, rePass) {
  if (pass == rePass) {
    return true;
  }
}

module.exports = { iniciarSesion, validarRegistro };
