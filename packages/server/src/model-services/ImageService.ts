import type { GraphQLResource } from "@ukdanceblue/common";
import { GraphQLService } from "@ukdanceblue/common";

import { InvariantError } from "../lib/CustomErrors.js";
import { ImageIntermediate, ImageModel } from "../models/Image.js";

export class ImageService implements GraphQLService.ImageServiceInterface {
  async getByUuid(uuid: string) {
    const result = await ImageModel.findOne({
      where: {
        uuid,
      },
    });
    if (!result) {
      return null;
    }
    const intermediate = new ImageIntermediate(result);
    return intermediate.toResource();
  }

  async getThumbHashByUUid(uuid: string) {
    const result = await ImageModel.findOne({
      where: {
        uuid
      },
      attributes: ["thumbHash"],
    });
    if (!result) {
      return null;
    }
    return result.thumbHash?.toString("base64") ?? null;
  }

  async set(uuid: string, input: GraphQLResource.ImageResource) {
    const [affected, result] = await ImageModel.update(
      {
        width: input.width,
        height: input.height,
        url: input.url,
        alt: input.alt,
        imageData: input.imageData ? Buffer.from(input.imageData, "base64") : null,
        mimeType: input.mimeType,
        thumbHash: input.thumbHash ? Buffer.from(input.thumbHash, "base64") : null,
      },
      {
        where: {
          uuid,
        },
        returning: true,
      },
    );
    if (affected === 0) {
      return {
        errorMessage: `Image does not exist`,
        errorDetails: `Image with id ${uuid} does not exist`,
      };
    } else if (affected > 1) {
      throw new InvariantError(`More than one image with id ${uuid} exists`);
    } else if (result[0]) {
      return new ImageIntermediate(result[0]).toResource();
    } else {
      throw new InvariantError(`No value returned from update`);
    }
  }

  async create(input: GraphQLResource.ImageResource) {
    const image = await ImageModel.create({
      width: input.width,
      height: input.height,
      url: input.url,
      alt: input.alt,
      imageData: input.imageData ? Buffer.from(input.imageData, "base64") : null,
      mimeType: input.mimeType,
      thumbHash: input.thumbHash ? Buffer.from(input.thumbHash, "base64") : null,
    });
    const data = new ImageIntermediate(image).toResource();
    return {
      data,
      uuid: image.uuid,
    };
  }

  async delete(uuid: string) {
    const affected = await ImageModel.destroy({
      where: {
        uuid,
      },
    });
    if (affected === 0) {
      return {
        errorMessage: `Image does not exist`,
        errorDetails: `Image with id ${uuid} does not exist`,
      };
    }
    return true;
  }
}

GraphQLService.graphQLServiceContainer.set({ id: GraphQLService.imageServiceToken, type: ImageService });