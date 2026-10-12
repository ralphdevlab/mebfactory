import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// Garment-type price tiers, shared across every collection: a fraction of
// that collection's [priceMin, priceMax] range. Outerwear/sets sit near the
// top, tees/tanks near the bottom. Checked in order since some suffixes
// (e.g. "Zip Hoodie") match more than one keyword.
function priceFraction(suffix: string): number {
  const s = suffix.toLowerCase();
  if (/jacket|bomber|windbreaker/.test(s)) return 0.9;
  if (/track suit|satin set/.test(s)) return 1.0;
  if (/hoodie/.test(s)) return 0.75;
  if (/zip/.test(s)) return 0.65;
  if (/crewneck|pullover/.test(s)) return 0.55;
  if (/sweatpants|joggers|track pants|wide leg|cropped sweat/.test(s)) return 0.5;
  if (/skirt/.test(s)) return 0.4;
  if (/mesh top/.test(s)) return 0.35;
  if (/shorts/.test(s)) return 0.3;
  if (/tee|long sleeve|thermal/.test(s)) return 0.25;
  if (/tank/.test(s)) return 0.2;
  return 0.45;
}

function priceFor(suffix: string, min: number, max: number): number {
  const raw = min + priceFraction(suffix) * (max - min);
  const rounded = Math.round(raw / 5) * 5;
  return Math.min(max, Math.max(min, rounded));
}

// The 20 garment suffixes reused (with each college's own name prefix)
// across every collection except FSU, which has its own explicit list.
const GENERIC_SUFFIXES = [
  "Oversized Hoodie",
  "Crop Tee",
  "Sweatpants",
  "Fleece Jacket",
  "Crewneck",
  "Biker Shorts",
  "Track Pants",
  "Zip-Up",
  "Long Sleeve",
  "Cargo Shorts",
  "Mesh Shorts",
  "Satin Skirt",
  "Ribbed Tank",
  "Varsity Tee",
  "Pullover",
  "Wide Leg Pants",
  "Cropped Jacket",
  "Running Shorts",
  "Thermal Tee",
  "Bomber Jacket",
];

const FSU_SUFFIXES = [
  "Varsity Hoodie",
  "Crop Tee",
  "Sweatpants",
  "Satin Set",
  "Crewneck",
  "Mini Skirt",
  "Track Suit",
  "Zip Hoodie",
  "Long Sleeve",
  "Biker Shorts",
  "Mesh Top",
  "Joggers",
  "Ribbed Tank",
  "Varsity Jacket",
  "Pullover",
  "Wide Leg",
  "Cropped Sweat",
  "Shorts",
  "Thermal",
  "Windbreaker",
];

// 5 isNew + 3 on-sale (non-overlapping) picks out of each 20-item list.
const NEW_INDICES = new Set([0, 4, 8, 12, 16]);
const SALE_INDICES = new Set([2, 9, 15]);

// Alternates "woman" / "man" / "unisex" by position within a collection.
const CATEGORY_CYCLE = ["woman", "man", "unisex"];

interface CollegeDef {
  tag: string;
  prefix: string;
  priceMin: number;
  priceMax: number;
  // 10 Unsplash photos matching the school's palette. Products cycle through
  // these two-at-a-time (index % 10, (index + 1) % 10) so no two adjacent
  // products in a collection share an image.
  images: string[];
  colors: string;
  suffixes: string[];
}

const img = (id: string) => `https://images.unsplash.com/${id}?w=600&q=80`;

