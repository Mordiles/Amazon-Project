import { formatPriceCents } from "../util/money.js";
import { cart } from "../../data/cart.js";
import { products } from "../../data/products.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { delivery } from "../../data/shipping.js";

export function generateOrderSummary() {
  cart.loadStorage();

  let orderSummaryHTML = "";

  cart.cartItems.forEach((cartItem) => {
    const productId = cartItem.productId;
    const deliveryId = cartItem.deliveryId;

    // Cleaner way to code. does the same as the code below
    const matchingProduct = products.find((product) => {
      return product.id === productId;
    });

    /* products.forEach((product) => {
      if (product.id === productId) {
        matchingProduct = product;
      }
    }); */

    const matchingDelivery = delivery.find((option) => {
      return option.deliveryId === deliveryId;
    });

    const today = dayjs();
    const deliveryDay = today.add(matchingDelivery.deliveryDays, "days");
    const formatDelivery = deliveryDay.format("dddd, MMMM D");

    orderSummaryHTML += `
  <div class="cart-item-container">
    <div class="delivery-date">
      Delivery date: ${formatDelivery}
    </div>

    <div class="cart-item-details-grid">
      <img class="product-image"
        src="${matchingProduct.image}">

      <div class="cart-item-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-price">
          $${formatPriceCents(matchingProduct.priceCents)}
        </div>
        <div class="product-quantity">
          <span>
            Quantity: <span class="quantity-label">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary">
            Update
          </span>
          <span class="delete-quantity-link link-primary">
            Delete
          </span>
        </div>
      </div>

      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        ${generateRadioButton(matchingProduct, deliveryId)}
        
      </div>
    </div>
  </div>
    `;
  });
  document.querySelector(".js-order-summary").innerHTML = orderSummaryHTML;

  document.querySelectorAll(".js-delivery-option-input").forEach((option) => {
    option.addEventListener("click", () => {
      const productId = option.dataset.productId;
      const deliveryId = Number(option.dataset.deliveryId);

      const cartItem = cart.cartItems.find((item) => {
        return item.productId === productId;
      });

      if (cartItem) {
        cartItem.deliveryId = deliveryId;
      }
      cart.saveToStorage();
      generateOrderSummary();
    });
  });
}

function generateRadioButton(matchingProduct, deliveryId) {
  let radioButtonHTML = "";

  delivery.forEach((option) => {
    const today = dayjs();
    const deliveryDate = today.add(option.deliveryDays, "days");
    const formatDelivery = deliveryDate.format("dddd, MMMM D");

    radioButtonHTML += `
    <div class="delivery-option">
      <input type="radio" class="delivery-option-input js-delivery-option-input"
      data-product-id="${matchingProduct.id}"
      data-delivery-id="${option.deliveryId}"
        name="delivery-option-${matchingProduct.id}"
        ${deliveryId === option.deliveryId ? "checked" : ""}>
      <div>
        <div class="delivery-option-date">
          ${formatDelivery}
        </div>
        <div class="delivery-option-price">
          ${
            option.priceCents === 0
              ? "FREE"
              : `$${formatPriceCents(option.priceCents)} -`
          } Shipping
        </div>
      </div>
    </div>
    `;
  });
  return radioButtonHTML;
}
