function limpiarFormulario() { 
    document.getElementById("miFormulario").reset(); 
}

const inputNombre = document.getElementById('nombre');
const inputApellido = document.getElementById('apellido');
const inputEmail = document.getElementById('email');
const inputMensaje = document.getElementById('mensaje');
const botonEnviar = document.getElementById('botonEnviarFormulario');

function validateEmail(Email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(Email).toLowerCase());
}

botonEnviar.addEventListener('click', (evento) => {
    evento.preventDefault();
    let Nombre = inputNombre.value;
    let Apellido = inputApellido.value;
    let Email = inputEmail.value;
    let Mensaje = inputMensaje.value;
        if (!Nombre) { 
            alert('Por favor, ingrese su nombre.'); 
        } else if (!Apellido) { 
            alert('Por favor, ingrese su apellido.'); 
        } else if (!validateEmail(Email)) { 
            alert('Por favor, ingrese un e-mail válido con el siguiente formato: ejemplo@mail.com'); 
            return false;
        } else if (!Mensaje) { 
            alert('Por favor, redacte un mensaje.');
        } else {

// Convertir la primera letra de nombre y apellido a mayúscula 
Nombre = Nombre.split(' ').map(function(palabra) { 
    return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase(); 
}).join(' '); 
Apellido = Apellido.split(' ').map(function(palabra) { 
    return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase(); 
}).join(' '); 


// Imprimir en la consola 
console.log(`Nombre: ${Nombre}, Apellido: ${Apellido}, E-mail: ${Email}`);
console.log("Mensaje: ", Mensaje);

alert('Formulario enviado exitosamente. ¡Gracias!');
    
emailjs.send(
    'service_xm6256j', // El ID del servicio que creaste en EmailJS
    'template_pujt3a8', // El ID del template que creaste en EmailJS
    {
        from_name: inputNombre.value,
        to_name: 'Rodrigo',
        email: inputEmail.value,
        message: inputMensaje.value
    },
    'O6Jx9_1OUfKgpryCU' // Tu ID de usuario
).then((response) => {
    console.log('Correo enviado:', response);
}, (error) => {
    console.log('Error:', error);
});
}

});

// Botón volver arriba - Mostrar/Ocultar según scroll
document.addEventListener('DOMContentLoaded', function() {
    const btnVolverArriba = document.getElementById('btn-volver-arriba');
    
    if (btnVolverArriba) {
        // Función para verificar si el usuario llegó al final de la página
        function verificarPosicionScroll() {
            // Altura total del documento
            const alturaTotal = document.documentElement.scrollHeight;
            // Altura visible de la ventana
            const alturaVentana = window.innerHeight;
            // Posición actual del scroll
            const scrollActual = window.pageYOffset || document.documentElement.scrollTop;
            
            // Distancia desde el bottom (puedes ajustar este valor)
            const distanciaDelFinal = alturaTotal - (scrollActual + alturaVentana);
            
            // Mostrar el botón cuando esté a 300px o menos del final
            if (distanciaDelFinal <= 300) {
                btnVolverArriba.classList.add('visible');
            } else {
                btnVolverArriba.classList.remove('visible');
            }
        }
        
        // Escuchar el evento scroll
        window.addEventListener('scroll', verificarPosicionScroll);
        
        // Verificar al cargar la página
        verificarPosicionScroll();
        
        // Smooth scroll al hacer click
        btnVolverArriba.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
