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
  if (usuario.length > 3 && email.length > 3 && pass.length > 2 && rePass.length > 2) {
    if (pass == rePass) {
      if (email) {
        console.log("aqui toy");
        if (usuario) {
          const user = formatearUsuario(usuario, email, pass);
          return user; //Aun no valido usuario;
        }
      }
    }
  } else return false;
}

function validarEmail(valor) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/.test(valor)) {
    return true;
  } else {
    return false;
  }
}

function formatearUsuario(usuario, email, pass) {
  const usuarioVal = {
    nick: usuario,
    email: email,
    fechaCreacion: fechaYHora(),
    password: pass,
    perfil: {
      nombre: "",
      apellidos: "",
      fechaNac: "",
      direccion: "",
      telefono: "",
      fotoPerfil: "https://i.stack.imgur.com/4powQ.gif",
    },
  };
  return usuarioVal;
}

function formatearPerfilUsuario(nombre, apellidos, fechaNac, direccion, telf, fotoPerfil) {
  const perfil = {
    nombre: nombre,
    apellidos: apellidos,
    fechaNac: fechaNac,
    direccion: direccion,
    telefono: telf,
    fotoPerfil: fotoPerfil,
  };
  return perfil;
}

function fechaYHora() {
  const date = new Date();
  const anio = date.getFullYear().toString();
  const mes = (date.getMonth() + 1).toString().padStart(2, "0");
  const dia = date.getDate().toString().padStart(2, "0");
  const hora = date.getHours().toString().padStart(2, "0");
  const mins = date.getMinutes().toString().padStart(2, "0");
  const segs = date.getSeconds().toString().padStart(2, "0");
  const mils = date.getMilliseconds().toString();
  return `${anio}-${mes}-${dia}-${hora}:${mins}:${segs}:${mils}`;
}

function fechaYHoraImg() {
  const date = new Date();

  const anio = date.getFullYear().toString();
  const mes = (date.getMonth() + 1).toString().padStart(2, "0");
  const dia = date.getDate().toString().padStart(2, "0");
  const hora = date.getHours().toString().padStart(2, "0");
  const mins = date.getMinutes().toString().padStart(2, "0");
  const segs = date.getSeconds().toString().padStart(2, "0");
  const mils = date.getMilliseconds().toString();

  return `${anio}${mes}${dia}-${hora}${mins}${segs}${mils}`;
}

function validarEvento(nombre, fecha, fechaFin, ubicacion, limiteAsistentes, descripcion, img, user) {
  console.log(nombre, fecha, fechaFin, ubicacion, limiteAsistentes, descripcion, img, user);
  if (nombre != "" && fecha < fechaFin && ubicacion != "" && limiteAsistentes > 0 && limiteAsistentes < 100 && descripcion != "") {
    console.log(nombre, fecha, fechaFin, ubicacion, limiteAsistentes, descripcion, img, user);
    console.log("aqui toy");
    let evento = {
      nombre: nombre,
      fechaEvento: fecha,
      fechaFin: fechaFin,
      ubicacion: ubicacion,
      limiteAsist: limiteAsistentes,
      descripcion: descripcion,
      urlImage: img,
      usuarioCreador: user,
      asistentes: [`${user}`],
      mensajes: [
        {
          nick: "",
          mensaje: "",
          fechaMensaje: "",
        },
      ],
    };
    return evento;
  } else return false;
}

function validarComentario(user, comentario) {
  if (comentario != "" && user != "") {
    let dato = {
      nick: user,
      mensaje: comentario,
      fechaMensaje: fechaYHora(),
    };
    return dato;
  } else return false;
}

module.exports = {
  iniciarSesion,
  validarRegistro,
  formatearUsuario,
  fechaYHora,
  validarEvento,
  validarComentario,
  fechaYHoraImg,
  formatearPerfilUsuario,
};
