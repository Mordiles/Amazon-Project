import { orders } from "../data/orders.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { formatPriceCents } from "./util/money.js";
import { products } from "../data/products.js";

generateOrdersGrid();

function generateOrdersGrid() {
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

  document.querySelector('.js-orders-grid').innerHTML = orderGridHTML;

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
          <button class="buy-again-button button-primary">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>
  
        <div class="product-actions">
          <a href="tracking.html">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    });

    return orderDetailsHTML;
  }
}
