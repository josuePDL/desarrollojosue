// --- CONFIGURACIÓN ---
const URL_API = "https://script.google.com/macros/s/AKfycbzB1fU_DQfkaATmNL_s54wlTNXQ3AYqA0jdSMJr93eIcB1qne2gzqAVDzxz7yORQ96K/exec"; 


let datosGlobales = {};
let claveAcceso = null;

// Observador para animaciones al hacer scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.1 });

document.addEventListener("DOMContentLoaded", () => {
    // Aplicar observador a las secciones
    document.querySelectorAll('.hidden').forEach(el => observer.observe(el));
    cargarDatos();
});

async function cargarDatos() {
    try {
        let respuesta = await fetch(URL_API);
        let datos = await respuesta.json();
        datosGlobales = datos;
        renderizarSitio(datos);
        llenarFormulariosAdmin(datos);
    } catch (error) {
        console.log("Mostrando datos locales. Error de conexión con Sheets.");
    }
}

function renderizarSitio(datos) {
    // Perfil
    if(datos.perfil && Object.keys(datos.perfil).length > 0) {
        if(datos.perfil.nombre) document.getElementById('txt-nombre').textContent = datos.perfil.nombre;
        if(datos.perfil.profesion) document.getElementById('txt-profesion').textContent = datos.perfil.profesion;
        if(datos.perfil.sobremi) document.getElementById('txt-sobremi').textContent = datos.perfil.sobremi;
    }

    // Educación
    const contEducacion = document.getElementById('contenedor-educacion');
    if(datos.educacion && datos.educacion.length > 0) {
        contEducacion.innerHTML = "";
        datos.educacion.forEach(e => {
            contEducacion.innerHTML += `
                <div class="item">
                    <h4>${e.Titulo}</h4>
                    <span class="casa">${e.Institucion}</span>
                    <span class="fecha">${e.Fechas}</span>
                    <p>${e.Descripcion}</p>
                </div>
            `;
        });
    }

    // Experiencia y listados del Admin
    const contTrabajo = document.getElementById('contenedor-experiencia');
    const adminTrayectoria = document.getElementById('admin-lista-trayectoria');
    
    if(datos.experiencia && datos.experiencia.length > 0) {
        contTrabajo.innerHTML = "";
        adminTrayectoria.innerHTML = "";
        datos.experiencia.forEach(t => {
            contTrabajo.innerHTML += `
                <div class="item">
                    <h4>${t.Titulo}</h4>
                    <span class="casa">${t.Institucion}</span>
                    <span class="fecha">${t.Fechas}</span>
                    <p>${t.Descripcion}</p>
                </div>
            `;
            adminTrayectoria.innerHTML += `<div class="admin-item-lista"><span>${t.Titulo} (Trabajo)</span><button class="btn-eliminar" onclick="eliminarRegistro('Experiencia', ${t.ID})">Borrar</button></div>`;
        });
    }

    if(datos.educacion) {
        datos.educacion.forEach(e => {
            adminTrayectoria.innerHTML += `<div class="admin-item-lista"><span>${e.Titulo} (Educación)</span><button class="btn-eliminar" onclick="eliminarRegistro('Educacion', ${e.ID})">Borrar</button></div>`;
        });
    }

    // Proyectos
    const contProyectos = document.getElementById('galeria-proyectos');
    const adminProyectos = document.getElementById('admin-lista-proyectos');
    
    if(datos.proyectos && datos.proyectos.length > 0) {
        contProyectos.innerHTML = "";
        adminProyectos.innerHTML = "";
        datos.proyectos.forEach(p => {
            contProyectos.innerHTML += `
                <div class="proyecto">
                    <img src="${p.URL_Imagen}" alt="${p.Titulo}">
                    <div class="info-inferior">
                        <h3>${p.Titulo}</h3>
                        <p>${p.Descripcion}</p>
                        <a href="${p.URL_Proyecto}" target="_blank" class="btn-ver">Visitar Proyecto <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                    </div>
                </div>
            `;
            adminProyectos.innerHTML += `<div class="admin-item-lista"><span>${p.Titulo}</span><button class="btn-eliminar" onclick="eliminarRegistro('Proyectos', ${p.ID})">Borrar</button></div>`;
        });
    }
}

