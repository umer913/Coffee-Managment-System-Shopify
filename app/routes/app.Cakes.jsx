export default function CakesPage() {
  const cakeMenu = [
    {
      name: "Classic Cheesecake",
      flavor: "Creamy vanilla, buttery biscuit base",
      packageType: "Clear dome box | Gold base | 500g",
      image: "/cake-images/cheesecake.svg",
      imageAlt: "Classic cheesecake",
      price: "PKR 1,900",
    },
    {
      name: "Mocha Layer Cake",
      flavor: "Cocoa sponge, coffee cream, soft finish",
      packageType: "Matte sleeve box | Fresh seal | 700g",
      image: "/cake-images/mocha-cake.svg",
      imageAlt: "Mocha layer cake",
      price: "PKR 2,250",
    },
    {
      name: "Carrot Walnut Cake",
      flavor: "Warm spice, toasted walnut, light frosting",
      packageType: "Craft carton | Moisture lock | 650g",
      image: "/cake-images/carrot-cake.svg",
      imageAlt: "Carrot walnut cake",
      price: "PKR 2,050",
    },
    {
      name: "Red Velvet Slice Box",
      flavor: "Cocoa hint, tangy cream cheese",
      packageType: "Window pack | Chill-safe tray | 400g",
      image: "/cake-images/red-velvet.svg",
      imageAlt: "Red velvet cake slice",
      price: "PKR 1,750",
    },
    {
      name: "Hazelnut Crunch Cake",
      flavor: "Roasted hazelnut, praline crunch",
      packageType: "Rigid premium box | Aroma-safe wrap | 750g",
      image: "/cake-images/hazelnut-cake.svg",
      imageAlt: "Hazelnut crunch cake",
      price: "PKR 2,380",
    },
    {
      name: "Blueberry Soft Cake",
      flavor: "Berry compote, vanilla cream",
      packageType: "Cold-chain box | Sealed insert | 600g",
      image: "/cake-images/blueberry-cake.svg",
      imageAlt: "Blueberry cream cake",
      price: "PKR 2,190",
    },
    {
      name: "Salted Caramel Cake",
      flavor: "Buttery caramel, sea salt finish",
      packageType: "Gift-ready box | Ribbon lock | 700g",
      image: "/cake-images/caramel-cake.svg",
      imageAlt: "Salted caramel cake",
      price: "PKR 2,300",
    },
    {
      name: "Chocolate Truffle Cake",
      flavor: "Dark ganache, silky truffle center",
      packageType: "Premium foil liner | Fresh lock | 800g",
      image: "/cake-images/chocolate-truffle.svg",
      imageAlt: "Chocolate truffle cake",
      price: "PKR 2,550",
    },
    {
      name: "Strawberry Dream Cake",
      flavor: "Strawberry cream, light sponge",
      packageType: "Clear top box | Cushion insert | 550g",
      image: "/cake-images/strawberry-cake.svg",
      imageAlt: "Strawberry cream cake",
      price: "PKR 2,120",
    },
  ];
  const buildBuyLink = (itemName, itemPrice) => {
    const params = new URLSearchParams({
      category: "Cake",
      item: itemName,
      price: itemPrice,
    });

    return `/app/buy?${params.toString()}`;
  };

  return (
    <s-page heading="Cake Menu">
      <s-section heading="XYZ--CAKES">
        <s-paragraph>
          Premium cake selection crafted to pair perfectly with your coffee
          offerings.
        </s-paragraph>
        
      </s-section>

      <s-section heading="Our Cake Menu">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "12px",
          }}
        >
          {cakeMenu.map((cake, index) => (
            <s-box
              key={cake.name}
              borderWidth="base"
              borderRadius="base"
              padding="base"
              background="surface"
            >
              <img
                src={cake.image}
                alt={cake.imageAlt}
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
                    <s-text>XYZ--CAKES</s-text>
                  </s-box>
                </s-stack>
                <s-heading>{cake.name}</s-heading>
                <s-text>Flavor: {cake.flavor}</s-text>
                <s-box borderWidth="base" borderRadius="base" padding="025" background="subdued">
                  <s-text>Packaging: {cake.packageType}</s-text>
                </s-box>
                <s-box borderWidth="base" borderRadius="base" padding="025" background="subdued">
                  <s-text>Price: {cake.price}</s-text>
                </s-box>
                <s-button href={buildBuyLink(cake.name, cake.price)} variant="primary">
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
