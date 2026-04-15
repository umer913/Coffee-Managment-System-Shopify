import { useEffect, useState } from "react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

const coffees = [
  {
    name: "House Espresso",
    roast: "Medium",
    tastingNotes: "Caramel, cocoa, and orange zest",
    description:
      "Our signature daily espresso blend built for balanced sweetness and a smooth finish.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Freshly brewed espresso in a ceramic cup",
  },
  {
    name: "Mountain Pour Over",
    roast: "Light",
    tastingNotes: "Berry, jasmine, and honey",
    description:
      "Single-origin beans roasted light to highlight floral aroma and crisp fruit character.",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Manual pour over coffee setup on a wooden counter",
  },
  {
    name: "Cold Brew Reserve",
    roast: "Dark",
    tastingNotes: "Dark chocolate, molasses, and toasted nuts",
    description:
      "Slow-steeped for 18 hours to create a rich, low-acid cold brew with a velvety body.",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Glass of cold brew coffee with ice",
  },

];

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export default function Index() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const slider = setInterval(() => {
      setActiveImageIndex((currentImage) => (currentImage + 1) % coffees.length);
    }, 3500);

    return () => clearInterval(slider);
  }, [coffees.length]);

  const featuredCoffee = coffees[activeImageIndex];

  return (
    <s-page heading="About Coffee Store">
      <s-section heading="Craft coffee built for Shopify merchants">
        <s-paragraph>
          Coffee Store helps merchants showcase specialty coffees with clear
          descriptions, beautiful imagery, and product-ready details that fit
          naturally inside the Shopify admin.
        </s-paragraph>

        <s-box
          borderWidth="base"
          borderRadius="large"
          background="strong"
          padding="none"
        >
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "12px",
              marginTop: "12px",
              height: "clamp(220px, 38vw, 360px)",
            }}
          >
            {coffees.map((coffee, index) => (
              <img
                key={coffee.name}
                src={coffee.image}
                alt={coffee.imageAlt}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  opacity: activeImageIndex === index ? 1 : 0,
                  transition: "opacity 700ms ease-in-out",
                }}
              />
            ))}

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.65) 100%)",
              }}
            />

            <div
              style={{
                position: "absolute",
                left: "16px",
                right: "16px",
                bottom: "16px",
                color: "#ffffff",
                transition: "transform 250ms ease",
              }}
            >
              <div style={{ fontSize: "1.05rem", fontWeight: 700 }}>
                Featured: {featuredCoffee.name}
              </div>
              <div style={{ fontSize: "0.9rem", marginTop: "4px" }}>
                {featuredCoffee.roast} roast | {featuredCoffee.tastingNotes}
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                right: "16px",
                top: "16px",
                display: "flex",
                gap: "8px",
              }}
            >
              {coffees.map((coffee, index) => (
                <button
                  key={coffee.name}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`Show image ${index + 1}`}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "999px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor:
                      activeImageIndex === index
                        ? "#ffffff"
                        : "rgba(255,255,255,0.45)",
                  }}
                />
              ))}
            </div>
          </div>
        </s-box>
      </s-section>

      <s-section heading="Our coffee lineup">
        <div
          style={{
            display: "grid",
            gap: "16px",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          {coffees.map((coffee) => (
            <s-box
              key={coffee.name}
              borderWidth="base"
              borderRadius="base"
              padding="base"
              background="subdued"
            >
              <img
                src={coffee.image}
                alt={coffee.imageAlt}
                style={{
                  width: "100%",
                  height: "170px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  display: "block",
                  marginBottom: "12px",
                }}
              />
              <s-stack direction="block" gap="tight">
                <s-heading>{coffee.name}</s-heading>
                <s-text>
                  {coffee.roast} roast | {coffee.tastingNotes}
                </s-text>
                <s-paragraph>{coffee.description}</s-paragraph>
              </s-stack>
            </s-box>
          ))}
        </div>
      </s-section>

    
      <s-section>
        <s-stack direction="inline" gap="base">
          <s-button href="/app/Coffee" variant="primary">
            Browse the Coffee World
          </s-button>
         
        </s-stack>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
