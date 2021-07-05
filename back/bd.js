const mongodb = require(`mongodb`);

function fechaYHora() {
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

function obtenerUsuarios(err, cbDatos) {
  const mongoClient = mongodb.MongoClient.connect("mongodb://localhost:27017", function (err, cliente) {
    if (err) {
      console.log("hubo un error al conectar");
      return;
    }
    const klandb = cliente.db("klandestinos");
    const usuariosdb = klandb.collection("usuario");
    usuariosdb.find(function (err, datos) {
      cbDatos(datos);
    });
  });
}

function obtenerUsuario(nick, pass, err, cbDatos) {
  const mongoClient = mongodb.MongoClient.connect("mongodb://localhost:27017", function (err, cliente) {
    if (err) {
      console.log("hubo un error al conectar");
      return;
    }
    const klandb = cliente.db("klandestinos");
    const usuariosdb = klandb.collection("usuario");
    usuariosdb.findOne({ nick: nick, password: pass }, function (err, datos) {
      cbDatos(datos);
    });
  });
}

function obtenerPerfil(nombre, err, cbDatos) {
  const mongoClient = mongodb.MongoClient.connect("mongodb://localhost:27017", function (err, cliente) {
    if (err) {
      console.log("hubo un error al conectar");
      return;
    }
    const klandb = cliente.db("klandestinos");
    const colecciondb = klandb.collection("perfil");
    colecciondb.findOne({ nombre: nombre }, function (err, datos) {
      cbDatos(datos);
    });
  });
}

function obtenerEvento(id, err, cbDatos) {
  const mongoClient = mongodb.MongoClient.connect("mongodb://localhost:27017", function (err, cliente) {
    if (err) {
      console.log("hubo un error al conectar");
      return;
    }
    const klandb = cliente.db("klandestinos");
    const colecciondb = klandb.collection("evento");
    colecciondb.findOne({ id: id }, function (err, datos) {
      cbDatos(datos);
    });
  });
}

function obtenerEventosSiguientes(err, cbDatos) {
  const mongoClient = mongodb.MongoClient.connect("mongodb://localhost:27017", function (err, cliente) {
    if (err) {
      console.log("hubo un error al conectar");
      return;
    }
    const klandb = cliente.db("klandestinos");
    const colecciondb = klandb.collection("evento");
    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);
    const mes = hoy.getMonth() + 1 < 10 ? `0${hoy.getMonth() + 1}` : `${hoy.getMonth() + 1}`;
    let ya = `${hoy.getDate()}/${mes}/${hoy.getFullYear()}`; // "22/06/2020"
    colecciondb.find(/* { fechaEvento: ya } */).toArray(function (err, datos) {
      cbDatos(datos);
    });
  });
}

function obtenerEventosPorUbicacion(ubicacion, err, cbDatos) {
  const mongoClient = mongodb.MongoClient.connect("mongodb://localhost:27017", function (err, cliente) {
    if (err) {
      console.log("hubo un error al conectar");
      return;
    }
    const klandb = cliente.db("klandestinos");
    const colecciondb = klandb.collection("evento");
    colecciondb.findOne({ ubicacion: ubicacion }, function (err, datos) {
      cbDatos(datos);
    });
  });
}

function obtenerEventosPorUsuario(usuarioCreador, err, cbDatos) {
  const mongoClient = mongodb.MongoClient.connect("mongodb://localhost:27017", function (err, cliente) {
    if (err) {
      console.log("hubo un error al conectar");
      return;
    }
    const klandb = cliente.db("klandestinos");
    const colecciondb = klandb.collection("evento");
    colecciondb.find({ usuarioCreador: usuarioCreador }).toArray(function (err, datos) {
      cbDatos(datos);
    });
  });
}

function registrarUsuario(newUsuario, err, cbOk) {
  const mongoClient = mongodb.MongoClient.connect("mongodb://localhost:27017", function (err, cliente) {
    if (err) {
      console.log("hubo un error al conectar");
      return;
    }
    const klandb = cliente.db("klandestinos");
    const colecciondb = klandb.collection("usuario");
    colecciondb.insertOne(newUsuario, (err, datos) => {
      if (err) {
        cbError(err);
        return;
      }
      cliente.close();
      cbOk();
    });
  });
}

function registrarEvento(newEvento, err, cbOk) {
  const mongoClient = mongodb.MongoClient.connect("mongodb://localhost:27017", function (err, cliente) {
    if (err) {
      console.log("hubo un error al conectar");
      return;
    }
    const klandb = cliente.db("klandestinos");
    const colecciondb = klandb.collection("evento");
    colecciondb.insertOne(newEvento, (err, datos) => {
      if (err) {
        cbError(err);
        return;
      }
      cliente.close();
      cbOk();
    });
  });
}

function userAsistenteDeEvento(nick, idEvento, err, cbDatos) {
  const mongoClient = mongodb.MongoClient.connect("mongodb://localhost:27017", function (err, cliente) {
    if (err) {
      console.log("hubo un error al conectar");
      return;
    }
    const klandb = cliente.db("klandestinos");
    const colecciondb = klandb.collection("evento");
    colecciondb.find({ _id: mongodb.ObjectId(idEvento) }).toArray(function (err, datos) {
      cbDatos(datos);
    });
  });
}

function comentarEnEvento(idEvento, comentario, err, cbOk) {
  const mongoClient = mongodb.MongoClient.connect("mongodb://localhost:27017", function (err, cliente) {
    if (err) {
      console.log("hubo un error al conectar");
      return;
    }
    const klandb = cliente.db("klandestinos");
    const colecciondb = klandb.collection("evento");
    colecciondb.updateOne({ _id: mongodb.ObjectId(idEvento) }, { $addToSet: { mensajes: comentario } }, function (err, datos) {
      if (err) {
        err(err);
        console.log(err);
      }
      cliente.close();
      cbOk();
    });
  });
}

module.exports = {
  obtenerUsuarios,
  obtenerUsuario,
  obtenerPerfil,
  obtenerEvento,
  obtenerEventosPorUsuario,
  obtenerEventosSiguientes,
  registrarUsuario,
  registrarEvento,
  userAsistenteDeEvento,
  comentarEnEvento,
};
