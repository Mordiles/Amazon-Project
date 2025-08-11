import { products } from "../data/products.js";
import { formatPriceCents } from "./util/money.js";
import { cart } from "../data/cart.js";

generateProductGridHTML();

function generateProductGridHTML() {
  let productHTML = "";

  const url = new URLSearchParams(window.location.search);
  const productName = url.get("search");

  let productFilter;

  if (productName) {
    const searchTerm = productName.toLowerCase();

    productFilter = products.filter((product) => {
      const matchedProductName = product.name
        .toLowerCase()
        .includes(searchTerm);

      const matchedProductKeyword = product.keywords.some((keyword) => {
        return keyword.toLowerCase().includes(searchTerm);
      });
      return matchedProductName || matchedProductKeyword;
    });
  } else {
    productFilter = products;
  }

  productFilter.forEach((product) => {
    productHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="${product.getStars()}">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${formatPriceCents(product.priceCents)}
      </div>

      <div class="product-quantity-container">
        <select class='js-quantity-selector-${product.id}'>
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart js-added-to-cart js-added-to-cart-${
        product.id
      }">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart-button" data-product-id="${
        product.id
      }">
        Add to Cart
      </button>
    </div>
    `;
  });

  if (!productHTML) {
    productHTML = `<p class='no-products-found'>No products matched your search.</p>`;
  }

  document.querySelector(".js-product-grid").innerHTML = productHTML;

  cart.loadStorage();

  let hideTimeout = {};

  document.querySelectorAll(".js-add-to-cart-button").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;

      //cleaner code to search for an existing item
      const matchingItem = cart.cartItems.find(
        (product) => product.productId === productId
      );

      /* cart.cartItems.forEach((cartItem) => {
        if (cartItem.productId === productId) {
          matchingItem = cartItem;
        }
      }); */

      const quantitySelector = document.querySelector(
        `.js-quantity-selector-${productId}`
      );

      const quantity = parseInt(quantitySelector.value);

      if (matchingItem) {
        matchingItem.quantity += quantity;
      } else {
        cart.cartItems.push({
          productId: productId,
          quantity: quantity,
          deliveryOptionId: "1",
        });
      }

      cart.saveToStorage();
      document.querySelector(".js-cart-quantity").innerHTML =
        countTotalQuantity();

      const messageSelector = document.querySelector(
        `.js-added-to-cart-${productId}`
      );

      messageSelector.classList.add("show");

      clearTimeout(hideTimeout[productId]);

      hideTimeout[productId] = setTimeout(() => {
        messageSelector.classList.remove("show");
      }, 2000);
    });
  });

  function countTotalQuantity() {
    let cartQuantity = 0;

    cart.cartItems.forEach((item) => {
      cartQuantity += item.quantity;
    });
    return cartQuantity;
  }

  document.querySelector(".js-cart-quantity").innerHTML = countTotalQuantity();

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
  document.querySelector(".js-search-bar").value = productName;
}
