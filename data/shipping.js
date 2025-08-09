class Delivery {
  deliveryId;
  deliveryDays;
  priceCents;
  constructor(shippingDetails) {
    this.deliveryId = shippingDetails.deliveryId;
    this.deliveryDays = shippingDetails.deliveryDays;
    this.priceCents = shippingDetails.priceCents;
  }
}

export const delivery = [
  {
    deliveryId: '1',
    deliveryDays: 7,
    priceCents: 0,
  },
  {
    deliveryId: '2',
    deliveryDays: 3,
    priceCents: 499,
  },
  {
    deliveryId: '3',
    deliveryDays: 1,
    priceCents: 999,
  },
].map((deliveryDetails) => {
  return new Delivery(deliveryDetails);
});
