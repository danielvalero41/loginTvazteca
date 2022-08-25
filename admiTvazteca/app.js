//Carga de datos

const baseUrl = "https://qn7ubxj566.execute-api.us-east-1.amazonaws.com/dev";
const apiKey = localStorage.getItem("token");
var changedPartnerKey = false;
var changedNumberChanel = false;

if (!apiKey) {
  window.location.href = "../index.html";
}
//Valores iniciales

var arrayData = [];
var tbody = document.querySelector("#idTbody");
var validTest;
var validTest2 = true;
var temp;
var tempChanel;
var disabledGoogle = false;
var disabledFacebook = false;
document.querySelector("#savePartner").setAttribute("disabled", "");
document.querySelector("#status").checked = true;
document.querySelector("#main").style.display = "none";

async function GET(url) {
  try {
    const response = await fetch(baseUrl + url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    });
    const json = await response.json();
    if (response.status <= 299) return { data: json, error: null };
    return { data: null, error: json };
  } catch (error) {
    return { data: null, error: error };
  }
}

async function DELETE(url) {
  try {
    const response = await fetch(baseUrl + url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    });
    const json = await response.json();
    if (response.status <= 299) return { data: json, error: null };
    return { data: null, error: json };
  } catch (error) {
    return { data: null, error: error };
  }
}

