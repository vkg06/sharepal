const siteContent = {
  cities: ["Bangalore", "Delhi", "Mumbai", "Hyderabad", "Pune", "Chennai", "Gurgaon", "Noida"],
  subCategories: [
    {
      id: "all",
      label: "All",
      icon: "🎮"
    },

    {
      id: "gta",
      label: "GTA VI",
      icon: "🎮"
    },

    {
      id: "ps5",
      label: "PS5 Console",
      icon: "🎮"
    },

    {
      id: "xbox",
      label: "Xbox Console",
      icon: "🎮"
    },

    {
      id: "vr",
      label: "VR",
      icon: "🥽"
    },

    {
      id: "racing",
      label: "Racing Wheel",
      icon: "🏎️"
    },

    {
      id: "big-screen",
      label: "Big Screen Gaming",
      icon: "🖥️"
    }
  ],
  menu: [
    {
      label: "Photography",
      items: [
        { label: "DJI Drones" },
        { label: "360 Cameras" },
        { label: "Vlogging" },
        { label: "GoPro Cameras" },
        { label: "Mobile Gimbals" },

        { label: "iPhones" },
        { label: "Action Cameras" },
        { label: "UNLMTD Vlogging" },
        { label: "Insta360 Cameras" },
        { label: "Wireless & Collar Mics" },

        { label: "Cameras" },
        { label: "DSLR Cameras" },
        { label: "Wildlife Photography" },
        { label: "DJI Cameras" },
        { label: "DSLR Lens" },

        { label: "Pocket Cameras" },
        { label: "Mirrorless Cameras" },
        { label: "Professional Cameras" },
        { label: "DSLR Gimbal Combos" },
        { label: "Tripod and camera accessories" },

        { label: "Action Camera Mounts" },
        { label: "Action Camera Add ons" }
      ]
    },

    {
      label: "Gaming",
      items: [
        { label: "GTA VI", sub: "gta" },
        { label: "PS5 Console", sub: "ps5" },
        { label: "Xbox Console", sub: "xbox" },
        { label: "VR", sub: "vr" },
        { label: "Racing Wheel", sub: "racing" },
        { label: "Big Screen Gaming", sub: "big-screen" }
      ]
    },

    {
      label: "Outdoor",
      items: [
        { label: "Trekking Gear" },
        { label: "Snow Boots" },
        { label: "Winter Jackets" },
        { label: "Riding Luggage" },
        { label: "Camping Stools & Tables" },

        { label: "Riding Gear" },
        { label: "Trekking Jackets" },
        { label: "Riding Jackets" },
        { label: "Backpacks" },
        { label: "Sleeping Bags & Mats" },

        { label: "Camping Gear" },
        { label: "Trek/Snow Pants" },
        { label: "Riding Boots" },
        { label: "Binoculars" },

        { label: "Trekking Shoes" },
        { label: "Trek Accessories" },
        { label: "Riding Essentials" },
        { label: "Camping Tents" }
      ]
    },

    {
      label: "Entertainment",
      items: [
        { label: "Projectors" },
        { label: "Speakers" },
        { label: "Mics" },
        { label: "VR" }
      ]
    }
  ],
  faqs: [
    { q: "How can I rent from SharePal?", a: "Choose your city, pick delivery and pickup dates, add the product to your cart and complete a quick verification. We deliver to your doorstep and pick it up when your rental ends." },
    { q: "If I rent multiple products, do I need to extend the rental duration for all or partial extension is possible?", a: "Partial extension is possible. You can extend only the products you still need from your orders page, subject to availability." },
    { q: "When does the rental start?", a: "Your rental starts on the delivery date you select at checkout and ends on the pickup date." },
    { q: "What will be the condition of the products at the time of delivery?", a: "Every product is cleaned, tested and handed over in working condition. If something isn't right, contact support right away." },
    { q: "Why is verification required?", a: "Verification keeps the community safe and lets us offer high-value gear on rent with a refundable deposit." }
  ],
  moreFaqs: [
    { q: "Do I need to pay a security deposit?", a: "Yes. A refundable deposit is collected at checkout and returned once the product is picked up and checked." },
    { q: "Is delivery free?", a: "Delivery and pickup are free on most orders within your city." },
    { q: "What happens if a product gets damaged?", a: "Normal wear is fine. For serious damage, repair charges may be deducted from the deposit. Contact support immediately if anything happens." }
  ],
  categoryGroups: [
    { title: "Action Cameras", links: ["Action Cameras", "Pocket Cameras", "GoPro Cameras", "DJI Cameras", "DJI Drones", "360 Cameras"] },
    { title: "Cameras", links: ["DSLR Cameras", "Cameras", "iPhones", "DSLR Gimbal Combos", "Wildlife Photography", "Tripod and camera accessories"] },
    { title: "Trekking Gear", links: ["Trekking Gear", "Trekking Jackets", "Trek/Snow Pants", "Trekking Shoes", "Trek Accessories"] },
    { title: "Riding Gear", links: ["Riding Gear", "Riding Luggage", "Riding Jackets", "Riding Essentials", "Riding Boots", "Binoculars"] },
    { title: "Creator Gear", links: ["Wireless & Collar Mics", "Professional Cameras", "Mirrorless Cameras", "UNLMTD Vlogging", "Mobile Gimbals", "Vlogging"] },
    { title: "Gaming Console", links: [{ label: "PS5 Console", sub: "consoles" }, "VR", { label: "Racing Wheel", sub: "racing" }, "Big Screen Gaming", "Xbox Console"] },
    { title: "Winter Wear", links: ["Snow Boots", "Winter Jackets", "Backpacks"] },
    { title: "Camping Gear", links: ["Camping Gear", "Camping Stools & Tables", "Camping Tents", "Sleeping Bags & Mats"] },
    { title: "Audio Visual Equipment", links: ["Projectors", "VR", "Mics", "Speakers"] }
  ],
  footerColumns: [
    { title: "Sharepal", links: ["About", "Why SharePal", "Sitemap", "CarePal"] },
    { title: "Become a Pal", links: ["Sharepal for Creators", "Careers", "Sharepal for Brands", { label: "Asset Funding Program", isNew: true }, { label: "Rent Your Gear", isNew: true }] },
    { title: "Information", links: ["How it works?", "FAQs", "Verification", "Cancellation Policy", "Life at Sharepal"] },
    { title: "Policies", links: ["Terms & Condition", "Shipping policy", "Damage Policy", "Terms of Use", "Privacy Policy"] }
  ],
  seo: {
    title: "Renting from SharePal in {city}",
    intro: "Discover the convenience of renting from SharePal, your trusted partner in {city} for all your rental needs. Whether you're exploring the vibrant streets of Koramangala, setting up a shoot in Indiranagar, or planning a trek from the outskirts of Whitefield, SharePal has you covered. We offer a wide range of products, including cameras, action cameras, gaming consoles, projectors, speakers, trekking gear, riding gear, and creator gear. With free home delivery and pickup services, flexible rental tenures, and an easy-to-use platform, renting has never been easier. Experience the freedom to rent what you need, when you need it, without the commitment of buying.",
    categoryTitle: "Categories on Rent",
    categoryLink: "Action Cameras on Rent",
    categoryText: "Capture your adventures in stunning detail with our range of action cameras. Choose from top brands like GoPro, Insta360, and DJI, perfect for everything from extreme sports to casual vlogging. Whether you need high-quality video for your next trek or a 360-degree camera to capture every angle, we've got you covered.",
    gamingLink: "Gaming Consoles on Rent",
    gamingText: "Rent a PS5 in {city} with 100+ games, extra controllers and subscriptions like EA Play. Try the latest FC releases, racing wheel combos or digital game bundles for a weekend, a week or a month, without paying for a new console."
  },
  orders: { heading: "Served more than", highlighted: "1 Lakh Orders", text: "Cameras, consoles, trekking gear and more, delivered right to your door." }
};

module.exports = siteContent;
