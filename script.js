const cartToggle = document.getElementById("cartToggle");
const shoppingCart = document.getElementById("shoppingCart");
const content = document.querySelector(".content");

cartToggle.addEventListener("click", () => {
  shoppingCart.classList.toggle("active");
  content.classList.toggle("cart-open");
});
