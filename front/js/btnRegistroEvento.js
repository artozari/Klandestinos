const btnRrgEvento = document.getElementById("bntRegistroEvento");

btnRrgEvento.addEventListener("click", function () {
  const xhr = new XMLHttpRequest();
  const divEv = document.getElementById("crearEvento");
  xhr.addEventListener("load", function () {
    const respuesta = xhr.responseText;
    const p = document.createElement("div");
    p.textContent = respuesta;
    divEv.appendChild(p);
  });
  xhr.open("GET", "/registroEvento");
  xhr.send();
});
