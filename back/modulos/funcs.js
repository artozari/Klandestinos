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
module.exports = { iniciarSesion };
