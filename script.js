// Product (base)
class Product {
  constructor(id, name, author, price, image) {
    this.id = id;
    this.name = name;
    this.author = author;
    this.price = price;
    this.image = image;
    this.category = "General";
  }
}

// Concrete Products
class ClassicBook extends Product {
  constructor(id, name, author, price, image) {
    super(id, name, author, price, image);
    this.category = "classics";
  }
}
class ThrillerBook extends Product {
  constructor(id, name, author, price, image) {
    super(id, name, author, price, image);
    this.category = "thriller";
  }
}
class RomanceBook extends Product {
  constructor(id, name, author, price, image) {
    super(id, name, author, price, image);
    this.category = "romance";
  }
}

// Factory
class ProductFactory {
  static createProduct(type, id, name, author, price, image) {
    switch (type.toLowerCase()) {
      case "classic": return new ClassicBook(id, name, author, price, image);
      case "thriller": return new ThrillerBook(id, name, author, price, image);
      case "romance":  return new RomanceBook(id, name, author, price, image);
      default:        return new Product(id, name, author, price, image);
    }
  }
}

// Products list
const products = [
  ProductFactory.createProduct("classic", 1, "The Brothers Karamazov (1880)", "Fyodor Dostoevsky", 900, "images/fyodor.jpg"),
  ProductFactory.createProduct("classic", 2, "The Picture of Dorian Gray (1890)", "Oscar Wilde", 900, "images/dorian.jpg"),
  ProductFactory.createProduct("romance", 3, "Emma (1815)", "Jane Austen", 250, "images/emma.jpg"),
  ProductFactory.createProduct("thriller", 4, "And Then There Were None (1939)", "Agatha Christie", 500, "images/agatha.jpeg"),
  ProductFactory.createProduct("thriller", 5, "Gone Girl (2012)", "Gillian Flynn", 500, "images/gone.jpg")
];

// Decorator Pattern for Discounts
class CartTotal {
  getTotal(items) {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }
}
class CartTotalDecorator {
  constructor(cartTotal) {
    this.cartTotal = cartTotal;
  }
  getTotal(items) {
    return this.cartTotal.getTotal(items);
  }
}
class DiscountDecorator extends CartTotalDecorator {
  getTotal(items) {
    let total = super.getTotal(items);
    if (total >= 200) {
      return total * 0.5; // 50% off
    }
    return total;
  }
}

const baseTotal = new CartTotal();
let decoratedTotal = baseTotal;
let discountApplied = false;

// Cart (Observer)
class Cart {
  constructor() {
    this.items = [];
    this.observers = [];
  }
  subscribe(observer) {
    this.observers.push(observer);
  }
  notify() {
    this.observers.forEach(obs => obs(this.items));
  }
  addItem(product) {
    let existing = this.items.find(i => i.id === product.id);
    if (existing) {
      existing.qty++;
    } else {
      this.items.push({ ...product, qty: 1 });
    }
    this.notify();
  }
  updateQty(productId, change) {
    let item = this.items.find(i => i.id === productId);
    if (item) {
      item.qty += change;
      if (item.qty <= 0) {
        this.items = this.items.filter(i => i.id !== productId);
      }
    }
    this.notify();
  }
}

// Observer render function
function renderCart(items) {
  const container = document.getElementById("cartItemsContainer");
  container.innerHTML = "";

  items.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="details">
        <p class="title">${item.name}</p>
        <p class="author">${item.author}</p>
        <p class="price">₱${item.price}</p>
      </div>
      <div class="quantity">
        <button onclick="cart.updateQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button onclick="cart.updateQty(${item.id}, 1)">+</button>
      </div>
    `;
    container.appendChild(div);
  });

  // compute with decorator
  let total = decoratedTotal.getTotal(items);
  document.querySelector(".total h3").innerText = "₱" + total;

  // auto-reset discount if total < 200
  if (discountApplied && baseTotal.getTotal(items) < 200) {
    decoratedTotal = baseTotal;
    discountApplied = false;
    document.querySelector(".use-btn").innerText = "USE";
    document.querySelector(".total h3").innerText = "₱" + baseTotal.getTotal(items);
  }
}

// Discount button
document.querySelector(".use-btn").addEventListener("click", () => {
  if (!discountApplied) {
    decoratedTotal = new DiscountDecorator(baseTotal);
    discountApplied = true;
    document.querySelector(".use-btn").innerText = "REMOVE";
  } else {
    decoratedTotal = baseTotal;
    discountApplied = false;
    document.querySelector(".use-btn").innerText = "USE";
  }
  cart.notify();
});

// Render products
function renderProducts(products) {
  const container = document.getElementById("product");
  container.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="author">${p.author}</p>
      <p class="price">₱${p.price}</p>
      <button onclick="cart.addItem(products.find(x => x.id === ${p.id}))">Add to Cart</button>
    `;
    container.appendChild(div);
  });
}

// Init
const cart = new Cart();
cart.subscribe(renderCart);
renderProducts(products);
