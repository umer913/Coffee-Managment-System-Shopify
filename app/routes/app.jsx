import { Link, Outlet, useLoaderData, useLocation, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { authenticate } from "../shopify.server";

const navItems = [
  { label: "Home", to: "/app" },
  { label: "Coffee", to: "/app/Coffee" },
  { label: "Cakes", to: "/app/Cakes" },
  { label: "My Orders", to: "/app/orders" },
  { label: "Location", to: "/app/Location" },
];

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  // eslint-disable-next-line no-undef
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();
  const location = useLocation();

  return (
    <AppProvider embedded apiKey={apiKey}>
      <s-app-nav>
        {navItems.map((item) => (
          <s-link key={item.to} href={item.to}>
            {item.label}
          </s-link>
        ))}
      </s-app-nav>

      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          margin: "0 0 12px",
          background: "linear-gradient(120deg, #f3e8db 0%, #ede0d0 100%)",
          borderBottom: "1px solid #dfd1bf",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "14px",
            padding: "12px 16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontWeight: 700, color: "#4d2f1b", fontSize: "1rem" }}>
            Coffee Store
          </div>

          <nav style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {navItems.map((item) => {
              const isActive =
                item.to === "/app"
                  ? location.pathname === "/app"
                  : location.pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
                    textDecoration: "none",
                    padding: "7px 12px",
                    borderRadius: "999px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: isActive ? "#ffffff" : "#4d2f1b",
                    background: isActive ? "#7f4a26" : "#ffffff",
                    border: "1px solid #d6c1ab",
                    boxShadow: isActive
                      ? "0 4px 10px rgba(127, 74, 38, 0.26)"
                      : "none",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <Outlet />
    </AppProvider>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