function llenarFormulariosAdmin(datos) {
    if(datos.perfil) {
        if(datos.perfil.nombre) document.getElementById('admin-nombre').value = datos.perfil.nombre;
        if(datos.perfil.profesion) document.getElementById('admin-profesion').value = datos.perfil.profesion;
        if(datos.perfil.sobremi) document.getElementById('admin-sobremi').value = datos.perfil.sobremi;
    }
}

// Lógica Admin...
function abrirLogin() { document.getElementById('login-panel').style.display = 'flex'; }
function cerrarLogin() { document.getElementById('login-panel').style.display = 'none'; }

function verificarLogin(e) {
    e.preventDefault();
    claveAcceso = document.getElementById('input-password').value;
    cerrarLogin();
    abrirAdmin();
    mostrarToast("Verificando acceso...");
}

function abrirAdmin() { 
    if(!claveAcceso) { abrirLogin(); return; }
    document.getElementById('admin-panel').style.display = 'flex'; 
}
function cerrarAdmin() { document.getElementById('admin-panel').style.display = 'none'; }

async function enviarPeticion(payload) {
    if(!claveAcceso) { mostrarToast("No tienes permiso"); return; }
    payload.password = claveAcceso; 
    
    mostrarToast("Guardando...");
    try {
        let respuesta = await fetch(URL_API, { method: 'POST', body: JSON.stringify(payload) });
        let resJson = await respuesta.json();
        
        if(resJson.status === "Error") {
            mostrarToast("Fallo: " + resJson.mensaje);
            if(resJson.mensaje === "Contraseña incorrecta") claveAcceso = null; 
        } else {
            mostrarToast("¡Guardado correctamente!");
            cargarDatos();
        }
    } catch (error) {
        mostrarToast("Error de conexión.");
    }
}

function guardarPerfil(e) {
    e.preventDefault();
    enviarPeticion({
        accion: 'actualizarPerfil',
        payload: { nombre: document.getElementById('admin-nombre').value, profesion: document.getElementById('admin-profesion').value, sobreMi: document.getElementById('admin-sobremi').value }
    });
}

function agregarTrayectoria(e) {
    e.preventDefault();
    let tabla = document.getElementById('tray-tipo').value;
    enviarPeticion({
        accion: 'agregarFila',
        tabla: tabla,
        payload: [ new Date().getTime(), document.getElementById('tray-titulo').value, document.getElementById('tray-inst').value, document.getElementById('tray-fecha').value, document.getElementById('tray-desc').value ]
    });
    e.target.reset();
}

function agregarProyecto(e) {
    e.preventDefault();
    enviarPeticion({
        accion: 'agregarFila',
        tabla: 'Proyectos',
        payload: [ new Date().getTime(), document.getElementById('proj-titulo').value, document.getElementById('proj-desc').value, document.getElementById('proj-url').value, document.getElementById('proj-img').value ]
    });
    e.target.reset();
}

function eliminarRegistro(tabla, id) {
    if(confirm("¿Seguro que quieres borrar este elemento?")) {
        enviarPeticion({ accion: 'eliminarFila', tabla: tabla, id: id });
    }
}

// Utilidades UI
function cambiarTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('activo'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('activo'));
    document.getElementById(tabId).classList.add('activo');
    event.target.classList.add('activo');
}

function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    toast.textContent = mensaje;
    toast.className = "toast mostrar";
    setTimeout(() => { toast.className = toast.className.replace("mostrar", ""); }, 3000);
}

// Menú móvil
function mostrarOcultarMenu() { document.getElementById("nav").classList.toggle("responsive"); }
function seleccionar() { document.getElementById("nav").classList.remove("responsive"); }