const mailFormat =
  "([a-z0-9._%+-]|[A-Z0-9._%+-])+@([a-z0-9._%+-]|[A-Z0-9._%+-])+.([a-z]|[A-Z]){2,4}$";

const baseUrl = "https://qn7ubxj566.execute-api.us-east-1.amazonaws.com/dev";
const apiKey = localStorage.getItem("token");

if (apiKey) {
  window.location.href = "admiTvazteca/index.html";
}

document.querySelector("#spinner").style.display = "none";

function login(e) {
  e.preventDefault();
  let emailValue = document.querySelector("#email").value;
  let passwordValue = document.querySelector("#password").value;

  if (emailValue.match(mailFormat)) {
    // alert("formato correcto");
    document.querySelector(".hidden").style.visibility = "hidden";
    document.querySelector("#spinner").style.display = "none";

    let body = {
      email: emailValue.toLowerCase(),
      password: passwordValue,
    };

    Promise.resolve(POST(`/partner/login`, body)).then((resp) => {
      console.log(resp);
      if (resp.data.login) {
        localStorage.setItem("token", resp.data.token);
        window.location.href = "admiTvazteca/index.html";
      } else {
        document.querySelector("#errorLogin").style.visibility = "visible";
        document.querySelector("#spinner").style.display = "none";
      }
    });
  } else {
    console.log("correo no valido");
    document.querySelector(".hidden").style.visibility = "visible";
    document.querySelector("#spinner").style.display = "none";
    document.querySelector("#email").focus();
  }
}

async function POST(url, body) {
  document.querySelector("#spinner").style.display = "block";
  document.querySelector("#errorLogin").style.visibility = "hidden";
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
