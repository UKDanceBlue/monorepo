import { faker } from "@faker-js/faker";
import type { CreationAttributes } from "@sequelize/core";
import fetch from "node-fetch";

import { generateThumbHash } from "../lib/thumbHash.js";
import { ImageModel } from "../models/Image.js";

/**
 *
 */
export default async function () {
  const images: CreationAttributes<ImageModel>[] = [];
  const promises: Promise<void>[] = [];
  for (let i = 0; i < 30; i++) {
    promises.push(
      (async () => {
        const width = faker.datatype.number({ min: 100, max: 700 });
        const height = faker.datatype.number({ min: 100, max: 700 });
        const jpegOrWebp = faker.datatype.boolean(); // true = jpeg, false = webp
        const mimeType = `image/${jpegOrWebp ? "jpeg" : "webp"}`;
        const imageUrl = `https://picsum.photos/seed/${faker.word.noun()}/${width}/${height}.${
          jpegOrWebp ? "jpg" : "webp"
        }`;
        // eslint-disable-next-line no-await-in-loop
        const imageRes = await fetch(imageUrl);
        let imageData: ArrayBuffer | null = null;
        let thumbHash: Buffer | null = null;
        if (imageRes.ok) {
          // eslint-disable-next-line no-await-in-loop
          imageData = await imageRes.arrayBuffer();
          // eslint-disable-next-line no-await-in-loop, unicorn/no-await-expression-member
          thumbHash = Buffer.from(
            // eslint-disable-next-line unicorn/no-await-expression-member
            (await generateThumbHash(imageData, {})).buffer
          );
        }
        const image: CreationAttributes<ImageModel> = {
          width,
          height,
          mimeType,
          alt: faker.lorem.sentence(),
          thumbHash,
          url: new URL(imageUrl),
        };
        if (imageData && faker.datatype.number({ min: 0, max: 10 }) > 8) {
          image.url = null;
          image.imageData = Buffer.from(imageData);
        }
        images.push(image);
      })()
    );
  }
  await Promise.all(promises);
  await Promise.all(images.map((event) => ImageModel.create(event)));
}
