import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = [];

  for (let i = 0; i < 10; i++) {
    const name = `Coffee ${i}`;
    const description = `Description for Coffee ${i}`;
    const price = getRandomFloat(5, 15);
    const origin = getRandomCountry();
    const type = getRandomCoffeeType();
    const weight = getRandomFloat(0.25, 1.5); 
    const stock = getRandomInt(10, 100); 
    const dateAdded = getRandomDate(new Date(2022, 0, 1), new Date()); 
    const availability = Math.random() < 0.8; 
    const averageRating = Math.random() * 5; 

    const product = prisma.product.upsert({
      where: { id:i+1 },
      update: {},
      create: {
        name,
        description,
        price,
        origin,
        type,
        weight,
        stock,
        dateAdded,
        availability,
        averageRating,
      },
    });

    products.push(product);
  }
}

main()
  .catch(async (e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomCountry() {
  const countries = ['Brazil', 'Colombia', 'Ethiopia', 'Vietnam', 'Indonesia'];
  return countries[Math.floor(Math.random() * countries.length)];
}

function getRandomCoffeeType() {
  const types = ['Arabica', 'Robusta', 'Liberica', 'Excelsa'];
  return types[Math.floor(Math.random() * types.length)];
}
