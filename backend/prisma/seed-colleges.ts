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
  mainImage: string;
  hoverImage: string;
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
    mainImage: img("photo-1572635196237-14b3f281503f"),
    hoverImage: img("photo-1515886657613-9f3515b0c78f"),
    colors: "orange, blue and white",
    suffixes: GENERIC_SUFFIXES,
  },
  {
    tag: "fsu",
    prefix: "FSU",
    priceMin: 28,
    priceMax: 110,
    mainImage: img("photo-1529139574466-a303027c1d8b"),
    hoverImage: img("photo-1483985988355-763728e1935b"),
    colors: "garnet, gold and black",
    suffixes: FSU_SUFFIXES,
  },
  {
    tag: "ucf",
    prefix: "UCF",
    priceMin: 28,
    priceMax: 95,
    mainImage: img("photo-1469334031218-e382a71b716b"),
    hoverImage: img("photo-1496747611176-843222e1e57c"),
    colors: "black, gold and white",
    suffixes: GENERIC_SUFFIXES,
  },
  {
    tag: "usf",
    prefix: "USF",
    priceMin: 28,
    priceMax: 90,
    mainImage: img("photo-1485968579580-b6d095142e6e"),
    hoverImage: img("photo-1581044777550-4cfa60707c03"),
    colors: "forest green, gold and white",
    suffixes: GENERIC_SUFFIXES,
  },
  {
    tag: "fau",
    prefix: "FAU",
    priceMin: 25,
    priceMax: 85,
    mainImage: img("photo-1552374196-c4e7ffc6e126"),
    hoverImage: img("photo-1514866747592-c2d279258a78"),
    colors: "navy blue, red and white",
    suffixes: GENERIC_SUFFIXES,
  },
  {
    tag: "miami",
    prefix: "Miami",
    priceMin: 30,
    priceMax: 100,
    mainImage: img("photo-1539109136881-3be0616acf4b"),
    hoverImage: img("photo-1475178626620-a4d074967452"),
    colors: "orange, green and white",
    suffixes: GENERIC_SUFFIXES,
  },
  {
    tag: "howard",
    prefix: "Howard",
    priceMin: 30,
    priceMax: 105,
    mainImage: img("photo-1517841905240-472988babdf9"),
    hoverImage: img("photo-1524504388940-b1c1722653e1"),
    colors: "royal blue, white and black",
    suffixes: GENERIC_SUFFIXES,
  },
  {
    tag: "famu",
    prefix: "FAMU",
    priceMin: 28,
    priceMax: 95,
    mainImage: img("photo-1488161628813-04466f872be2"),
    hoverImage: img("photo-1556821840-3a63f15732ce"),
    colors: "orange, green and black",
    suffixes: GENERIC_SUFFIXES,
  },
  {
    tag: "bcu",
    prefix: "BCU",
    priceMin: 25,
    priceMax: 90,
    mainImage: img("photo-1564257631407-4deb1f99d992"),
    hoverImage: img("photo-1542272604-787c3835535d"),
    colors: "maroon, gold and white",
    suffixes: GENERIC_SUFFIXES,
  },
  {
    tag: "spelman",
    prefix: "Spelman",
    priceMin: 30,
    priceMax: 110,
    mainImage: img("photo-1509631179647-0177331693ae"),
    hoverImage: img("photo-1591047139829-d91aecb6caea"),
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
        images: [college.mainImage, college.hoverImage],
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
