import { cart } from "../data/cart.js";
import { orders } from "../data/orders.js";
import { products } from "../data/products.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

generateTracking();

function generateTracking() {
  cart.loadStorage();

  const url = new URLSearchParams(window.location.search);

  const orderId = url.get("orderId");
  const productId = url.get("productId");

  const order = orders.find((order) => {
    return order.id === orderId;
  });

  const product = products.find((product) => {
    return product.id === productId;
  });

  const matchingProduct = order.products.find((product) => {
    return product.productId === productId;
  });

  const estimatedDelivery = dayjs(matchingProduct.estimatedDeliveryTime);
  const orderPlaced = dayjs(order.orderTime);
  const today = dayjs();
  const deliveryProgress =
    ((today - orderPlaced) / (estimatedDelivery - orderPlaced)) * 100;
  const deliveredMessage =
    today < estimatedDelivery ? "Arriving on" : "Delivered on";

  const trackingHTML = `
  <a class="back-to-orders-link link-primary" href="orders.html">
    View all orders
  </a>

  <div class="delivery-date">
    ${deliveredMessage} ${estimatedDelivery.format("dddd, MMMM D")}
  </div>

  <div class="product-info">
    ${product.name}
  </div>

  <div class="product-info">
    Quantity: ${matchingProduct.quantity}
  </div>

  <img class="product-image" src="${product.image}">

  <div class="progress-labels-container">
    <div class="progress-label ${
      deliveryProgress < 50 ? "current-status" : ""
    }">
      Preparing
    </div>
    <div class="progress-label ${
      deliveryProgress >= 50 ? "current-status" : ""
    }">
      Shipped
    </div>
    <div class="progress-label ${
      deliveryProgress >= 100 ? "current-status" : ""
    }">
      Delivered
    </div>
  </div>

  <div class="progress-bar-container">
    <div class="progress-bar" style="width:${deliveryProgress}%;"></div>
  </div>
  `;

  document.querySelector(".js-order-tracking").innerHTML = trackingHTML;

  document.querySelector(".js-cart-quantity").innerHTML = cart.countTotalQuantity();

  document.querySelector(".js-search-button").addEventListener("click", () => {
    getAndDisplaySearch();
  });

  document
    .querySelector(".js-search-bar")
    .addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        getAndDisplaySearch();
      }
    });

  function getAndDisplaySearch() {
    const search = document.querySelector(".js-search-bar").value.toLowerCase();

    window.location.href = `amazon.html?search=${search}`;
  }
}
