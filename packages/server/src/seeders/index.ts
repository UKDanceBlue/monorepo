import seedEventsFake from "./fake/events.js";
import seedImagesFake from "./fake/images.js";
import seedMembershipsFake from "./fake/memberships.js";
import seedPeopleFake from "./fake/people.js";
import seedTeamsFake from "./fake/teams.js";

/**
 * Seed the database with initial data
 */
export default async function seedDatabase() {
  console.log("Seeding database...");
  await seedImagesFake();
  await seedPeopleFake();
  await seedEventsFake();
  await seedTeamsFake();
  await seedMembershipsFake();
  console.log("Database seeded");
}
