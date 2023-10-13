import seedEvents from "./events.js";
import seedImages from "./images.js";
import seedMemberships from "./memberships.js";
import seedPeople from "./people.js";
import seedTeams from "./teams.js";

/**
 * Seed the database with initial data
 */
export default async function seedDatabase() {
  console.log("Seeding database...");
  await seedImages();
  await seedPeople();
  await seedEvents();
  await seedTeams();
  await seedMemberships();
  console.log("Database seeded");
}
