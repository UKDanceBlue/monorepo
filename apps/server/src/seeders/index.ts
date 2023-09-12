import seedEvents from "./events.js";
import seedImages from "./images.js";
import seedPeople from "./people.js";

/**
 * Seed the database with initial data
 */
export default async function seedDatabase() {
  console.log("Seeding database...");
  await seedImages();
  await seedPeople();
  await seedEvents();
  console.log("Database seeded");
}
