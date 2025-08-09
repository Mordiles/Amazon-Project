import { cart } from "../../data/cart.js";
import { addOrder } from "../../data/orders.js";
import { products } from "../../data/products.js";
import { delivery } from "../../data/shipping.js";
import { formatPriceCents } from "../util/money.js";

export function generatePaymentSummary() {
  cart.loadStorage();

  let totalProducts = 0;

  let totalCents = 0;

  let totalShippingCents = 0;

  cart.cartItems.forEach((item) => {
    totalProducts += item.quantity;

    const matchingItem = products.find((product) => {
      return product.id === item.productId;
    });

    totalCents += matchingItem.priceCents * item.quantity;

    const matchingDeliveryId = delivery.find((option) => {
      return option.deliveryId === item.deliveryOptionId;
    });

    totalShippingCents += matchingDeliveryId.priceCents;
  });

  const totalBeforeTaxCents = totalCents + totalShippingCents;

  const estimatedTaxCents = totalBeforeTaxCents * 0.1;

  const orderTotalCents = totalBeforeTaxCents + estimatedTaxCents;

  const paymentSummaryHTML = `
    <div class="payment-summary-title">Order Summary</div>

    <div class="payment-summary-row">
      <div>Items (${totalProducts}):</div>
      <div class="payment-summary-money">$${formatPriceCents(totalCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatPriceCents(
        totalShippingCents
      )}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatPriceCents(
        totalBeforeTaxCents
      )}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatPriceCents(
        estimatedTaxCents
      )}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatPriceCents(
        orderTotalCents
      )}</div>
    </div>

    <button class="place-order-button js-place-order-button button-primary">
      Place your order
    </button>
  `;

  document.querySelector(
    ".js-return-to-home-link"
  ).innerHTML = `${totalProducts} items`;

  document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;

  disableButtonIfCartIsEmpty();

  function disableButtonIfCartIsEmpty() {
    const button = document.querySelector(".js-place-order-button");

    if (button) {
      if (!cart.cartItems || cart.cartItems.length === 0) {
        button.disabled = true;
        button.classList.add("disabled",'no-hover');
        return;
      } else {
        button.disabled = false;
      }
    }
  }

  document
    .querySelector(".js-place-order-button")
    .addEventListener("click", async () => {
      try {
        const response = await fetch("https://supersimplebackend.dev/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart: cart.cartItems,
          }),
        });

        const result = await response.json();
        addOrder(result);
        cart.cartItems = [];
        cart.saveToStorage();
      } catch (error) {
        alert("Something went wrong. Please try again.");
      }

      window.location.href = "orders.html";
    });
}
