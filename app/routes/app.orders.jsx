import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { getRecentOrdersFromMongo } from "../mongodb.server";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  const result = await getRecentOrdersFromMongo(100);

  let prismaOk = true;
  let prismaReason = null;
  let prismaOrders = [];

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    prismaOrders = orders.map((order) => ({
      id: String(order.id),
      category: order.category,
      item: order.item,
      customerName: order.customerName,
      address: order.address,
      phoneNumber: order.phoneNumber,
      quantity: order.quantity,
      unitPriceText: order.unitPriceText,
      totalPriceText: order.totalPriceText,
      status: order.status,
      createdAt: order.createdAt,
    }));
  } catch (error) {
    prismaOk = false;
    prismaReason =
      error instanceof Error
        ? `Unable to load orders from Prisma: ${error.message}`
        : "Unable to load orders from Prisma.";
  }

  return {
    ok: result.ok,
    reason: result.reason || null,
    orders: result.orders || [],
    prismaOk,
    prismaReason,
    prismaOrders,
  };
};

export default function OrdersPage() {
  const { ok, reason, orders, prismaOk, prismaReason, prismaOrders } =
    useLoaderData();

  return (
    <s-page heading="My Orders">
      <s-section heading="Recent orders">
        <s-paragraph>
          Review all placed coffee and cake orders from your MongoDB database.
        </s-paragraph>
      </s-section>

      {!ok && (
        <s-section>
          <s-box borderWidth="base" borderRadius="base" padding="base" background="critical-subdued">
            <s-text>{reason || "Unable to load orders from MongoDB."}</s-text>
          </s-box>
        </s-section>
      )}

      {ok && orders.length === 0 && (
        <s-section>
          <s-box borderWidth="base" borderRadius="base" padding="base" background="subdued">
            <s-text>No orders yet. Place an order from Coffee or Cakes page.</s-text>
          </s-box>
        </s-section>
      )}

      {ok && orders.length > 0 && (
        <s-section heading={`Total orders: ${orders.length}`}>
          <div
            style={{
              display: "grid",
              gap: "12px",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            }}
          >
            {orders.map((order, index) => (
              <s-box
                key={order.id || `${order.item}-${index}`}
                borderWidth="base"
                borderRadius="base"
                padding="base"
                background="surface"
              >
                <s-stack direction="block" gap="tight">
                  <s-stack direction="inline" gap="tight" alignment="center">
                    <s-box borderWidth="base" borderRadius="full" padding="025" background="subdued">
                      <s-text>Order #{index + 1}</s-text>
                    </s-box>
                    <s-box borderWidth="base" borderRadius="full" padding="025" background="subdued">
                      <s-text>{order.status || "placed"}</s-text>
                    </s-box>
                  </s-stack>

                  <s-heading>{order.item}</s-heading>
                  <s-text>Category: {order.category}</s-text>
                  <s-text>Customer: {order.customerName}</s-text>
                  <s-text>Phone: {order.phoneNumber}</s-text>
                  <s-text>Address: {order.address}</s-text>
                  <s-text>Quantity: {order.quantity}</s-text>
                  <s-text>Unit price: {order.unitPriceText}</s-text>
                  <s-text>Total: {order.totalPriceText}</s-text>
                  <s-text>
                    Date: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
                  </s-text>
                </s-stack>
              </s-box>
            ))}
          </div>
        </s-section>
      )}

      <s-section heading="Prisma Orders">
        {!prismaOk && (
          <s-box borderWidth="base" borderRadius="base" padding="base" background="critical-subdued">
            <s-text>{prismaReason}</s-text>
          </s-box>
        )}

        {prismaOk && prismaOrders.length === 0 && (
          <s-box borderWidth="base" borderRadius="base" padding="base" background="subdued">
            <s-text>No Prisma orders yet.</s-text>
          </s-box>
        )}

        {prismaOk && prismaOrders.length > 0 && (
          <div
            style={{
              display: "grid",
              gap: "12px",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              marginTop: "12px",
            }}
          >
            {prismaOrders.map((order, index) => (
              <s-box
                key={order.id || `${order.item}-${index}`}
                borderWidth="base"
                borderRadius="base"
                padding="base"
                background="surface"
              >
                <s-stack direction="block" gap="tight">
                  <s-stack direction="inline" gap="tight" alignment="center">
                    <s-box borderWidth="base" borderRadius="full" padding="025" background="subdued">
                      <s-text>Prisma #{index + 1}</s-text>
                    </s-box>
                    <s-box borderWidth="base" borderRadius="full" padding="025" background="subdued">
                      <s-text>{order.status || "placed"}</s-text>
                    </s-box>
                  </s-stack>

                  <s-heading>{order.item}</s-heading>
                  <s-text>Category: {order.category}</s-text>
                  <s-text>Customer: {order.customerName}</s-text>
                  <s-text>Phone: {order.phoneNumber}</s-text>
                  <s-text>Address: {order.address}</s-text>
                  <s-text>Quantity: {order.quantity}</s-text>
                  <s-text>Unit price: {order.unitPriceText}</s-text>
                  <s-text>Total: {order.totalPriceText}</s-text>
                  <s-text>
                    Date: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
                  </s-text>
                </s-stack>
              </s-box>
            ))}
          </div>
        )}
      </s-section>
    </s-page>
  );
}
