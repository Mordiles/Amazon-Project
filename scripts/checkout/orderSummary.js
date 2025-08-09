import { formatPriceCents } from "../util/money.js";
import { cart } from "../../data/cart.js";
import { products } from "../../data/products.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { delivery } from "../../data/shipping.js";
import { generatePaymentSummary } from "./paymentSummary.js";

export function generateOrderSummary() {
  cart.loadStorage();

  let orderSummaryHTML = "";

  cart.cartItems.forEach((cartItem) => {
    const productId = cartItem.productId;
    const deliveryId = cartItem.deliveryOptionId;

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
            Quantity: <span class="quantity-label js-quantity-label-${
              matchingProduct.id
            }">${cartItem.quantity}</span>
          </span>

          <input type=number class='update-quantity-input js-update-quantity-input js-update-quantity-input-${
            matchingProduct.id
          } hide-button' value="${cartItem.quantity}">

          <span class='save-quantity-link 
          js-save-quantity-link
          js-save-quantity-${matchingProduct.id} 
          link-primary 
          hide-button
          '
          data-product-id=${matchingProduct.id}
          >Save</span>

          <span class="update-quantity-link link-primary js-update-quantity-link js-update-quantity-${
            matchingProduct.id
          }"
          data-product-id='${matchingProduct.id}'>
            Update
          </span>

          <span class="delete-quantity-link js-delete-quantity-link link-primary"
          data-product-id="${matchingProduct.id}">
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

  cartEmpty();

  document.querySelector(".js-order-summary").innerHTML = orderSummaryHTML;

  function cartEmpty() {
    if (!cart.cartItems || cart.cartItems.length === 0) {
      orderSummaryHTML = `
      <p>Your cart is empty</p>
      <a class='button-primary view-product-link' href='amazon.html'>View Products</a>
      `
    }
  }

  document.querySelectorAll(".js-delivery-option-input").forEach((option) => {
    option.addEventListener("click", () => {
      const productId = option.dataset.productId;
      const deliveryId = option.dataset.deliveryId;

      const cartItem = cart.cartItems.find((item) => {
        return item.productId === productId;
      });

      if (cartItem) {
        cartItem.deliveryOptionId = deliveryId;
      }
      saveToStorageAndGenerate();
    });
  });

  document.querySelectorAll(".js-delete-quantity-link").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;

      cart.cartItems = cart.cartItems.filter((item) => {
        return item.productId !== productId;
      });
      console.log(cart.cartItems);

      saveToStorageAndGenerate();
    });
  });

  document.querySelectorAll(".js-update-quantity-link").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;

      removeAndAddHideButtonClass(productId);
    });
  });

  document.querySelectorAll(".js-save-quantity-link").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;

      const newQuantity = parseInt(
        document.querySelector(`.js-update-quantity-input-${productId}`).value
      );

      const matchingProduct = cart.cartItems.find((item) => {
        return item.productId === productId;
      });

      if (!newQuantity || newQuantity < 1) {
        alert("Quantity can't be less than 1");
        return;
      }

      matchingProduct.quantity = newQuantity;
      saveToStorageAndGenerate();
    });
  });
}

function removeAndAddHideButtonClass(productId) {
  document
    .querySelector(`.js-update-quantity-${productId}`)
    .classList.add("hide-button");

  document
    .querySelector(`.js-quantity-label-${productId}`)
    .classList.add("hide-button");

  document
    .querySelector(`.js-update-quantity-input-${productId}`)
    .classList.remove("hide-button");

  document
    .querySelector(`.js-save-quantity-${productId}`)
    .classList.remove("hide-button");
}

function saveToStorageAndGenerate() {
  cart.saveToStorage();
  generateOrderSummary();
  generatePaymentSummary();
}

function generateRadioButton(matchingProduct, deliveryOptionId) {
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
        ${deliveryOptionId === option.deliveryId ? "checked" : ""}>
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
