const mongodb = require(`mongodb`);

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

function crearEvento(newEvento, err, cbDatos) {
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

module.exports = {
  obtenerUsuarios,
  obtenerUsuario,
  obtenerPerfil,
  obtenerEvento,
  obtenerEventosPorUsuario,
  obtenerEventosSiguientes,
  registrarUsuario,
};
