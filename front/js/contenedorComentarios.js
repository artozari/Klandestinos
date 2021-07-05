const divContComent = document.getElementById("contenedor-Comentarios");
const comentario = document.getElementById("inputComentario");
const btnComentar = document.getElementById("btnComentar");
const mensajesDeEvento = document.getElementById("mensajesDeEvento");
const txtAreaComentarios = document.getElementById("txtAreaComentarios");
const idHidden = document.getElementById("idHidden");
const btnAsistirEvento = document.getElementById("btnAsistirEvento");

btnAsistirEvento.addEventListener("click", function () {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", () => {
    const response = xhr.responseText;
    txtAreaComentarios.textContent = response;
    console.log(response);
  });
  xhr.open("POST", `/asisitirAlEvento`);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify({ id: idHidden.value }));
});

btnComentar.addEventListener("click", function () {
  /*  esto tiene que agregar el comentario en la base de datos y luego actualizar el Text Area de los comentarios con los comentarios existentes para ese evento y solo si es que el comentador esta como asistente del evento */
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", () => {
    let response = JSON.parse(xhr.responseText);
    console.log(response.comentario);
    txtAreaComentarios.textContent = response.comentario;

    // console.log(response);
  });
  xhr.open("POST", `/entradaDeComentario`);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  /* importantininisimo, no se que hace pero con esto funciona el envio */
  xhr.send(JSON.stringify({ id: idHidden.value, comentario: comentario.value }));
});
