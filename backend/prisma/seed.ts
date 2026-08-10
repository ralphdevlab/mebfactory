import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Same catalog that used to live in the frontend's hardcoded src/data/products.ts,
// carried over here now that the frontend fetches products from this database
// instead. Image URLs point at the same placehold.co placeholders as before.
const img = (seed: string) =>
  `https://placehold.co/600x800/ECEAE6/2C2C2C?font=montserrat&text=${encodeURIComponent(seed)}`;

const products = [
  {
    name: "Structured Wool Coat",
    category: "Outerwear",
    price: 480,
    images: [img("Wool Coat")],
    isNew: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "A structured wool coat with a clean silhouette, cut for a relaxed, oversized fit.",
  },
  {
    name: "Cotton Poplin Shirt",
    category: "Shirts",
    price: 145,
    salePrice: 99,
    images: [img("Poplin Shirt")],
    isNew: false,
    sizes: ["XS", "S", "M", "L"],
    description: "Crisp cotton poplin shirt with a straight hem and mother-of-pearl buttons.",
  },
  {
    name: "Tailored Wide-Leg Trouser",
    category: "Trousers",
    price: 220,
    images: [img("Wide-Leg Trouser")],
    isNew: false,
    sizes: ["S", "M", "L", "XL"],
    description: "High-waisted wide-leg trouser in a heavyweight twill.",
  },
  {
    name: "Cashmere Blend Sweater",
    category: "Knitwear",
    price: 320,
    images: [img("Cashmere Sweater")],
    isNew: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Soft cashmere-blend crewneck sweater with ribbed trims.",
  },
  {
    name: "Leather Ankle Boot",
    category: "Footwear",
    price: 390,
    images: [img("Ankle Boot")],
    isNew: false,
    sizes: ["36", "37", "38", "39", "40", "41"],
    description: "Minimal leather ankle boot with a stacked block heel.",
  },
  {
    name: "Silk Slip Dress",
    category: "Dresses",
    price: 260,
    salePrice: 180,
    images: [img("Silk Slip Dress")],
    isNew: false,
    sizes: ["XS", "S", "M", "L"],
    description: "Bias-cut silk slip dress with adjustable straps.",
  },
  {
    name: "Canvas Tote Bag",
    category: "Accessories",
    price: 95,
    images: [img("Canvas Tote")],
    isNew: false,
    sizes: ["One Size"],
    description: "Heavyweight canvas tote with interior pocket and leather handles.",
  },
  {
    name: "Merino Wool Scarf",
    category: "Accessories",
    price: 85,
    images: [img("Wool Scarf")],
    isNew: true,
    sizes: ["One Size"],
    description: "Lightweight merino wool scarf with a fringed edge.",
  },
  {
    name: "Relaxed Denim Jacket",
    category: "Outerwear",
    price: 210,
    images: [img("Denim Jacket")],
    isNew: false,
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Washed denim jacket with a boxy, relaxed fit.",
  },
  {
    name: "Ribbed Tank Top",
    category: "Shirts",
    price: 65,
    images: [img("Ribbed Tank")],
    isNew: false,
    sizes: ["XS", "S", "M", "L"],
    description: "Fitted ribbed-knit tank in a mid-weight cotton blend.",
  },
  {
    name: "Pleated Midi Skirt",
    category: "Skirts",
    price: 175,
    salePrice: 120,
    images: [img("Midi Skirt")],
    isNew: false,
    sizes: ["XS", "S", "M", "L"],
    description: "Pleated midi skirt in a fluid satin finish.",
  },
  {
    name: "Leather Belt",
    category: "Accessories",
    price: 110,
    images: [img("Leather Belt")],
    isNew: true,
    sizes: ["S", "M", "L"],
    description: "Full-grain leather belt with a matte brass buckle.",
  },
];

async function main() {
  const existing = await prisma.product.count();
  if (existing > 0) {
    console.log(`Products table already has ${existing} rows; skipping seed.`);
    return;
  }

  await prisma.product.createMany({ data: products });
  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
