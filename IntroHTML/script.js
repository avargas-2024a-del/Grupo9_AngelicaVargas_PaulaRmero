document.addEventListener('DOMContentLoaded', function() {
    const boton = document.getElementById('boton');
    const mensaje = document.getElementById('mensaje');
    
    let contador = 0;
    
    boton.addEventListener('click', function() {
        contador++;
        mensaje.textContent = `¡Hiciste clic ${contador} veces!`;
        
        // Cambiar color aleatorio
        const colores = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];
        const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
        document.body.style.background = colorAleatorio;
    });
});