import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// orders@mebfactory.com requires mebfactory.com to be a verified sending
// domain in Resend. Until that's set up, RESEND_FROM_EMAIL should point at
// Resend's built-in onboarding@resend.dev sender, which works with no
// domain verification.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "MebFactory <onboarding@resend.dev>";

interface OrderEmailItem {
  quantity: number;
  price: number;
  product: { name: string };
}

interface OrderEmailData {
  id: string;
  total: number;
  items: OrderEmailItem[];
}

export async function sendOrderConfirmation(to: string, order: OrderEmailData) {
  const itemRows = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;">${item.product.name} × ${item.quantity}</td>
          <td style="padding:8px 0;text-align:right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;color:#2C2825;max-width:480px;margin:0 auto;">
      <h1 style="font-size:20px;font-weight:500;">Thank you for your order</h1>
      <p style="color:#8A8A8A;font-size:14px;">Order #${order.id}</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px;">
        ${itemRows}
        <tr>
          <td style="padding:12px 0 0;font-weight:600;border-top:1px solid #E0DED9;">Total</td>
          <td style="padding:12px 0 0;font-weight:600;text-align:right;border-top:1px solid #E0DED9;">$${order.total.toFixed(2)}</td>
        </tr>
      </table>
    </div>
  `;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Order Confirmation — #${order.id}`,
    html,
  });
}
