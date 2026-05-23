// WhatsApp business number — update this to the store's WhatsApp number
export const WHATSAPP_NUMBER = "917356642955"; // format: country code + number, no +

/**
 * Build a WhatsApp chat URL with a pre-filled message
 */
export function buildWhatsAppURL(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

/**
 * Generate order message for a single product
 */
export function productOrderMessage({ name, price, size, quantity = 1, id }) {
  const productLink = id ? `${window.location.origin}/product/${id}` : "";
  return `Hi Yūgen! 👋\n\nI'd like to order:\n\n` +
    `*${name}*\n` +
    (size ? `Size: ${size}\n` : "") +
    `Quantity: ${quantity}\n` +
    `Price: ₹${price?.toLocaleString()}\n` +
    (productLink ? `Link: ${productLink}\n` : "") +
    `\nPlease confirm availability. Thank you!`;
}

/**
 * Generate order message for full cart
 */
export function cartOrderMessage(cartItems) {
  const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const lines = cartItems.map(
    (i) =>
      `• ${i.product_name}${i.size ? ` (${i.size})` : ""} × ${i.quantity} — ₹${(i.price * i.quantity).toLocaleString()}`
  );
  return (
    `Hi Yūgen! 👋\n\nI'd like to place an order:\n\n` +
    lines.join("\n") +
    `\n\n*Total: ₹${total.toLocaleString()}*\n\nPlease confirm availability and payment details. Thank you!`
  );
}