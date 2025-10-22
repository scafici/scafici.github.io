// Envolver código del formulario para que solo se ejecute si existe
document.addEventListener('DOMContentLoaded', function() {
    
    // CÓDIGO DEL FORMULARIO - Solo se ejecuta si existe
    const inputNombre = document.getElementById('nombre');
    const inputApellido = document.getElementById('apellido');
    const inputEmail = document.getElementById('email');
    const inputMensaje = document.getElementById('mensaje');
    const botonEnviar = document.getElementById('botonEnviarFormulario');
    
    // Solo ejecutar si el botón existe (estamos en la página de contacto)
    if (botonEnviar) {
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
                    'service_xm6256j', 
                    'template_pujt3a8', 
                    {
                        from_name: inputNombre.value,
                        to_name: 'Rodrigo',
                        email: inputEmail.value,
                        message: inputMensaje.value
                    },
                    'O6Jx9_1OUfKgpryCU'
                ).then((response) => {
                    console.log('Correo enviado:', response);
                }, (error) => {
                    console.log('Error:', error);
                });
            }
        });
    }
    
    // CÓDIGO DEL BOTÓN VOLVER ARRIBA - Funciona en todas las páginas
    const btnVolverArriba = document.getElementById('btn-volver-arriba');
    
    //console.log('Botón volver arriba encontrado:', btnVolverArriba); // Debug
    
    if (btnVolverArriba) {
        // Función para verificar scroll
        function verificarPosicionScroll() {
            const scrollActual = window.pageYOffset || document.documentElement.scrollTop;
            
            //console.log('Scroll actual:', scrollActual); // Debug
            
            // Mostrar el botón cuando haya scroll hacia abajo (más de 300px)
            if (scrollActual > 300) {
                btnVolverArriba.classList.add('visible');
                //console.log('Botón visible'); // Debug
            } else {
                btnVolverArriba.classList.remove('visible');
                //console.log('Botón oculto'); // Debug
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
    } else {
        //console.warn('No se encontró el botón con id "btn-volver-arriba"');
    }
});

// Función para limpiar formulario (si la necesitas desde otro lado)
function limpiarFormulario() { 
    const formulario = document.getElementById("miFormulario");
    if (formulario) {
        formulario.reset(); 
    }
}


