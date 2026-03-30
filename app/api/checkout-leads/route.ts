import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase/server';

type CheckoutLeadPayload = {
  orderId: string;
  customerName: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  note: string;
  deliveryMethod: 'standard' | 'express';
  shippingCost: number;
  subtotal: number;
  total: number;
  itemsCount: number;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    lineTotal: number;
  }>;
};

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<CheckoutLeadPayload>;

    const orderId = asText(payload.orderId);
    const firstName = asText(payload.firstName);
    const lastName = asText(payload.lastName);
    const customerName = asText(payload.customerName) || `${firstName} ${lastName}`.trim();
    const phone = asText(payload.phone);
    const email = asText(payload.email);
    const address = asText(payload.address);
    const city = asText(payload.city);
    const postalCode = asText(payload.postalCode);
    const note = asText(payload.note);
    const deliveryMethod = payload.deliveryMethod === 'express' ? 'express' : 'standard';
    const shippingCost = Number(payload.shippingCost ?? 0);
    const subtotal = Number(payload.subtotal ?? 0);
    const total = Number(payload.total ?? 0);
    const itemsCount = Number(payload.itemsCount ?? 0);
    const items = Array.isArray(payload.items) ? payload.items : [];

    if (!orderId || !firstName || !lastName || !phone || !email || !address || !city || items.length === 0) {
      return NextResponse.json({ error: 'Missing required checkout data.' }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from('checkout_leads').insert({
      order_id: orderId,
      customer_name: customerName,
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      address,
      city,
      postal_code: postalCode || null,
      note: note || null,
      delivery_method: deliveryMethod,
      shipping_cost: shippingCost,
      subtotal,
      total,
      items_count: itemsCount,
      payment_method: 'cash_on_delivery',
      items,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
