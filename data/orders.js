export const orders = JSON.parse(localStorage.getItem("orders")) || [];

export function addOrder(result) {
  orders.unshift(result)
  orderSaveToStorage();
}

function orderSaveToStorage() {
  localStorage.setItem("orders", JSON.stringify(orders));
}