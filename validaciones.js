document.getElementById("formRegistro").addEventListener("submit", function(e) {
    e.preventDefault();
  
    let nombre = document.getElementById("nombre").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let mensaje = document.getElementById("mensaje");
  
    if (nombre === "" || email === "" || password === "") {
      mensaje.textContent = "Todos los campos son obligatorios.";
      mensaje.style.color = "red";
      return;
    }
  
    if (!email.includes("@")) {
      mensaje.textContent = "El correo no es válido.";
      mensaje.style.color = "red";
      return;
    }
  
    if (password.length < 6) {
      mensaje.textContent = "La contraseña debe tener al menos 6 caracteres.";
      mensaje.style.color = "red";
      return;
    }
  
    mensaje.textContent = "¡Registro exitoso!";
    mensaje.style.color = "green";
  });
  