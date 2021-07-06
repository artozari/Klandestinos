const divContComent = document.querySelectorAll(".tusEventos");
const cantEventos = document.getElementById("cantEventos").value;

divContComent.forEach(function (element) {
  element.addEventListener("click", function (evento) {
    if (evento.target.id === "btnAsistirEvento") {
      btnAsistir(element.querySelector("#idHidden").value);
    }
    if (evento.target.id === "btnAbandonarEvento") {
      btnAbandonoEvento(element.querySelector("#idHidden").value);
    }
    if (evento.target.id === "btnComentar") {
      btnComentar(
        element.querySelector("#idHidden").value,
        element.querySelector("#inputComentario").value,
        element.querySelector("#txtAreaComentarios"),
        element.querySelector("#losComentarios")
      );
    }
    if (evento.target.id === "btnCompartirEvento") {
    }
  });
  llenarMensajes(
    element.querySelector("#idHidden").value,
    element.querySelector("#txtAreaComentarios"),
    element.querySelector("#losComentarios")
  );
});

function btnAsistir(idEvento) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", () => {
    let response = JSON.parse(xhr.responseText);
    console.log(response.mensaje);
    alert(response.mensaje);
  });
  xhr.open("POST", `/asistirAlEvento`);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify({ id: idEvento }));
}

function btnAbandonoEvento(idEvento) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", () => {
    let response = JSON.parse(xhr.responseText);
    console.log(response.mensaje);
    alert(response.msjAsistenteEliminado);
  });
  xhr.open("POST", `/quitarAsistente`);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify({ id: idEvento }));
}

function btnComentar(idEvento, comentario, txtAreaComentarios, divLosComentarios) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", () => {
    let response = JSON.parse(xhr.responseText);
    if (response.rechazo) {
      alert(response.rechazo);
    } else {
      const divPost = document.createElement("div");
      const nickComent = document.createElement("h5");
      const elComentario = document.createElement("h4");
      const laFecha = document.createElement("p");
      const optcionesComentario = document.createElement("a");
      optcionesComentario.textContent = "...";
      optcionesComentario.href = "";
      laFecha.textContent = response.fecha;
      elComentario.textContent = response.comentario;
      nickComent.textContent = response.datos.nick;
      divPost.appendChild(nickComent);
      divPost.appendChild(elComentario);
      divPost.appendChild(laFecha);
      divPost.appendChild(optcionesComentario);
      divPost.classList.add("cajaComentarios");
      divLosComentarios.appendChild(divPost);
    }
  });
  xhr.open("POST", `/entradaDeComentario`);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify({ id: idEvento, comentario: comentario }));
}

////* aqui llena los mensajes */
function llenarMensajes(idEvento, txtAreaComentarios, divLosComentarios) {
  // divContComent.innerHTML = "";
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", () => {
    let response = JSON.parse(xhr.responseText);
    console.log(response.datos.mensajes.length);
    for (let i = 0; i < response.datos.mensajes.length; i++) {
      const divPost = document.createElement("div");
      const nickComent = document.createElement("h5");
      const elComentario = document.createElement("h4");
      const laFecha = document.createElement("p");
      const optcionesComentario = document.createElement("a");
      optcionesComentario.textContent = "...";
      optcionesComentario.href = "";
      laFecha.textContent = response.datos.mensajes[i].fechaMensaje;
      elComentario.textContent = response.datos.mensajes[i].mensaje;
      nickComent.textContent = response.datos.mensajes[i].nick;
      divPost.appendChild(nickComent);
      divPost.appendChild(elComentario);
      divPost.appendChild(laFecha);
      divPost.appendChild(optcionesComentario);
      divPost.classList.add("cajaComentarios");
      divLosComentarios.appendChild(divPost);
    }
  });
  xhr.open("POST", `/comentariosDeEvento`);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify({ idEvento: idEvento }));
}
