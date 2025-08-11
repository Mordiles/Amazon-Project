import { orders } from "../data/orders.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { formatPriceCents } from "./util/money.js";
import { products } from "../data/products.js";
import { cart } from "../data/cart.js";

generateOrdersGrid();

function generateOrdersGrid() {
  cart.loadStorage();
  let orderGridHTML = "";

  orders.forEach((order) => {
    const orderId = order.id;
    const orderTime = dayjs(order.orderTime);
    const totalCostCents = order.totalCostCents;
    const formattedDate = orderTime.format("MMMM D");

    orderGridHTML += `
  <div class="order-container">
    <div class="order-header">
      <div class="order-header-left-section">
        <div class="order-date">
          <div class="order-header-label">Order Placed:</div>
          <div>${formattedDate}</div>
        </div>
        <div class="order-total">
          <div class="order-header-label">Total:</div>
          <div>$${formatPriceCents(totalCostCents)}</div>
        </div>
      </div>

      <div class="order-header-right-section">
        <div class="order-header-label">Order ID:</div>
        <div>${orderId}</div>
      </div>
    </div>

    <div class="order-details-grid js-order-details-grid">
      ${generateOrderDetails(order)}
    </div>
  </div>
    `;
  });

  document.querySelector(".js-orders-grid").innerHTML = orderGridHTML;

  document.querySelector(".js-cart-quantity").innerHTML =
    cart.countTotalQuantity();

  document.querySelectorAll(".js-buy-again-button").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;

      const matchingItem = cart.cartItems.find((product) => {
        return product.productId === productId;
      });

      if (matchingItem) {
        matchingItem.quantity += 1;
      } else {
        cart.cartItems.push({
          productId: productId,
          quantity: 1,
          deliveryOptionId: "1",
        });
      }

      cart.saveToStorage();
      generateOrdersGrid();
    });
  });

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

  function generateOrderDetails(order) {
    let orderDetailsHTML = "";

    order.products.forEach((product) => {
      const productId = product.productId;
      const quantity = product.quantity;
      const estimatedDeliveryTime = dayjs(product.estimatedDeliveryTime).format(
        "MMMM D"
      );

      const matchingProduct = products.find(
        (product) => product.id === productId
      );

      orderDetailsHTML += `
      <div class="product-image-container">
          <img src="${matchingProduct.image}">
        </div>
  
        <div class="product-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>

          <div class="product-delivery-date">
            Arriving on: ${estimatedDeliveryTime}
          </div>

          <div class="product-quantity">
            Quantity: ${quantity}
          </div>
          <button class="buy-again-button button-primary js-buy-again-button"
          data-product-id='${productId}'>
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${productId}">
            <button class="track-package-button button-secondary js-track-package-button">
              Track package
            </button>
          </a>
        </div>
      `;
    });

    return orderDetailsHTML;
  }
}
