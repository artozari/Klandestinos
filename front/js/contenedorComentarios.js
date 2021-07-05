const divContComent = document.getElementById("contenedor-Comentarios");
const comentario = document.getElementById("inputComentario");
const btnComentar = document.getElementById("btnComentar");
const mensajesDeEvento = document.getElementById("mensajesDeEvento");
const txtAreaComentarios = document.getElementById("txtAreaComentarios");
const idHidden = document.getElementById("idHidden");
const btnAsistirEvento = document.getElementById("btnAsistirEvento");

////*  Boton para asistir al evento */
btnAsistirEvento.addEventListener("click", function () {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", () => {
    const response = JSON.parse(xhr.responseText);
    txtAreaComentarios.textContent = response.mensaje;
    console.log(response);
  });
  xhr.open("POST", `/asistirAlEvento`);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify({ id: idHidden.value }));
});

// /* Agrega comentarios al evento de un asistente */
btnComentar.addEventListener("click", function () {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", () => {
    let response = JSON.parse(xhr.responseText);
    console.log(response.comentario);
    txtAreaComentarios.textContent = response.comentario;
  });
  xhr.open("POST", `/entradaDeComentario`);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify({ id: idHidden.value, comentario: comentario.value }));
});
