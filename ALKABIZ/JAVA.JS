// Sección 1: Gráfico de productos más vendidos (Chart.js)
const ctx = document.getElementById('product-chart')?.getContext('2d');
if (ctx) {
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Producto 1', 'Producto 2', 'Producto 3', 'Producto 4'],
      datasets: [{
        label: 'Veces elegido',
        data: [12, 19, 7, 10],
        backgroundColor: ['#007bff', '#6c757d', '#28a745', '#dc3545'],
        borderColor: ['#0056b3', '#5a6268', '#218838', '#c82333'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Sección 2: Funciones para manejar el carrito de compras
const cart = [
  { id: 1, name: 'Producto 1', price: 10.0, quantity: 2, image: 'producto1.jpg' }
];

function renderCart() {
  const cartItems = document.getElementById('cart-items');
  const totalElement = document.getElementById('total-price');
  let total = 0;

  cartItems.innerHTML = ''; // Limpiar los elementos previos

  cart.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('cart-item');

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;

    const details = document.createElement('div');
    const name = document.createElement('h3');
    name.textContent = item.name;

    const price = document.createElement('p');
    price.textContent = `Precio: $${item.price.toFixed(2)}`;

    const controls = document.createElement('div');
    controls.classList.add('controls');

    const decreaseButton = document.createElement('button');
    decreaseButton.classList.add('decrease');
    decreaseButton.dataset.id = item.id;
    decreaseButton.textContent = '-';

    const quantity = document.createElement('span');
    quantity.textContent = item.quantity;

    const increaseButton = document.createElement('button');
    increaseButton.classList.add('increase');
    increaseButton.dataset.id = item.id;
    increaseButton.textContent = '+';

    controls.appendChild(decreaseButton);
    controls.appendChild(quantity);
    controls.appendChild(increaseButton);

    details.appendChild(name);
    details.appendChild(price);
    details.appendChild(controls);

    div.appendChild(img);
    div.appendChild(details);
    cartItems.appendChild(div);

    total += item.price * item.quantity;
  });

  totalElement.textContent = total.toFixed(2);
}

// Aumentar o disminuir la cantidad de un producto
document.addEventListener('click', (e) => {
  const itemId = e.target.dataset.id;
  const item = cart.find(item => item.id == itemId);

  if (e.target.classList.contains('increase') && item) {
    item.quantity++;
  } else if (e.target.classList.contains('decrease') && item) {
    item.quantity = item.quantity > 1 ? item.quantity - 1 : 0;
    if (item.quantity === 0) {
      cart.splice(cart.indexOf(item), 1);
    }
  }

  renderCart();
});

// Renderizar el carrito al cargar la página
renderCart();

// Sección 3: Función para redirigir a la página de pago
function goToPayment(productName, productPrice) {
  const queryParams = new URLSearchParams({
    product: productName,
    price: productPrice
  });
  window.location.href = `/HTML/PAYMENT.HTML?${queryParams.toString()}`;
}

// Sección 4: Recuperar el producto seleccionado en la página de pago
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const productName = params.get('product');
  const productPrice = params.get('price');
  
  if (productName && productPrice) {
    const paymentDetails = document.getElementById('payment-details');
    paymentDetails.innerHTML = `
      <h3>${productName}</h3>
      <p>Precio: $${parseFloat(productPrice).toFixed(2)}</p>
    `;
  }
});

// Sección 5: Función para manejar el formulario de recuperación de contraseña
document.getElementById('reset-form').addEventListener('submit', function(e) {
  e.preventDefault();  // Prevenir el envío del formulario

  const email = document.getElementById('email').value;
  
  // Validación básica de correo electrónico
  if (email && validateEmail(email)) {
    document.getElementById('confirmation-message').style.display = 'block';
    document.getElementById('email').value = '';  // Limpiar el campo de correo
  } else {
    alert('Por favor, ingresa un correo electrónico válido.');
  }
});

// Validación de correo electrónico
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(email);
}
const express = require('express');
const app = express();
const port = 3000;

//Grafica 
// Datos de ejemplo (en la vida real los datos vendrían de una base de datos)
const productos = [
  { id: 1, nombre: 'Producto A', cantidadVendida: 150 },
  { id: 2, nombre: 'Producto B', cantidadVendida: 90 },
  { id: 3, nombre: 'Producto C', cantidadVendida: 120 },
  { id: 4, nombre: 'Producto D', cantidadVendida: 180 },
  { id: 5, nombre: 'Producto E', cantidadVendida: 60 }
];

// Endpoint para obtener los productos más populares
app.get('/api/productos-populares', (req, res) => {
  // Ordenamos los productos por cantidadVendida en orden descendente
  const productosPopulares = productos.sort((a, b) => b.cantidadVendida - a.cantidadVendida).slice(0, 5);
  res.json(productosPopulares);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
// Función para obtener los productos populares desde el backend
async function obtenerProductosPopulares() {
    try {
      const response = await fetch('/api/productos-populares');
      const productos = await response.json();
      
      return productos;
    } catch (error) {
      console.error("Error al obtener los productos populares:", error);
    }
  }
  
  // Función para crear la gráfica con los datos
  async function crearGrafica() {
    const productosPopulares = await obtenerProductosPopulares();
  
    if (!productosPopulares) return;
  
    const nombres = productosPopulares.map(producto => producto.nombre);
    const cantidadesVendidas = productosPopulares.map(producto => producto.cantidadVendida);
  
    // Crear la gráfica
    const ctx = document.getElementById('popularityChart').getContext('2d');
    
    new Chart(ctx, {
      type: 'bar', // Tipo de gráfico (barras)
      data: {
        labels: nombres,
        datasets: [{
          label: 'Cantidad Vendida',
          data: cantidadesVendidas,
          backgroundColor: '#007bff',
          borderColor: '#0056b3',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
  
  // Llamamos a la función para crear la gráfica
  crearGrafica();
  