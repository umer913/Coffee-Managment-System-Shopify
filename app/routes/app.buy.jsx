import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { useState } from "react";
import { authenticate } from "../shopify.server";
import { saveOrderToMongo } from "../mongodb.server";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  const url = new URL(request.url);

  return {
    category: url.searchParams.get("category") || "Item",
    item: url.searchParams.get("item") || "Unknown item",
    price: url.searchParams.get("price") || "PKR 0",
  };
};

export const action = async ({ request }) => {
  await authenticate.admin(request);

  const formData = await request.formData();
  const category = String(formData.get("category") || "Item");
  const item = String(formData.get("item") || "Unknown item");
  const price = String(formData.get("price") || "PKR 0");
  const customerName = String(formData.get("customerName") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const phoneNumber = String(formData.get("phoneNumber") || "").trim();
  const quantity = Number(formData.get("quantity") || 0);

  if (!customerName || !address || !phoneNumber) {
    return {
      error: "Please enter your name, address, and phone number.",
    };
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    return {
      error: "Please enter a valid quantity (1 or more).",
    };
  }

  const unitPrice = Number(price.replace(/[^0-9]/g, "")) || 0;
  const totalPrice = unitPrice * quantity;

  let mongoMessage = "Order placed and saved to MongoDB.";
  let mongoOrderId = null;
  let prismaMessage = "Order placed and saved to Prisma.";
  let prismaOrderId = null;

  try {
    const prismaOrder = await prisma.order.create({
      data: {
        category,
        item,
        customerName,
        address,
        phoneNumber,
        quantity,
        unitPrice,
        totalPrice,
        unitPriceText: `PKR ${unitPrice.toLocaleString("en-PK")}`,
        totalPriceText: `PKR ${totalPrice.toLocaleString("en-PK")}`,
        status: "placed",
      },
    });

    prismaOrderId = String(prismaOrder.id);
  } catch (error) {
    prismaMessage =
      error instanceof Error
        ? `Order placed, but saving to Prisma failed: ${error.message}`
        : "Order placed, but saving to Prisma failed.";
  }

  try {
    const mongoResult = await saveOrderToMongo({
      category,
      item,
      customerName,
      address,
      phoneNumber,
      quantity,
      unitPrice,
      totalPrice,
      unitPriceText: `PKR ${unitPrice.toLocaleString("en-PK")}`,
      totalPriceText: `PKR ${totalPrice.toLocaleString("en-PK")}`,
      status: "placed",
    });

    if (mongoResult.saved) {
      mongoOrderId = mongoResult.id;
    } else {
      mongoMessage = mongoResult.reason;
    }
  } catch (error) {
    mongoMessage =
      error instanceof Error
        ? `Order placed, but saving to MongoDB failed: ${error.message}`
        : "Order placed, but saving to MongoDB failed.";
  }

  return {
    success: true,
    category,
    item,
    customerName,
    address,
    phoneNumber,
    quantity,
    mongoMessage,
    mongoOrderId,
    prismaMessage,
    prismaOrderId,
    unitPriceText: `PKR ${unitPrice.toLocaleString("en-PK")}`,
    totalPriceText: `PKR ${totalPrice.toLocaleString("en-PK")}`,
  };
};

export default function BuyPage() {
  const { category, item, price } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const isSubmitting = navigation.state === "submitting";
  const unitPrice = Number(price.replace(/[^0-9]/g, "")) || 0;
  const [quantityInput, setQuantityInput] = useState(
    Number(searchParams.get("quantity") || "1"),
  );
  const estimatedTotal = unitPrice * (Number(quantityInput) || 0);

  const returnPath =
    category.toLowerCase() === "cake" ? "/app/Cakes" : "/app/Coffee";

  return (
    <s-page heading="Checkout Form">
      <s-section heading="Complete your order">
        <s-paragraph>
          Confirm your {category.toLowerCase()} selection, enter quantity, and
          place your order.
        </s-paragraph>
      </s-section>

      <s-section heading="Order Details">
        <s-box borderWidth="base" borderRadius="base" padding="base" background="subdued">
          <s-stack direction="block" gap="tight">
            <s-text>
              <strong>Category:</strong> {category}
            </s-text>
            <s-text>
              <strong>Item:</strong> {item}
            </s-text>
            <s-text>
              <strong>Unit price:</strong> {price}
            </s-text>
          </s-stack>
        </s-box>

        <Form method="post">
          <input type="hidden" name="category" value={category} />
          <input type="hidden" name="item" value={item} />
          <input type="hidden" name="price" value={price} />

          <div style={{ marginTop: "12px", display: "grid", gap: "10px", maxWidth: "460px" }}>
            <label style={{ display: "grid", gap: "6px" }}>
              Name
              <input
                type="text"
                name="customerName"
                placeholder="Enter your full name"
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #c9c9c9" }}
                required
              />
            </label>

            <label style={{ display: "grid", gap: "6px" }}>
              Address
              <textarea
                name="address"
                rows="3"
                placeholder="Enter delivery address"
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #c9c9c9" }}
                required
              />
            </label>

            <label style={{ display: "grid", gap: "6px" }}>
              Phone number
              <input
                type="tel"
                name="phoneNumber"
                placeholder="03xx-xxxxxxx"
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #c9c9c9" }}
                required
              />
            </label>

            <label style={{ display: "grid", gap: "6px", maxWidth: "220px" }}>
              Quantity
              <input
                type="number"
                name="quantity"
                min="1"
                value={quantityInput}
                onChange={(event) => setQuantityInput(event.target.value)}
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #c9c9c9" }}
                required
              />
            </label>

            <s-box borderWidth="base" borderRadius="base" padding="025" background="subdued">
              <s-text>
                Estimated total: PKR {estimatedTotal.toLocaleString("en-PK")}
              </s-text>
            </s-box>
          </div>

          <div style={{ marginTop: "12px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="submit"
              style={{
                border: "none",
                borderRadius: "8px",
                background: "#7f4a26",
                color: "#fff",
                padding: "8px 14px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {isSubmitting ? "Processing..." : "Buy Now"}
            </button>
            <s-link href={returnPath}>Back to menu</s-link>
          </div>
        </Form>
      </s-section>

      {actionData?.error && (
        <s-section>
          <s-box borderWidth="base" borderRadius="base" padding="base" background="critical-subdued">
            <s-text>{actionData.error}</s-text>
          </s-box>
        </s-section>
      )}

      {actionData?.success && (
        <s-section heading="Order placed">
          <s-box borderWidth="base" borderRadius="base" padding="base" background="success-subdued">
            <s-stack direction="block" gap="tight">
              <s-text>
                Your order for <strong>{actionData.item}</strong> has been placed.
              </s-text>
              <s-text>Name: {actionData.customerName}</s-text>
              <s-text>Address: {actionData.address}</s-text>
              <s-text>Phone: {actionData.phoneNumber}</s-text>
              <s-text>Quantity: {actionData.quantity}</s-text>
              <s-text>Unit price: {actionData.unitPriceText}</s-text>
              <s-text>Total: {actionData.totalPriceText}</s-text>
              <s-text>{actionData.prismaMessage}</s-text>
              {actionData.prismaOrderId ? (
                <s-text>Prisma order id: {actionData.prismaOrderId}</s-text>
              ) : null}
              <s-text>{actionData.mongoMessage}</s-text>
              {actionData.mongoOrderId ? (
                <s-text>Mongo order id: {actionData.mongoOrderId}</s-text>
              ) : null}
            </s-stack>
          </s-box>
        </s-section>
      )}
    </s-page>
  );
}
