import { cart } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { formatPriceCents } from "../util/money.js";
// import dayjs from "https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js";
export function generatePaymentSummary() {
  cart.loadStorage();

  let totalProducts = 0;

  cart.cartItems.forEach((item) => {
    totalProducts += item.quantity;
  });

  let totalCents = 0;

  cart.cartItems.forEach((item) => {
    const matchingItem = products.find((product) => {
      return product.id === item.productId;
    });

    totalCents += matchingItem.priceCents * item.quantity;
  });

  const paymentSummaryHTML = `
    <div class="payment-summary-title">Order Summary</div>

    <div class="payment-summary-row">
      <div>Items (${totalProducts}):</div>
      <div class="payment-summary-money">$${formatPriceCents(totalCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$4.99</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$47.74</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$4.77</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$52.51</div>
    </div>

    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;
  document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;
}
