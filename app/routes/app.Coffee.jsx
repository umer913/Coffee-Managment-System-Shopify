export default function CoffeePage() {
  const groundCoffeeMenu = [
    {
      name: "Classic House Grind",
      image: "/coffee-packages/pack-kraft.svg",
      imageAlt: "XYZ--COFFEE kraft coffee package",
      price: "PKR 1,450",
    },
    {
      name: "Sunrise Citrus Grind",
      image: "/coffee-packages/pack-gold.svg",
      imageAlt: "XYZ--COFFEE gold coffee package",
      price: "PKR 1,620",
    },
    {
      name: "Velvet Mocha Grind",
      image: "/coffee-packages/pack-charcoal.svg",
      imageAlt: "XYZ--COFFEE charcoal coffee package",
      price: "PKR 1,580",
    },
    {
      name: "Mountain Bold Grind",
      image: "/coffee-packages/pack-kraft.svg",
      imageAlt: "XYZ--COFFEE kraft coffee package",
      price: "PKR 1,700",
    },
    {
      name: "Berry Bloom Grind",
     
      image: "/coffee-packages/pack-gold.svg",
     
      imageAlt: "XYZ--COFFEE gold coffee package",
      price: "PKR 1,650",
    },
    {
      name: "Nutty Roast Grind",
     
      image: "/coffee-packages/pack-charcoal.svg",
     
      imageAlt: "XYZ--COFFEE charcoal coffee package",
      price: "PKR 1,520",
    },
    {
      name: "Midnight Espresso Grind",
     
      image: "/coffee-packages/pack-kraft.svg",
     
      imageAlt: "XYZ--COFFEE kraft coffee package",
      price: "PKR 1,760",
    },
    {
      name: "Vanilla Silk Grind",
    
      image: "/coffee-packages/pack-gold.svg",
      
      imageAlt: "XYZ--COFFEE gold coffee package",
      price: "PKR 1,590",
    },
    {
      name: "Golden Crema Grind",
     
      image: "/coffee-packages/pack-charcoal.svg",
      
      imageAlt: "XYZ--COFFEE charcoal coffee package",
      price: "PKR 1,680",
    },
  ];
  const buildBuyLink = (itemName, itemPrice) => {
    const params = new URLSearchParams({
      category: "Coffee",
      item: itemName,
      price: itemPrice,
    });

    return `/app/buy?${params.toString()}`;
  };

  return (
    <s-page heading="Ground Coffee Menu">
      <s-section heading="XYZ--COFFEE">
        <s-paragraph>
          Premium ground coffee selection. 9 signature coffees with unique
          tastes and bean profiles.
        </s-paragraph>
      </s-section>

      <s-section heading="Our Coffee Menu">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "12px",
          }}
        >
          {groundCoffeeMenu.map((coffee, index) => (
            <s-box
              key={coffee.name}
              borderWidth="base"
              borderRadius="base"
              padding="base"
              background="surface"
            >
              <img
                src={coffee.image}
                alt={coffee.imageAlt}
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  display: "block",
                  marginBottom: "10px",
                }}
              />
              <s-stack direction="block" gap="tight">
                <s-stack direction="inline" gap="tight" alignment="center">
                  <s-box borderWidth="base" borderRadius="full" padding="025" background="subdued">
                    <s-text>XYZ--COFFEE</s-text>
                  </s-box>
                </s-stack>
                <s-heading>{coffee.name}</s-heading>
                <s-box borderWidth="base" borderRadius="base" padding="025" background="subdued">
                  <s-text>Price: {coffee.price}</s-text>
                </s-box>
                <s-button href={buildBuyLink(coffee.name, coffee.price)} variant="primary">
                  Buy Now
                </s-button>
              </s-stack>
            </s-box>
          ))}
        </div>
      </s-section>
    </s-page>
  );
}
