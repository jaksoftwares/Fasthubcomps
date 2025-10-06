import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY); // optional
const WEBHOOK_URL = process.env.PAYMENT_WEBHOOK_URL; // optional webhook listener

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = body?.Body?.stkCallback;

    if (!result) throw new Error("Invalid callback payload");

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = result;

    const status = ResultCode === 0 ? "success" : "failed";

    // Extract payment info
    const metadataItems = CallbackMetadata?.Item || [];
    const mpesaReceipt = metadataItems.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value || null;
    const amount = metadataItems.find((i: any) => i.Name === "Amount")?.Value || null;
    const phone = metadataItems.find((i: any) => i.Name === "PhoneNumber")?.Value || null;

    // Find payment record
    const { data: payment } = await supabase
      .from("payments")
      .select("id, order_id, customer_email")
      .eq("transaction_id", CheckoutRequestID)
      .single();

    if (!payment) throw new Error("Payment record not found");

    // Update payment
    await supabase
      .from("payments")
      .update({
        status,
        amount,
        transaction_ref: mpesaReceipt,
        phone_number: phone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    // If successful, update order + notify
    if (status === "success") {
      await supabase.from("orders").update({ status: "paid" }).eq("id", payment.order_id);

      // 🔔 Email notification
      if (process.env.RESEND_API_KEY && payment.customer_email) {
        await resend.emails.send({
          from: "FastHub Payments <no-reply@yourdomain.com>",
          to: payment.customer_email,
          subject: "Payment Successful",
          html: `
            <p>Dear customer,</p>
            <p>Your payment of <strong>KES ${amount}</strong> was received successfully.</p>
            <p>Receipt: <strong>${mpesaReceipt}</strong></p>
            <p>Thank you for your order!</p>
          `,
        });
      }

      // 🔗 Webhook (optional)
      if (WEBHOOK_URL) {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: payment.order_id,
            payment_status: status,
            amount,
            mpesa_receipt: mpesaReceipt,
          }),
        });
      }
    }

    // Safaricom requires HTTP 200 even for failures
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Callback received successfully",
    });
  } catch (err: any) {
    console.error("Callback error:", err.message);
    return NextResponse.json({
      ResultCode: 1,
      ResultDesc: `Callback failed: ${err.message}`,
    });
  }
}
