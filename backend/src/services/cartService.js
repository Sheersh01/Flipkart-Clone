function roundMoney(value) {
  return Number(Number(value).toFixed(2));
}

function buildCartSummary(items) {
  const subtotal = roundMoney(
    items.reduce(
      (sum, item) => sum + Number(item.salePrice) * Number(item.quantity),
      0,
    ),
  );

  const mrpTotal = roundMoney(
    items.reduce(
      (sum, item) => sum + Number(item.mrpPrice) * Number(item.quantity),
      0,
    ),
  );

  const rawDiscount = mrpTotal - subtotal;
  const discount = roundMoney(rawDiscount > 0 ? rawDiscount : 0);
  const platformFee = items.length > 0 ? 7 : 0;
  const total = roundMoney(subtotal + platformFee);
  const savings = roundMoney(discount);
  const totalItems = items.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  return {
    subtotal,
    discount,
    platformFee,
    total,
    savings,
    totalItems,
  };
}

module.exports = { buildCartSummary };
