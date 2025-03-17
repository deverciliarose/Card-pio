const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartModalItem = document.getElementById("cart-modal-item");
const cartItemnsContainer = document.getElementById("cart-item");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const adderessInput = document.getElementById("adderess")
const adderessWarn = document.getElementById("adderess-warn");


 function openModal(){
    document.getElementById("modal").style.display ="block"
     document.getElementById("overlay").style.display ="block"
 }
 function closeModal(){
    document.getElementById("modal").style.display = "none"
    document.getElementById("overlay").style.display = "none"
 }




    let slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide) => {
            slide.classList.remove('active');
        });

        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length; 
        showSlide(currentSlide);
    }

    showSlide(currentSlide);

    setInterval(nextSlide, 3000);


let cart = [];


cartBtn.addEventListener('click', function(){
    cartModal.style.display = 'flex'
});


cartModal.addEventListener('click', function(event){
    if(event.target===cartModal){
        cartModal.style.display = 'none';
    }
});


closeModalBtn.addEventListener('click', function(){
    cartModal.style.display = 'none'
})


menu.addEventListener('click', function(){
    let parentButton = event.target.closest('.add-to-cart-btn');
    if (!parentButton) return; 

    const name = parentButton.getAttribute('data-name');
    const itemElement = parentButton.closest('.itemns');
    if (!itemElement) return; 

    
    const sizeElement = itemElement.querySelector('select');
    const size = sizeElement ? sizeElement.value : "default"; 

    let price = 0;

    if (sizeElement) {
        
        const selectedOption = sizeElement.selectedOptions[0];
        price = selectedOption ? parseFloat(selectedOption.getAttribute('data-price')) : 0;
    } else {
    
        let priceElement = itemElement.querySelector("#preço");
        if (priceElement) {
            price = parseFloat(priceElement.textContent.replace("R$:", "").trim());
        }
    }

    
    if (isNaN(price) || price <= 0) {
        console.error('Preço inválido para:', name, "Valor encontrado:", price);
        return;
    }

    addToCart(name, price, size);
});
    



function addToCart(name,price,size){
   const existingItem = cart.find(item => item.name === name && item.size === size);
   

    if(existingItem){
     existingItem.quantity += 1;
     
    }else{
     cart.push({
         name,
         size,
         price,
         quantity:1,
        })
 
    }
 
    updateCartModal();
   
 }
 

 function updateCartModal(){
    const cartItemsContainer = document.getElementById('cart-items-container');
    cartItemsContainer.innerHTML = "";
    let total = 0;
   
    cart.forEach(item =>{
       const cartItemElement = document.createElement('div');
       cartItemElement.classList.add('cart-item');
   
       cartItemElement.innerHTML = `
       
       <div>
         <div>
           <p class="font-medium">${item.name}</P>
           <p>Qtd: ${item.quantity}</p>
           <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
         </div>
   
         
           <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
           </button>
         
       </div>
       `
       total += item.price * item.quantity;
   
       cartItemsContainer.appendChild(cartItemElement);

         
    }) 
      
   
    cartTotal.textContent = total.toLocaleString("pt-Br",{
       style:"currency",
       currency:"BRL"
   
    })
    
    cartCounter.innerHTML=cart.length
   };

 

document.querySelectorAll('select[name="tamanho"]').forEach((selectElement, index) => {
    selectElement.addEventListener('change', function () {
        const precoDinamico = document.getElementById(`preco-dinamico-${index + 1}`);
        const addToCartButton = selectElement.closest('.itemns').querySelector('.add-to-cart-btn');
        const selectedOption = this.options[this.selectedIndex];
        const novoPreco = selectedOption.getAttribute('data-price');

        if (novoPreco) {
            precoDinamico.textContent = parseFloat(novoPreco).toFixed(2);

            
            addToCartButton.setAttribute('data-price', novoPreco);
        }
    });
});





document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cart-items-container');

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', function (event) {
            if (event.target.classList.contains("remove-from-cart-btn")) {
                const name = event.target.getAttribute('data-name');
                removeItemCart(name);
            }
        });
    }
});


function removeItemCart(name){
  const index = cart.findIndex(item => item.name === name);

if(index !== -1){
  const item = cart[index];

  if(item.quantity > 1){
      item.quantity -=1;
      updateCartModal()
      return;
  }
  cart.splice(index,1)
  updateCartModal();
}

};


adderessInput.addEventListener('input', function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
     adderessInput.classList.remove("border-red-500")
     adderessWarn.classList.add("hidden")
    }
});


checkoutBtn.addEventListener('click', function(){

    const isOpen = checkRestaurantOpen()
     if(!isOpen){
        alert("Restaurante Fechado no momento")
        return;
    }
    
    if(cart.length === 0) return;
    if(adderessInput.value === ""){
      adderessWarn.style.display="block"
      adderessInput.style.border="2px solid red"
      return;
    }
    
    const cartItems = cart.map((item)=>{
        return(
        `${item.name} Quantidade:(${item.quantity}) Preço: R$ ${item.price}`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone= "99984753745"
    window.open(`https://wa.me/${phone}?text=${message} Endereço:${adderessInput.value}`, "_blank")

    cart=[];
    updateCartModal()
});


function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >=18 & hora <=23
}



   