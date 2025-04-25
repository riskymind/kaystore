import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";
import dotenv from "dotenv"

dotenv.config()

neonConfig.webSocketConstructor = ws;

const connectionString = `${process.env.DATABASE_URL}`;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in the environment!");
}

// console.log("Using connection string:", connectionString);

// const pool = new Pool({ connectionString });
// const adapter = new PrismaNeon(pool);

const adapter = new PrismaNeon({ connectionString })

export const prisma = new PrismaClient({ adapter}).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        }
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        }
      }
    }
  }
});

