const divContComent = document.querySelectorAll(".tusEventos");
console.log(divContComent);

divContComent.forEach(function (element) {
  console.log("aqui toy");
  const btnComentar = element.getElementById("btnComentar");
  const btnAsistir = element.getElementById("btnAsistirEvento");
  const comentario = element.getElementById("inputComentario");
  const idHidden = element.getElementById("idHidden");
  const txtAreaComentarios = element.getElementById("txtAreaComentarios");

  btnAsistir.addEventListener("click", function () {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
      const response = JSON.parse(xhr.responseText);
      txtAreaComentarios.textContent = response.mensaje;
    });
    xhr.open("POST", `/asistirAlEvento`);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ id: idHidden.value }));
  });

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
});

// /* Agrega comentarios al evento de un asistente */
