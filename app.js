// =======================
// GUARDAR / CARGAR USUARIOS
// =======================
function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem('usuarios') || '[]');
}
function guardarUsuarios(usuarios) {
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// =======================
// VALIDACIONES
// =======================
const regexNombre = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{1,50}$/;
const regexCorreoDuoc = /^[\w.-]+@duoc\.cl$/i;
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
const regexTelefono = /^$|^[+\d][\d\s()-]{7,}$/;

// =======================
// NAV
// =======================
function actualizarNav() {
  const haySesion = !!localStorage.getItem('usuarioActual');
  const linkRegistro = document.getElementById('linkRegistro');
  const linkLogin = document.getElementById('linkLogin');
  const linkMisMascotas = document.getElementById('linkMisMascotas');
  const linkSalir = document.getElementById('linkSalir');

  if (linkRegistro) linkRegistro.classList.toggle('hidden', haySesion);
  if (linkLogin) linkLogin.classList.toggle('hidden', haySesion);
  if (linkMisMascotas) linkMisMascotas.classList.toggle('hidden', !haySesion);
  if (linkSalir) linkSalir.classList.toggle('hidden', !haySesion);
}

// =======================
// REGISTRO DE MASCOTAS (dinámico)
// =======================
function agregarFilaMascota(tipoDefecto = '', nombreDefecto = '') {
  const contenedor = document.getElementById('listaMascotas');
  if (!contenedor) return;

  const fila = document.createElement('div');
  fila.className = 'rowMascota';
  fila.innerHTML = `
    <div>
      <label>Tipo</label>
      <select class="tipoMascota" required>
        <option value="">Seleccionar...</option>
        <option value="Gato">Gato</option>
        <option value="Perro">Perro</option>
        <option value="Ave">Ave</option>
        <option value="Otro">Otro</option>
      </select>
    </div>
    <div>
      <label>Nombre mascota</label>
      <input type="text" class="nombreMascota" maxlength="50" required placeholder="Ej: Chispa">
      <div class="error mascotaError"></div>
    </div>
    <button type="button" class="btn remover">Eliminar</button>
  `;

  contenedor.appendChild(fila);

  if (tipoDefecto) fila.querySelector('.tipoMascota').value = tipoDefecto;
  if (nombreDefecto) fila.querySelector('.nombreMascota').value = nombreDefecto;

  fila.querySelector('.remover').addEventListener('click', () => fila.remove());
}


// =======================
// HELPERS Mis Mascotas
// =======================
function obtenerUsuarioActual() {
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  let correoActual = localStorage.getItem('usuarioActual');

  // Si no hay usuarioActual, se puede usar el ultimo registrado (comportamiento demo)
  // if (!correoActual && usuarios.length > 0) {
  //   correoActual = usuarios[usuarios.length - 1].correo;
  //   localStorage.setItem('usuarioActual', correoActual);
  // }
  if (!correoActual) return null;

  const usuario = usuarios.find(u => u.correo?.toLowerCase() === correoActual.toLowerCase());
  return usuario || null;
}

function pintarFila(tipo = '', nombre = '') {
  if (typeof agregarFilaMascota === 'function') {
    agregarFilaMascota(tipo, nombre);
  } else {
    const cont = document.getElementById('listaMascotas');
    if (!cont) return;
    const fila = document.createElement('div');
    fila.className = 'rowMascota';
    fila.innerHTML = `
      <div>
        <label>Tipo</label>
        <select class="tipoMascota" required>
          <option value="">Seleccionar...</option>
          <option value="Gato">Gato</option>
          <option value="Perro">Perro</option>
          <option value="Ave">Ave</option>
          <option value="Otro">Otro</option>
        </select>
      </div>
      <div>
        <label>Nombre mascota</label>
        <input type="text" class="nombreMascota" maxlength="50" required placeholder="Ej: Chispa">
        <div class="error mascotaError"></div>
      </div>
      <button type="button" class="btn remover">Eliminar</button>
    `;
    cont.appendChild(fila);
    if (tipo) fila.querySelector('.tipoMascota').value = tipo;
    if (nombre) fila.querySelector('.nombreMascota').value = nombre;
    fila.querySelector('.remover').addEventListener('click', () => fila.remove());
  }
}

function leerMascotasDePantalla() {
  const filas = Array.from(document.querySelectorAll('.rowMascota'));
  const mascotas = [];
  for (const f of filas) {
    const tipo = f.querySelector('.tipoMascota')?.value || '';
    const nombre = (f.querySelector('.nombreMascota')?.value || '').trim();
    if (tipo && nombre) mascotas.push({ tipo, nombre });
  }
  return mascotas;
}

function guardarCambiosMascotas() {
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const correoActual = localStorage.getItem('usuarioActual');
  if (!correoActual) return false;

  const idx = usuarios.findIndex(u => u.correo?.toLowerCase() === correoActual.toLowerCase());
  if (idx === -1) return false;

  usuarios[idx].mascotas = leerMascotasDePantalla();
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  return true;
}

// =======================
// INICIALIZACIÓN GLOBAL
// =======================
document.addEventListener('DOMContentLoaded', () => {
  actualizarNav();

  // --- Boton "Salir"  ---
  const linkSalir = document.getElementById('linkSalir');
  if (linkSalir) {
    linkSalir.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('usuarioActual');
      actualizarNav();
      window.location.href = 'index.html';
    });
  }

  // =======================
  // REGISTRO
  // =======================
  const btnAgregarMascota = document.getElementById('btnAgregarMascota');
  if (btnAgregarMascota) {
    btnAgregarMascota.addEventListener('click', () => agregarFilaMascota());
    if (!document.querySelector('.rowMascota')) agregarFilaMascota();
  }

  const formRegistro = document.getElementById('formRegistro');
  if (formRegistro) {
    formRegistro.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = document.getElementById('nombreCompleto').value.trim();
      const correo = document.getElementById('correo').value.trim();
      const pass = document.getElementById('password').value;
      const confirm = document.getElementById('confirmPassword').value;
      const telefono = document.getElementById('telefono').value.trim();

      ['errNombre','errCorreo','errPass','errConfirm','errTelefono']
        .forEach(id => { const el = document.getElementById(id); if (el) el.textContent = ''; });
      const msg = document.getElementById('mensaje');
      if (msg) msg.textContent = '';

      let ok = true;

      if (!regexNombre.test(nombre)) {
        const el = document.getElementById('errNombre');
        if (el) el.textContent = 'El nombre solo puede contener letras y espacios (máx. 50).';
        ok = false;
      }

      if (!regexCorreoDuoc.test(correo)) {
        const el = document.getElementById('errCorreo');
        if (el) el.textContent = 'El correo debe ser válido y terminar en @duoc.cl.';
        ok = false;
      } else {
        const usuarios = obtenerUsuarios();
        if (usuarios.some(u => u.correo.toLowerCase() === correo.toLowerCase())) {
          const el = document.getElementById('errCorreo');
          if (el) el.textContent = 'Este correo ya está registrado (debe ser único).';
          ok = false;
        }
      }

      if (!regexPassword.test(pass)) {
        const el = document.getElementById('errPass');
        if (el) el.textContent = 'La contraseña requiere 8+ caracteres con mayúscula, minúscula, número y símbolo.';
        ok = false;
      }

      if (confirm !== pass) {
        const el = document.getElementById('errConfirm');
        if (el) el.textContent = 'Las contraseñas no coinciden.';
        ok = false;
      }

      if (!regexTelefono.test(telefono)) {
        const el = document.getElementById('errTelefono');
        if (el) el.textContent = 'Ingrese un teléfono válido o deje el campo vacío.';
        ok = false;
      }

      // Mascotas
      const filas = Array.from(document.querySelectorAll('.rowMascota'));
      const mascotas = [];
      for (const f of filas) {
        const tipo = f.querySelector('.tipoMascota').value;
        const nom = f.querySelector('.nombreMascota').value.trim();
        const err = f.querySelector('.mascotaError');
        if (err) err.textContent = '';

        if (!tipo) { if (err) err.textContent = 'Tipo de mascota es obligatorio.'; ok = false; }
        if (!nom || nom.length > 50) { if (err) err.textContent = 'Nombre es obligatorio (máx. 50).'; ok = false; }

        mascotas.push({ tipo, nombre: nom });
      }

      if (!ok) return;

      const nuevoUsuario = { nombre, correo, pass, telefono, mascotas };
      const usuarios = obtenerUsuarios();
      usuarios.push(nuevoUsuario);
      guardarUsuarios(usuarios);

      if (msg) {
        msg.className = 'success';
        msg.textContent = '¡Registro exitoso! Ya podés iniciar sesión.';
      }
      formRegistro.reset();
      const cont = document.getElementById('listaMascotas');
      if (cont) cont.innerHTML = '';
      agregarFilaMascota();
    });
  }

  // =======================
  // LOGIN 
  // =======================
  const formLogin = document.getElementById('formLogin');
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();

      const correo = document.getElementById('correoLogin').value.trim();
      const pass = document.getElementById('passwordLogin').value;
      const msg = document.getElementById('mensajeLogin');

      const errCorreoEl = document.getElementById('errCorreoLogin');
      const errPassEl = document.getElementById('errPassLogin');

      if (errCorreoEl) errCorreoEl.textContent = '';
      if (errPassEl) errPassEl.textContent = '';
      if (msg) { msg.textContent = ''; msg.className = 'error'; }

      if (!regexCorreoDuoc.test(correo)) {
        if (errCorreoEl) errCorreoEl.textContent = 'Correo inválido. Debe terminar en @duoc.cl.';
        return;
      }
      if (!pass) {
        if (errPassEl) errPassEl.textContent = 'Ingrese su contraseña.';
        return;
      }

      const usuarios = obtenerUsuarios();
      const usuario = usuarios.find(u => u.correo.toLowerCase() === correo.toLowerCase());

      if (!usuario) {
        if (msg) msg.textContent = 'Usuario no encontrado. Verificá el correo o registrate.';
        return;
      }
      if (usuario.pass !== pass) {
        if (msg) msg.textContent = 'Contraseña incorrecta. Intente nuevamente o use recuperar.';
        return;
      }

      // Guardar sesión y redirigir a Mis Mascotas
      localStorage.setItem('usuarioActual', correo);
      if (msg) { msg.className = 'success'; msg.textContent = '¡Bienvenido/a, ' + usuario.nombre + '!'; }
      actualizarNav();
      window.location.href = 'misMascotas.html';
    });

    // Recuperar
    const enlaceRecuperar = document.getElementById('recuperar');
    if (enlaceRecuperar) {
      enlaceRecuperar.addEventListener('click', (e) => {
        e.preventDefault();
        const correo = prompt('Ingrese su correo @duoc.cl para recuperar:');
        if (!correo) return;

        const usuarios = obtenerUsuarios();
        const usuario = usuarios.find(u => u.correo.toLowerCase() === correo.toLowerCase());

        if (usuario) {
          alert('Consejo: Recordá tu contraseña o contactá soporte. (Demostración)');
        } else {
          alert('No encontramos una cuenta con ese correo.');
        }
      });
    }
  }

  // =======================
  // Mis Mascota
  // =======================
  const contInfo = document.getElementById('resumenUsuario');
  const contLista = document.getElementById('listaMascotas');
  const mensajeMascotas = document.getElementById('mensajeMascotas');

  // Si estamos en misMascotas.html, proteger acceso:
  if (contInfo && contLista) {
    const usuario = obtenerUsuarioActual();
    if (!usuario) {
      contInfo.innerHTML = `
        <p class="error">No hay sesión activa. Iniciá sesión para ver tus mascotas.</p>
        <p><a class="btn" href="login.html">Iniciar sesión</a></p>
      `;
      return;
    }

    contInfo.innerHTML = `
      <p><strong>Usuario:</strong> ${usuario.nombre}</p>
      <p><strong>Correo:</strong> ${usuario.correo}</p>
    `;

    contLista.innerHTML = '';
    const mascotas = Array.isArray(usuario.mascotas) ? usuario.mascotas : [];
    if (mascotas.length === 0) {
      pintarFila();
    } else {
      mascotas.forEach(m => pintarFila(m.tipo, m.nombre));
    }

    const btnAgregar = document.getElementById('btnAgregarMascota');
    if (btnAgregar) btnAgregar.addEventListener('click', () => pintarFila());

    const btnGuardar = document.getElementById('btnGuardarMascotas');
    if (btnGuardar) btnGuardar.addEventListener('click', () => {
      const ok = guardarCambiosMascotas();
      if (mensajeMascotas) {
        mensajeMascotas.className = ok ? 'success' : 'error';
        mensajeMascotas.textContent = ok
          ? 'Cambios guardados correctamente.'
          : 'No se pudieron guardar los cambios.';
        setTimeout(() => (mensajeMascotas.textContent = ''), 3000);
      }
    });
  }
});
