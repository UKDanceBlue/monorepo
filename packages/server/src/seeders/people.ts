import { faker } from "@faker-js/faker";
import type { CreationAttributes } from "@sequelize/core";

import { PersonModel } from "../models/Person.js";

/**
 *
 */
export default async function () {
  const personData: CreationAttributes<PersonModel>[] = [];
  for (let i = 0; i < 100; i++) {
    const firstName = faker.name.firstName();
    const middleName = faker.name.middleName();
    const lastName = faker.name.lastName();
    const isUky = faker.datatype.number({ min: 0, max: 10 }) > 7;
    const email = faker.internet.email(
      firstName,
      lastName,
      isUky ? "uky.edu" : undefined
    );
    let linkblue: string | undefined;
    if (isUky) {
      const threeDigitNumber = faker.random.numeric(3, {
        allowLeadingZeros: false,
      });
      linkblue = `${firstName[0]!}${middleName[0]!}${lastName[0]!}${lastName[1]!}${threeDigitNumber}`;
    }

    personData.push({
      name: faker.datatype.boolean()
        ? `${firstName} ${middleName} ${lastName}`
        : `${firstName} ${lastName}`,
      email,
      linkblue: linkblue ?? null,
      authIds: {},
    });
  }
  await PersonModel.bulkCreate(personData);
}
