const mongodb = require(`mongodb`);

function obtenerUsuarios(err, cbDatos) {
  const mongoClient = mongodb.MongoClient.connect("mongodb://localhost:27017", function (err, cliente) {
    if (err) {
      console.log("hubo un error al conectar");
      return;
    }
    const klandb = cliente.db("klandestinos");
    const usuariosdb = klandb.collection("usuario");
    usuariosdb.find().toArray(function (err, datos) {
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
    usuariosdb.find({ nick: nick, password: pass }).toArray(function (err, datos) {
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
    colecciondb.find({ nombre: nombre }).toArray(function (err, datos) {
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
    colecciondb.find({ id: id }).toArray(function (err, datos) {
      cbDatos(datos);
    });
  });
}

function obtenerEventos(err, cbDatos) {
  const mongoClient = mongodb.MongoClient.connect("mongodb://localhost:27017", function (err, cliente) {
    if (err) {
      console.log("hubo un error al conectar");
      return;
    }
    const klandb = cliente.db("klandestinos");
    const colecciondb = klandb.collection("evento");
    colecciondb.find().toArray(function (err, datos) {
      cbDatos(datos);
    });
  });
}

function obtenerEventosPorUbicacion(direccion, err, cbDatos) {
  const mongoClient = mongodb.MongoClient.connect("mongodb://localhost:27017", function (err, cliente) {
    if (err) {
      console.log("hubo un error al conectar");
      return;
    }
    const klandb = cliente.db("klandestinos");
    const colecciondb = klandb.collection("evento");
    colecciondb.find({ ubicacion: ubicacion }).toArray(function (err, datos) {
      cbDatos(datos);
    });
  });
}

module.exports = { obtenerUsuarios, obtenerUsuario, obtenerPerfil, obtenerEvento };