async function POST(url, body) {
  try {
    const response = await fetch(baseUrl + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    if (response.status <= 299) return { data: json, error: null };
    return { data: null, error: json };
  } catch (error) {
    return { data: null, error: error };
  }
}

const getData = (resp) => {
  arrayData = [];
  resp.data.forEach((element) => {
    arrayData.push(element);
  });

  const table = document.querySelector("#table");

  table.removeChild(document.querySelector("#idTbody"));
  const newTbody = document.createElement("tbody");
  newTbody.setAttribute("id", "idTbody");
  table.appendChild(newTbody);
  for (let index = 0; index < arrayData.length; index++) {
    const element = arrayData[index];
    let tr = document.createElement("tr");
    //creacion de columnas
    let colNombre = document.createElement("td");
    let colUrl = document.createElement("td");
    let colStatus = document.createElement("td");
    colStatus.setAttribute("class", "colcell");
    let colAcciones = document.createElement("td");
    colAcciones.setAttribute("class", "colcell");
    //creacion de acciones
    let colAccionEditar = document.createElement("button");
    colAccionEditar.innerHTML = `<i class="fas fa-pencil"></i>`;
    colAccionEditar.classList.add("editButton");
    colAccionEditar.classList.add("iconButton");
    colAccionEditar.setAttribute("id", "btnEditar" + index);
    colAccionEditar.setAttribute("data-bs-toggle", "modal");
    colAccionEditar.setAttribute("data-bs-target", "#exampleModal");
    colAccionEditar.onclick = () => editar(index);
    let colAccionEliminar = document.createElement("button");
    colAccionEliminar.innerHTML = `<i class="fas fa-trash"></i>`;
    colAccionEliminar.classList.add("eliminarButton");
    colAccionEliminar.classList.add("iconButton");
    colAccionEliminar.setAttribute("id", "btnEliminar" + index);
    colAccionEliminar.onclick = () => eliminar(index);
    //se agrega las columna en la row
    colNombre.innerText = element.namepartner;
    colUrl.innerText = element.url;
    //creacion de switch
    let colSwitchDiv = document.createElement("div");
    colSwitchDiv.classList.add("form-check");
    colSwitchDiv.classList.add("form-switch");
    let colSwitchInput = document.createElement("input");
    colSwitchInput.classList.add("form-check-input");
    colSwitchInput.setAttribute("type", "checkbox");
    colSwitchInput.setAttribute("role", "switch");
    colSwitchInput.setAttribute("id", "switch" + index);
    if (element.status) {
      colSwitchInput.setAttribute("checked", "");
    }
    colSwitchInput.onclick = () => detectStatus("switch" + index, index);
    colSwitchDiv.append(colSwitchInput);
    colStatus.append(colSwitchDiv);
    colAcciones.append(colAccionEditar);
    colAcciones.append(colAccionEliminar);
    tr.append(colNombre);
    tr.append(colUrl);
    tr.append(colStatus);
    tr.append(colAcciones);
    newTbody.append(tr);
  }
};

Promise.resolve(GET("/partner")).then((x) => {
  getData(x);
  console.log(arrayData);
  document.querySelector("#spinner").style.display = "none";
  document.querySelector("#main").style.display = "block";
  if (arrayData.length !== 0) {
    document.querySelector("#msjRegister").style.visibility = "hidden";
  } else {
    document.querySelector("#msjRegister").style.visibility = "visible";
  }
});

//Funciones

function eliminar(index) {
  Promise.resolve(DELETE(`/partner/${arrayData[index].id}`)).then((resp) => {
    console.log(resp);
    document.querySelector("#headerToast").classList.remove("bg-success");
    document.querySelector("#headerToast").classList.add("bg-danger");
    document.querySelector("#headerToast").classList.add("text-white");
    document.querySelector("#textToast").innerText =
      "Partner eliminado exitosamente";
    document.querySelector("#liveToastBtn").click();
    Promise.resolve(GET("/partner")).then((x) => {
      getData(x);
      console.log(arrayData);
      document.querySelector("#spinner").style.display = "none";
      document.querySelector("#main").style.display = "block";
      if (arrayData.length !== 0) {
        document.querySelector("#msjRegister").style.visibility = "hidden";
      } else {
        document.querySelector("#msjRegister").style.visibility = "visible";
      }
    });
  });
}

function editar(index) {
  console.log(arrayData[index]);
  document.querySelector("#editNamepartner").value =
    arrayData[index].namepartner;
  document.querySelector("#editUrl").value = arrayData[index].url;
  document.querySelector("#editPartnerKey").value = arrayData[index].nameskey;
  document.querySelector("#editIdtag").value = arrayData[index].config.id_menu;
  document.querySelector("#editChannelid").value = arrayData[index].channelid;
  document.querySelector("#editIdLogin").checked =
    arrayData[index].config.login;
  document.querySelector("#editIdGoogle").value =
    arrayData[index].config.google_secret_id;
  document.querySelector("#editIdGoogle").removeAttribute("disabled");
  document.querySelector("#editGoogleCheckbox").checked = false;
  document.querySelector("#editIdFacebook").value =
    arrayData[index].config.facebook_client_id;

  document.querySelector("#editIdSecretFacebook").value =
    arrayData[index].config.facebook_secret_id;
  document.querySelector("#editIdSecretFacebook").removeAttribute("disabled");
  document.querySelector("#editIdFacebook").removeAttribute("disabled");
  document.getElementById("editFacebookCheckbox").checked = false;
  document.querySelector("#editLoginAnonimo").checked =
    arrayData[index].config.login_anonymous;
  document.querySelector("#editStatus").checked = arrayData[index].status;
  document.querySelector("#editarLink").value =
    arrayData[index].config.url_terminos.slice(8);
  document.querySelector("#index").value = index;
  temp = arrayData[index].nameskey;
  tempChanel = arrayData[index].channelid;
}

function detectStatus(id, index) {
  let status = document.getElementById(id);
  console.log(status.checked);
  arrayData[index].status = status.checked;
  const body = { status: status.checked };
  Promise.resolve(POST(`/partner/status/${arrayData[index].id}`, body)).then(
    (resp) => {
      console.log(resp);
      Promise.resolve(GET("/partner")).then(getData);
    }
  );
}

function editarPartner() {
  const id = document.querySelector("#index").value;
  arrayData[id].namepartner = document.querySelector("#editNamepartner").value;
  arrayData[id].url = document.querySelector("#editUrl").value;
  arrayData[id].nameskey = document.querySelector("#editPartnerKey").value;
  arrayData[id].config.id_menu = document.querySelector("#editIdtag").value;
  arrayData[id].channelid = document.querySelector("#editChannelid").value;
  arrayData[id].config.login = document.querySelector("#editIdLogin").checked;
  arrayData[id].config.google_secret_id = document.querySelector(
    "#editIdGoogle"
  ).value
    ? document.querySelector("#editIdGoogle").value
    : null;
  arrayData[id].config.facebook_client_id = document.querySelector(
    "#editIdFacebook"
  ).value
    ? document.querySelector("#editIdFacebook").value
    : null;
  arrayData[id].config.facebook_secret_id = document.querySelector(
    "#editIdSecretFacebook"
  ).value
    ? document.querySelector("#editIdSecretFacebook").value
    : null;
  arrayData[id].config.login_anonymous =
    document.querySelector("#editLoginAnonimo").checked;
  arrayData[id].status = document.querySelector("#editStatus").checked;

  if (document.querySelector("#editarLink").value.includes("https://")) {
    arrayData[id].config.url_terminos =
      document.querySelector("#editarLink").value;
  } else {
    arrayData[id].config.url_terminos =
      "https://" + document.querySelector("#editarLink").value;
  }

  Promise.resolve(
    POST(`/partner/update/${arrayData[id].id}`, arrayData[id])
  ).then((resp) => {
    console.log(resp);

    document.querySelector("#headerToast").classList.remove("bg-danger");
    document.querySelector("#headerToast").classList.add("bg-success");
    document.querySelector("#headerToast").classList.add("text-white");
    document.querySelector("#textToast").innerText =
      "Los datos se han actualizado con éxito";
    document.querySelector("#liveToastBtn").click();

    Promise.resolve(GET("/partner")).then(getData);
  });
}

function createPartner() {
  let nameskey = document.querySelector("#unique").value;
  let namepartner = document.querySelector("#newNamePartner").value;
  let status = document.querySelector("#status").checked;
  let url = document.querySelector("#newUrl").value;
  let channelId = document.querySelector("#channelId").value;
  let config = {
    id_menu: document.querySelector("#idTag").value,
    google_secret_id: document.querySelector("#idGoogle").value
      ? document.querySelector("#idGoogle").value
      : null,
    facebook_client_id: document.querySelector("#idFacebook").value
      ? document.querySelector("#idFacebook").value
      : null,
    facebook_secret_id: document.querySelector("#IdSecretFacebook").value
      ? document.querySelector("#IdSecretFacebook").value
      : null,
    login_anonymous: document.querySelector("#loginAnonimo").checked,
    login: document.querySelector("#login").checked,
    url_terminos: "https://" + document.querySelector("#link").value,
  };

  let body = {
    nameskey: nameskey,
    namepartner: namepartner,
    status: status,
    url: url,
    channelid: parseInt(channelId),
    config: config,
  };

  Promise.resolve(GET(`/partner/validate-nameskey/${nameskey}`)).then(
    (resp) => {
      if (resp.data.exist !== true) {
        document.querySelector("#headerToast").classList.remove("bg-danger");
        document.querySelector("#headerToast").classList.add("bg-success");
        document.querySelector("#headerToast").classList.add("text-white");
        document.querySelector("#textToast").innerText =
          "Partner crerado con éxito";
        document.querySelector("#liveToastBtn").click();
        Promise.resolve(POST(`/partner`, body)).then((resp) => {
          resetField();
          Promise.resolve(GET("/partner")).then((x) => {
            getData(x);
            document.querySelector("#msjRegister").style.visibility = "hidden";
          });
        });
      }
    }
  );
}

function detecFields(action) {
  if (action === "crear") {
    let newNamePartner = document.querySelector("#newNamePartner").value;
    let newUrl = document.querySelector("#newUrl").value;
    let idTag = document.querySelector("#idTag").value;
    let channelId = document.querySelector("#channelId").value;
    let idGoogle = document.querySelector("#idGoogle").value;
    let idFacebook = document.querySelector("#idFacebook").value;
    let idSecretFacebook = document.querySelector("#IdSecretFacebook").value;
    let unique = document.querySelector("#unique").value;
    let link = document.querySelector("#link").value;

    if (!disabledFacebook && !disabledGoogle) {
      if (
        newNamePartner.length === 0 ||
        newUrl.length === 0 ||
        idTag.length === 0 ||
        channelId.length === 0 ||
        unique.length === 0 ||
        idGoogle.length === 0 ||
        idFacebook.length === 0 ||
        idSecretFacebook.length === 0 ||
        link.length === 0 ||
        validTest === false ||
        (changedPartnerKey && changedNumberChanel)
      ) {
        document.querySelector("#savePartner").setAttribute("disabled", "");
      } else {
        document.querySelector("#savePartner").removeAttribute("disabled");
      }
    }

    if (disabledFacebook && disabledGoogle) {
      if (
        newNamePartner.length === 0 ||
        newUrl.length === 0 ||
        idTag.length === 0 ||
        channelId.length === 0 ||
        unique.length === 0 ||
        link.length === 0 ||
        validTest === false ||
        (changedPartnerKey && changedNumberChanel)
      ) {
        document.querySelector("#savePartner").setAttribute("disabled", "");
      } else {
        document.querySelector("#savePartner").removeAttribute("disabled");
      }
    }

    if (disabledGoogle) {
      if (
        newNamePartner.length === 0 ||
        newUrl.length === 0 ||
        idTag.length === 0 ||
        channelId.length === 0 ||
        unique.length === 0 ||
        idFacebook.length === 0 ||
        idSecretFacebook.length === 0 ||
        link.length === 0 ||
        validTest === false ||
        (changedPartnerKey && changedNumberChanel)
      ) {
        document.querySelector("#savePartner").setAttribute("disabled", "");
      } else {
        document.querySelector("#savePartner").removeAttribute("disabled");
      }
    }

    if (disabledFacebook) {
      if (
        newNamePartner.length === 0 ||
        newUrl.length === 0 ||
        idTag.length === 0 ||
        channelId.length === 0 ||
        unique.length === 0 ||
        idGoogle.length === 0 ||
        link.length === 0 ||
        validTest === false ||
        (changedPartnerKey && changedNumberChanel)
      ) {
        document.querySelector("#savePartner").setAttribute("disabled", "");
      } else {
        document.querySelector("#savePartner").removeAttribute("disabled");
      }
    }
  }

  if (action === "editar") {
    let editNamepartner = document.querySelector("#editNamepartner").value;
    let editUrl = document.querySelector("#editUrl").value;
    let editIdtag = document.querySelector("#editIdtag").value;
    let editChannelid = document.querySelector("#editChannelid").value;
    let editIdGoogle = document.querySelector("#editIdGoogle").value;
    let editIdFacebook = document.querySelector("#editIdFacebook").value;
    let editIdSecretFacebook = document.querySelector(
      "#editIdSecretFacebook"
    ).value;
    let editarLink = document.querySelector("#editarLink").value;
    let editPartnerKey = document.querySelector("#editPartnerKey").value;

    if (!disabledFacebook && !disabledGoogle) {
      if (
        editNamepartner.length === 0 ||
        editUrl.length === 0 ||
        editIdtag.length === 0 ||
        editChannelid.length === 0 ||
        editPartnerKey.length === 0 ||
        editIdGoogle.length === 0 ||
        editIdFacebook.length === 0 ||
        editIdSecretFacebook.length === 0 ||
        editarLink.length === 0 ||
        validTest2 === false ||
        changedPartnerKey ||
        changedNumberChanel
      ) {
        document.querySelector("#editPartner").setAttribute("disabled", "");
      } else {
        document.querySelector("#editPartner").removeAttribute("disabled");
      }
    }

    if (disabledFacebook && disabledGoogle) {
      if (
        editNamepartner.length === 0 ||
        editUrl.length === 0 ||
        editIdtag.length === 0 ||
        editChannelid.length === 0 ||
        editPartnerKey.length === 0 ||
        editarLink.length === 0 ||
        validTest2 === false ||
        changedPartnerKey ||
        changedNumberChanel
      ) {
        document.querySelector("#editPartner").setAttribute("disabled", "");
      } else {
        document.querySelector("#editPartner").removeAttribute("disabled");
      }
    }

    if (disabledGoogle) {
      if (
        editNamepartner.length === 0 ||
        editUrl.length === 0 ||
        editIdtag.length === 0 ||
        editChannelid.length === 0 ||
        editPartnerKey.length === 0 ||
        editIdFacebook.length === 0 ||
        editIdSecretFacebook.length === 0 ||
        editarLink.length === 0 ||
        validTest2 === false ||
        changedPartnerKey ||
        changedNumberChanel
      ) {
        document.querySelector("#editPartner").setAttribute("disabled", "");
      } else {
        document.querySelector("#editPartner").removeAttribute("disabled");
      }
    }

    if (disabledFacebook) {
      if (
        editNamepartner.length === 0 ||
        editUrl.length === 0 ||
        editIdtag.length === 0 ||
        editChannelid.length === 0 ||
        editPartnerKey.length === 0 ||
        editIdGoogle.length === 0 ||
        editarLink.length === 0 ||
        validTest2 === false ||
        changedPartnerKey ||
        changedNumberChanel
      ) {
        document.querySelector("#editPartner").setAttribute("disabled", "");
      } else {
        document.querySelector("#editPartner").removeAttribute("disabled");
      }
    }
  }
}
function focusOut(action) {
  setValidKey(false);
  if (action === "crear") detecPartnerKey(action);
  if (action === "editar") detecPartnerKey(action);
}
function resetField() {
  document.querySelector("#newNamePartner").value = "";
  document.querySelector("#newUrl").value = "";
  document.querySelector("#unique").value = "";
  document.querySelector("#idTag").value = "";
  document.querySelector("#channelId").value = "";
  document.querySelector("#idGoogle").value = "";
  document.querySelector("#idFacebook").value = "";
  document.querySelector("#link").value = "";
  document.querySelector("#login").checked = false;
  document.querySelector("#loginAnonimo").checked = false;
  document.querySelector("#status").checked = true;
  document.querySelector("#savePartner").setAttribute("disabled", "");
  document.querySelector("#editPartner").removeAttribute("disabled");
  document.querySelector("#msjError").innerText = "";
  document.querySelector("#msjErrorEdit").innerText = "";
  document.querySelector("#msjErrorCanal").innerText = "";
  document.querySelector("#msjErrorEditCanal").innerText = "";
  disabledFacebook = false;
  disabledGoogle = false;
}

function setValidKey(value) {
  changedPartnerKey = value;
  changedNumberChanel = value;
}

function detecPartnerKey(action) {
  var nameskey;
  var numberChanel;
  if (action === "crear") {
    nameskey = document.querySelector("#unique").value;
    Promise.resolve(GET(`/partner/validate-nameskey/${nameskey}`)).then(
      (resp) => {
        if (resp.data.exist === true) {
          document.querySelector("#msjError").innerText =
            "Este PartnerKey ya existe";
          document.querySelector("#msjErrorEdit").innerText =
            "Este PartnerKey ya existe";
          validTest = false;
          validTest2 = false;
          detecFields(action);
        } else {
          document.querySelector("#msjError").innerText = "";
          document.querySelector("#msjErrorEdit").innerText = "";
          validTest = true;
          validTest2 = true;
          detecFields(action);
        }
      }
    );

    numberChanel = document.querySelector("#channelId").value;
    Promise.resolve(GET(`/partner/validate-channel/${numberChanel}`)).then(
      (resp) => {
        if (resp.data.valid === false) {
          document.querySelector("#msjErrorCanal").innerText =
            "El channel ingresado no existe";
          document.querySelector("#msjErrorEditCanal").innerText =
            "El channel ingresado no existe";
          validTest = false;
          validTest2 = false;
          detecFields(action);
        } else {
          document.querySelector("#msjErrorCanal").innerText = "";
          document.querySelector("#msjErrorEditCanal").innerText = "";
          validTest = true;
          validTest2 = true;
          detecFields(action);
        }
      }
    );
  }
  if (action === "editar") {
    nameskey = document.querySelector("#editPartnerKey").value;

    if (temp !== nameskey) {
      Promise.resolve(GET(`/partner/validate-nameskey/${nameskey}`)).then(
        (resp) => {
          if (resp.data.exist === true) {
            document.querySelector("#msjError").innerText =
              "Este PartnerKey ya existe";
            document.querySelector("#msjErrorEdit").innerText =
              "Este PartnerKey ya existe";
            validTest = false;
            validTest2 = false;
            detecFields(action);
          } else {
            document.querySelector("#msjError").innerText = "";
            document.querySelector("#msjErrorEdit").innerText = "";
            validTest = true;
            validTest2 = true;
            detecFields(action);
          }
        }
      );
    } else {
      document.querySelector("#msjError").innerText = "";
      document.querySelector("#msjErrorEdit").innerText = "";
      validTest = true;
      validTest2 = true;
      detecFields(action);
    }

    channelId = document.querySelector("#editChannelid").value;
    if (tempChanel !== channelId) {
      Promise.resolve(GET(`/partner/validate-channel/${channelId}`)).then(
        (resp) => {
          if (resp.data.valid === false) {
            document.querySelector("#msjErrorCanal").innerText =
              "El channel ingresado no existe";
            document.querySelector("#msjErrorEditCanal").innerText =
              "El channel ingresado no existe";
            validTest = false;
            validTest2 = false;
            tempChanel = channelId;
            detecFields(action);
          } else {
            document.querySelector("#msjErrorCanal").innerText = "";
            document.querySelector("#msjErrorEditCanal").innerText = "";
            validTest = true;
            validTest2 = true;
            detecFields(action);
          }
        }
      );
    } else {
      document.querySelector("#msjError").innerText = "";
      document.querySelector("#msjErrorEdit").innerText = "";
      validTest = true;
      validTest2 = true;
      detecFields(action);
    }
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../index.html";
}

//campo de pruebas

function disabledCheckGoogle(action) {
  disabledGoogle = !disabledGoogle;
  detecFields(action);
}

function disabledCheckFacebook(action) {
  disabledFacebook = !disabledFacebook;
  detecFields(action);
}

var myModalCreate = document.getElementById("createModal");
myModalCreate.addEventListener("hidden.bs.modal", function (event) {
  resetField();
});

myModalCreate.addEventListener("shown.bs.modal", function (event) {
  document.querySelector("#googleCheckbox").checked = false;
  document.querySelector("#idGoogle").removeAttribute("disabled");

  document.getElementById("facebookCheckbox").checked = false;
  document.querySelector("#IdSecretFacebook").removeAttribute("disabled");
  document.querySelector("#idFacebook").removeAttribute("disabled");
});

var myModalEdit = document.getElementById("exampleModal");
myModalEdit.addEventListener("hidden.bs.modal", function (event) {
  resetField();
});

//GOOGLE ID

var googleId = document.getElementById("googleCheckbox");

googleId.addEventListener("change", validGoogleCheckbox, false);
function validGoogleCheckbox() {
  var checked = googleId.checked;
  if (checked) {
    disabledGoogle = true;
    document.querySelector("#googleHidden").classList.add("hidden");
    document.querySelector("#idGoogle").value = "";
    document.querySelector("#idGoogle").setAttribute("disabled", "");

    let newNamePartner = document.querySelector("#newNamePartner").value;
    let newUrl = document.querySelector("#newUrl").value;
    let idTag = document.querySelector("#idTag").value;
    let channelId = document.querySelector("#channelId").value;
    let idFacebook = document.querySelector("#idFacebook").value;
    let idSecretFacebook = document.querySelector("#IdSecretFacebook").value;
    let unique = document.querySelector("#unique").value;
    let link = document.querySelector("#link").value;

    if (
      newNamePartner.length === 0 ||
      newUrl.length === 0 ||
      idTag.length === 0 ||
      channelId.length === 0 ||
      unique.length === 0 ||
      idFacebook.length === 0 ||
      idSecretFacebook.length === 0 ||
      link.length === 0 ||
      validTest === false ||
      (changedPartnerKey && changedNumberChanel)
    ) {
      document.querySelector("#savePartner").setAttribute("disabled", "");
    } else {
      document.querySelector("#savePartner").removeAttribute("disabled");
    }

    //evaluar ambos
    if (disabledFacebook && disabledGoogle) {
      let newNamePartner = document.querySelector("#newNamePartner").value;
      let newUrl = document.querySelector("#newUrl").value;
      let idTag = document.querySelector("#idTag").value;
      let channelId = document.querySelector("#channelId").value;
      let unique = document.querySelector("#unique").value;
      let link = document.querySelector("#link").value;

      if (
        newNamePartner.length === 0 ||
        newUrl.length === 0 ||
        idTag.length === 0 ||
        channelId.length === 0 ||
        unique.length === 0 ||
        link.length === 0 ||
        validTest === false ||
        (changedPartnerKey && changedNumberChanel)
      ) {
        document.querySelector("#savePartner").setAttribute("disabled", "");
      } else {
        document.querySelector("#savePartner").removeAttribute("disabled");
      }
    }
  } else {
    document.querySelector("#googleHidden").classList.remove("hidden");
    disabledGoogle = false;
    document.querySelector("#idGoogle").removeAttribute("disabled");
  }
}

var editGoogleId = document.getElementById("editGoogleCheckbox");

editGoogleId.addEventListener("change", validEditGoogleCheckbox, false);
function validEditGoogleCheckbox() {
  var checked = editGoogleId.checked;
  if (checked) {
    document.querySelector("#editGoogleHidden").classList.add("hidden");
    document.querySelector("#editIdGoogle").value = "";
    document.querySelector("#editIdGoogle").setAttribute("disabled", "");
  } else {
    document.querySelector("#editGoogleHidden").classList.remove("hidden");
    document.querySelector("#editIdGoogle").removeAttribute("disabled");
  }
}

//FACEBOOK ID

var facebookId = document.getElementById("facebookCheckbox");

facebookId.addEventListener("change", validFacebookCheckbox, false);
function validFacebookCheckbox() {
  var checked = facebookId.checked;
  if (checked) {
    disabledFacebook = true;
    secretFacebookHidden;
    document.querySelector("#secretFacebookHidden").classList.add("hidden");
    document.querySelector("#facebookHidden").classList.add("hidden");
    document.querySelector("#IdSecretFacebook").value = "";
    document.querySelector("#IdSecretFacebook").setAttribute("disabled", "");
    document.querySelector("#idFacebook").value = "";
    document.querySelector("#idFacebook").setAttribute("disabled", "");

    let newNamePartner = document.querySelector("#newNamePartner").value;
    let newUrl = document.querySelector("#newUrl").value;
    let idTag = document.querySelector("#idTag").value;
    let channelId = document.querySelector("#channelId").value;
    let idGoogle = document.querySelector("#idGoogle").value;
    let unique = document.querySelector("#unique").value;
    let link = document.querySelector("#link").value;

    if (
      newNamePartner.length === 0 ||
      newUrl.length === 0 ||
      idTag.length === 0 ||
      channelId.length === 0 ||
      unique.length === 0 ||
      idGoogle.length === 0 ||
      link.length === 0 ||
      validTest === false ||
      (changedPartnerKey && changedNumberChanel)
    ) {
      document.querySelector("#savePartner").setAttribute("disabled", "");
    } else {
      document.querySelector("#savePartner").removeAttribute("disabled");
    }

    //evaluar ambos
    if (disabledFacebook && disabledGoogle) {
      let newNamePartner = document.querySelector("#newNamePartner").value;
      let newUrl = document.querySelector("#newUrl").value;
      let idTag = document.querySelector("#idTag").value;
      let channelId = document.querySelector("#channelId").value;
      let unique = document.querySelector("#unique").value;
      let link = document.querySelector("#link").value;

      if (
        newNamePartner.length === 0 ||
        newUrl.length === 0 ||
        idTag.length === 0 ||
        channelId.length === 0 ||
        unique.length === 0 ||
        link.length === 0 ||
        validTest === false ||
        (changedPartnerKey && changedNumberChanel)
      ) {
        document.querySelector("#savePartner").setAttribute("disabled", "");
      } else {
        document.querySelector("#savePartner").removeAttribute("disabled");
      }
    }
  } else {
    disabledFacebook = false;
    document.querySelector("#facebookHidden").classList.remove("hidden");
    document.querySelector("#secretFacebookHidden").classList.remove("hidden");
    document.querySelector("#IdSecretFacebook").removeAttribute("disabled");
    document.querySelector("#idFacebook").removeAttribute("disabled");
  }
}

var editFacebookId = document.getElementById("editFacebookCheckbox");

editFacebookId.addEventListener("change", validaEditFacebookCheckbox, false);
function validaEditFacebookCheckbox() {
  var checked = editFacebookId.checked;
  if (checked) {
    editSecretFacebookHidden;
    document.querySelector("#editSecretFacebookHidden").classList.add("hidden");
    document.querySelector("#editFacebookHidden").classList.add("hidden");
    document.querySelector("#editIdSecretFacebook").value = "";
    document
      .querySelector("#editIdSecretFacebook")
      .setAttribute("disabled", "");
    document.querySelector("#editIdFacebook").value = "";
    document.querySelector("#editIdFacebook").setAttribute("disabled", "");

    let editNamepartner = document.querySelector("#editNamepartner").value;
    let editUrl = document.querySelector("#editUrl").value;
    let editIdtag = document.querySelector("#editIdtag").value;
    let editChannelid = document.querySelector("#editChannelid").value;
    let editarLink = document.querySelector("#editarLink").value;
    let editPartnerKey = document.querySelector("#editPartnerKey").value;

    if (disabledFacebook && disabledGoogle) {
      if (
        editNamepartner.length === 0 ||
        editUrl.length === 0 ||
        editIdtag.length === 0 ||
        editChannelid.length === 0 ||
        editPartnerKey.length === 0 ||
        editarLink.length === 0 ||
        validTest2 === false ||
        changedPartnerKey ||
        changedNumberChanel
      ) {
        document.querySelector("#editPartner").setAttribute("disabled", "");
      } else {
        document.querySelector("#editPartner").removeAttribute("disabled");
      }
    }
  } else {
    document
      .querySelector("#editSecretFacebookHidden")
      .classList.remove("hidden");
    document.querySelector("#editFacebookHidden").classList.remove("hidden");
    document.querySelector("#editIdSecretFacebook").removeAttribute("disabled");
    document.querySelector("#editIdFacebook").removeAttribute("disabled");
  }
}

//Muestra el toast

document.addEventListener("DOMContentLoaded", function () {
  var toastTrigger = document.getElementById("liveToastBtn");
  var toastLiveExample = document.getElementById("liveToast");
  if (toastTrigger) {
    toastTrigger.addEventListener("click", function () {
      var toast = new bootstrap.Toast(toastLiveExample);
      toast.show();
    });
  }
});
