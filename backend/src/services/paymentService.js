async function processPaymentByMethod({ orderId, method }) {
  const normalizedMethod = String(method || "")
    .trim()
    .toLowerCase();

  if (normalizedMethod === "cash_on_delivery") {
    return {
      success: true,
      gateway: "cod",
      reference: `cod_${orderId}`,
      message: "Order confirmed with Cash on Delivery",
      paymentStatus: "pending",
      orderStatus: "confirmed",
    };
  }

  if (["card", "upi", "net_banking", "wallet"].includes(normalizedMethod)) {
    return {
      success: true,
      gateway: "internal",
      reference: `internal_${normalizedMethod}_${orderId}_${Date.now()}`,
      message: "Payment captured successfully",
      paymentStatus: "paid",
      orderStatus: "confirmed",
    };
  }

  throw new Error("Unsupported payment method");
}

module.exports = { processPaymentByMethod };
