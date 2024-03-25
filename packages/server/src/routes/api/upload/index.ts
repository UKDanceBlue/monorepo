import Router from "@koa/router";
import { Container } from "typedi";

import { koaBody } from "koa-body";
import { ImageRepository } from "../../../repositories/image/ImageRepository.js";

const uploadRouter = new Router({ prefix: "/upload" });

// Multipart image upload
uploadRouter.post("/image/:uuid",koaBody({multipart: true,formidable: {
  allowEmptyFiles: false,
}}), async (ctx) => {
  const imageRepository = Container.get(ImageRepository);

  const { uuid } = ctx.params;

  const image = ctx.request.files?.image;

  if (!image) {
    ctx.throw(400, "No image uploaded");
  } else if (Array.isArray(image)) {
    ctx.throw(400, "Only one file can be attached to an image");
  } else {
    image.
  }
});

export default uploadRouter;