const COLLEGES: CollegeDef[] = [
  {
    tag: "uf",
    prefix: "UF",
    priceMin: 28,
    priceMax: 95,
    images: [
      "photo-1572635196237-14b3f281503f",
      "photo-1556821840-3a63f15732ce",
      "photo-1594938298603-c8148c4b4d17",
      "photo-1503341504253-dff4815485f1",
      "photo-1516826957135-700dedea698c",
      "photo-1539185441755-769473a23570",
      "photo-1542060748-10c28b62716f",
      "photo-1503341733017-1901578f9f1e",
      "photo-1524863479829-916d8e77f114",
      "photo-1507679799987-c73779587ccf",
    ].map(img),
    colors: "orange, blue and white",
    suffixes: GENERIC_SUFFIXES,
  },
  {
    tag: "fsu",
    prefix: "FSU",
    priceMin: 28,
    priceMax: 110,
    images: [
      "photo-1529139574466-a303027c1d8b",
      "photo-1483985988355-763728e1935b",
      "photo-1509631179647-0177331693ae",
      "photo-1515886657613-9f3515b0c78f",
      "photo-1469334031218-e382a71b716b",
      "photo-1539109136881-3be0616acf4b",
      "photo-1496747611176-843222e1e57c",
      "photo-1552374196-c4e7ffc6e126",
      "photo-1485968579580-b6d095142e6e",
      "photo-1475178626620-a4d074967452",
    ].map(img),
    colors: "garnet, gold and black",
    suffixes: FSU_SUFFIXES,
  },
  {
    tag: "ucf",
    prefix: "UCF",
    priceMin: 28,
    priceMax: 95,
    images: [
      "photo-1490481651871-ab68de25d43d",
      "photo-1509631179647-0177331693ae",
      "photo-1496747611176-843222e1e57c",
      "photo-1552374196-c4e7ffc6e126",
      "photo-1485968579580-b6d095142e6e",
      "photo-1581044777550-4cfa60707c03",
      "photo-1514866747592-c2d279258a78",
      "photo-1539109136881-3be0616acf4b",
      "photo-1517841905240-472988babdf9",
      "photo-1524504388940-b1c1722653e1",
    ].map(img),
    colors: "black, gold and white",
    suffixes: GENERIC_SUFFIXES,
  },
  {
    tag: "usf",
    prefix: "USF",
    priceMin: 28,
    priceMax: 90,
    images: [
      "photo-1485968579580-b6d095142e6e",
      "photo-1581044777550-4cfa60707c03",
      "photo-1529139574466-a303027c1d8b",
      "photo-1483985988355-763728e1935b",
      "photo-1494790108377-be9c29b29330",
      "photo-1531746020798-e6953c6e8e04",
      "photo-1524863479829-916d8e77f114",
      "photo-1503341504253-dff4815485f1",
      "photo-1507679799987-c73779587ccf",
      "photo-1516826957135-700dedea698c",
    ].map(img),
    colors: "forest green, gold and white",
    suffixes: GENERIC_SUFFIXES,
  },
  {
    tag: "fau",
    prefix: "FAU",
    priceMin: 25,
    priceMax: 85,
    images: [
      "photo-1552374196-c4e7ffc6e126",
      "photo-1514866747592-c2d279258a78",
      "photo-1539109136881-3be0616acf4b",
      "photo-1488161628813-04466f872be2",
      "photo-1490481651871-ab68de25d43d",
      "photo-1542060748-10c28b62716f",
      "photo-1503341733017-1901578f9f1e",
      "photo-1556821840-3a63f15732ce",
      "photo-1594938298603-c8148c4b4d17",
      "photo-1503341504253-dff4815485f1",
    ].map(img),
    colors: "navy blue, red and white",
    suffixes: GENERIC_SUFFIXES,
  },
  {
    tag: "miami",
    prefix: "Miami",
    priceMin: 30,
    priceMax: 100,
    images: [
      "photo-1539109136881-3be0616acf4b",
      "photo-1475178626620-a4d074967452",
      "photo-1572635196237-14b3f281503f",
      "photo-1516826957135-700dedea698c",
      "photo-1524863479829-916d8e77f114",
      "photo-1531746020798-e6953c6e8e04",
      "photo-1494790108377-be9c29b29330",
      "photo-1507679799987-c73779587ccf",
      "photo-1503341733017-1901578f9f1e",
      "photo-1542060748-10c28b62716f",
    ].map(img),
    colors: "orange, green and white",
    suffixes: GENERIC_SUFFIXES,
  },
  {
    tag: "howard",
    prefix: "Howard",
    priceMin: 30,
    priceMax: 105,
    images: [
      "photo-1517841905240-472988babdf9",
      "photo-1524504388940-b1c1722653e1",
      "photo-1531746020798-e6953c6e8e04",
      "photo-1494790108377-be9c29b29330",
      "photo-1488161628813-04466f872be2",
      "photo-1490481651871-ab68de25d43d",
      "photo-1509631179647-0177331693ae",
      "photo-1515886657613-9f3515b0c78f",
      "photo-1469334031218-e382a71b716b",
      "photo-1483985988355-763728e1935b",
    ].map(img),
    colors: "royal blue, white and black",
    suffixes: GENERIC_SUFFIXES,
  },
  {
    tag: "famu",
    prefix: "FAMU",
    priceMin: 28,
    priceMax: 95,
    images: [
      "photo-1488161628813-04466f872be2",
      "photo-1556821840-3a63f15732ce",
      "photo-1594938298603-c8148c4b4d17",
      "photo-1503341504253-dff4815485f1",
      "photo-1572635196237-14b3f281503f",
      "photo-1516826957135-700dedea698c",
      "photo-1531746020798-e6953c6e8e04",
      "photo-1494790108377-be9c29b29330",
      "photo-1524863479829-916d8e77f114",
      "photo-1507679799987-c73779587ccf",
    ].map(img),
    colors: "orange, green and black",
    suffixes: GENERIC_SUFFIXES,
  },
  {
    tag: "bcu",
    prefix: "BCU",
    priceMin: 25,
    priceMax: 90,
    images: [
      "photo-1564257631407-4deb1f99d992",
      "photo-1542272604-787c3835535d",
      "photo-1529139574466-a303027c1d8b",
      "photo-1483985988355-763728e1935b",
      "photo-1509631179647-0177331693ae",
      "photo-1515886657613-9f3515b0c78f",
      "photo-1469334031218-e382a71b716b",
      "photo-1539109136881-3be0616acf4b",
      "photo-1496747611176-843222e1e57c",
      "photo-1552374196-c4e7ffc6e126",
    ].map(img),
    colors: "maroon, gold and white",
    suffixes: GENERIC_SUFFIXES,
  },
  {
    tag: "spelman",
    prefix: "Spelman",
    priceMin: 30,
    priceMax: 110,
    images: [
      "photo-1509631179647-0177331693ae",
      "photo-1591047139829-d91aecb6caea",
      "photo-1524504388940-b1c1722653e1",
      "photo-1517841905240-472988babdf9",
      "photo-1494790108377-be9c29b29330",
      "photo-1531746020798-e6953c6e8e04",
      "photo-1488161628813-04466f872be2",
      "photo-1490481651871-ab68de25d43d",
      "photo-1542060748-10c28b62716f",
      "photo-1503341733017-1901578f9f1e",
    ].map(img),
    colors: "navy, white and gold",
    suffixes: GENERIC_SUFFIXES,
  },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

function buildProducts(): Prisma.ProductCreateManyInput[] {
  const products: Prisma.ProductCreateManyInput[] = [];

  for (const college of COLLEGES) {
    college.suffixes.forEach((suffix, i) => {
      const name = `${college.prefix} ${suffix}`;
      const price = priceFor(suffix, college.priceMin, college.priceMax);
      const onSale = SALE_INDICES.has(i);
      const salePrice = onSale
        ? Math.max(college.priceMin, Math.round((price * 0.75) / 5) * 5)
        : null;

      products.push({
        name,
        description: `${name} in ${college.prefix}'s ${college.colors} colorway — color-blocked fan style, no logos or branding.`,
        price,
        salePrice,
        category: CATEGORY_CYCLE[i % CATEGORY_CYCLE.length],
        collection: college.tag,
        sizes: SIZES,
        images: [
          college.images[i % college.images.length],
          college.images[(i + 1) % college.images.length],
        ],
        isNew: NEW_INDICES.has(i),
        inStock: true,
      });
    });
  }

  return products;
}

async function main() {
  const products = buildProducts();

  const { count: deleted } = await prisma.product.deleteMany({});
  console.log(`Cleared ${deleted} existing products.`);

  await prisma.product.createMany({ data: products });
  console.log(`Seeded ${products.length} products across ${COLLEGES.length} collections.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
