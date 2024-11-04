let menuVisible = false;
//Función que oculta o muestra el menu
function mostrarOcultarMenu(){
    if(menuVisible){
        document.getElementById("nav").classList ="";
        menuVisible = false;
    }else{
        document.getElementById("nav").classList ="responsive";
        menuVisible = true;
    }
}

function seleccionar(){
    //oculto el menu una vez que selecciono una opcion
    document.getElementById("nav").classList = "";
    menuVisible = false;
}
//Funcion que aplica las animaciones de las habilidades
function efectoHabilidades() {
    var skills = document.getElementById("skills");
    var distancia_skills = window.innerHeight - skills.getBoundingClientRect().top;
    if (distancia_skills >= 300) {
        let habilidades = document.getElementsByClassName("progreso");
        
        // Define los porcentajes de cada habilidad
        const porcentajes = [
            { skill: "Comunicación", porcentaje: 80 },
            { skill: "C#", porcentaje: 50 },
            { skill: "Trabajo en Equipo", porcentaje: 70 },
            { skill: "Manejo de Base de Datos", porcentaje: 75 },
            { skill: "Creatividad", porcentaje: 99 },
            { skill: "Dedicación", porcentaje: 65 },
        ];
        
        // Aplicar los porcentajes a cada barra de progreso
        for (let i = 0; i < habilidades.length; i++) {
            if (habilidades[i]) {
                let porcentaje = porcentajes[i].porcentaje;
                habilidades[i].style.width = porcentaje + "%"; // Ajusta el ancho de la barra
                habilidades[i].querySelector("span").textContent = porcentaje + "%"; // Actualiza el texto del porcentaje
            }
        }
    }
}


//detecto el scrolling para aplicar la animacion de la barra de habilidades
window.onscroll = function(){
    efectoHabilidades();
} 
