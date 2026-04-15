export default function LocationPage() {
  const karachiLocations = [
    {
      name: "Clifton Flagship",
      area: "Block 5, Clifton, Karachi",
      hours: "Mon-Sun: 8:00 AM - 11:00 PM",
      services: "Dine-in, takeaway, coffee beans counter",
      mapLink: "https://www.google.com/maps?q=Boat+Basin+Clifton+Karachi",
      image: "/shop-images/clifton-v2.jpg",
      imageAlt: "XYZ--COFFEE Clifton storefront",
    },
    {
      name: "DHA Phase 6",
      area: "Khayaban-e-Shahbaz, DHA, Karachi",
      hours: "Mon-Sun: 8:30 AM - 11:30 PM",
      services: "Dine-in, desserts bar, late night seating",
      mapLink: "https://www.google.com/maps?q=Khayaban-e-Shahbaz+DHA+Karachi",
      image: "/shop-images/dha-v2.jpg",
      imageAlt: "XYZ--COFFEE DHA branch storefront",
    },
    {
      name: "Gulshan Branch",
      area: "Block 13-D, Gulshan-e-Iqbal, Karachi",
      hours: "Mon-Sun: 9:00 AM - 10:30 PM",
      services: "Family seating, cake pickups, takeaway",
      mapLink:
        "https://www.google.com/maps?q=Gulshan-e-Iqbal+Block+13D+Karachi",
      image: "/shop-images/gulshan-v2.jpg",
      imageAlt: "XYZ--COFFEE Gulshan branch storefront",
    },
    {
      name: "North Nazimabad",
      area: "Block H, North Nazimabad, Karachi",
      hours: "Mon-Sun: 8:00 AM - 10:00 PM",
      services: "Quick service, morning breakfast combos",
      mapLink:
        "https://www.google.com/maps?q=North+Nazimabad+Block+H+Karachi",
      image: "/shop-images/north-nazimabad-v2.jpg",
      imageAlt: "XYZ--COFFEE North Nazimabad storefront",
    },
  ];

  return (
    <s-page heading="Our Karachi Locations">
      <s-section heading="Find XYZ--COFFEE near you">
        <s-paragraph>
          We serve specialty coffee and fresh cakes across Karachi. Choose your
          nearest branch and open directions in Google Maps.
        </s-paragraph>
      </s-section>

      <s-section heading="Branch Directory">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "12px",
          }}
        >
          {karachiLocations.map((location, index) => (
            <s-box
              key={location.name}
              borderWidth="base"
              borderRadius="base"
              padding="base"
              background="surface"
            >
              <s-stack direction="block" gap="tight">
                <img
                  src={location.image}
                  alt={location.imageAlt}
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    display: "block",
                    marginBottom: "6px",
                  }}
                />
                <s-stack direction="inline" gap="tight" alignment="center">
                  <s-box borderWidth="base" borderRadius="full" padding="025" background="subdued">
                    <s-text>Branch #{index + 1}</s-text>
                  </s-box>
                  <s-box borderWidth="base" borderRadius="full" padding="025" background="subdued">
                    <s-text>Karachi</s-text>
                  </s-box>
                </s-stack>

                <s-heading>{location.name}</s-heading>
                <s-text>Area: {location.area}</s-text>
                <s-text>Hours: {location.hours}</s-text>
                <s-text>Services: {location.services}</s-text>

                <s-stack direction="inline" gap="tight">
                  <s-link href={location.mapLink} target="_blank">
                    Open in Google Maps
                  </s-link>
                </s-stack>
              </s-stack>
            </s-box>
          ))}
        </div>
      </s-section>

      <s-section slot="aside" heading="Quick Help">
        <s-stack direction="block" gap="tight">
          <s-text>Need a bulk order or event booking?</s-text>
          <s-link href="mailto:hello@xyzcoffee.pk">hello@xyzcoffee.pk</s-link>
          <s-text>Customer support: +92 300 0000000</s-text>
        </s-stack>
      </s-section>
    </s-page>
  );
}
