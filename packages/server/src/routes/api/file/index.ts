import Router from "@koa/router";
import { Container } from "typedi";

import { FileManager } from "../../../lib/files/FileManager.js";
import { combineMimePartsToString } from "../../../lib/files/mime.js";

const fileRouter = new Router({ prefix: "/file" });

fileRouter.get("/download/:uuid", async (ctx) => {
  const fileManager = Container.get(FileManager);

  const { uuid } = ctx.params;
  const { download } = ctx.query;

  let disposition: "inline" | "attachment" = "inline";
  if (download === "true") {
    disposition = "attachment";
  }

  if (!uuid) {
    ctx.throw(400, "No file UUID provided");
  } else {
    const val = await fileManager.getFileStream({ uuid });
    if (!val) {
      ctx.throw(404, "File not found");
    } else {
      ctx.body = val.stream;
      ctx.type = combineMimePartsToString(
        val.file.mimeTypeName,
        val.file.mimeSubtypeName,
        val.file.mimeParameters
      );
      ctx.attachment(val.file.filename, {
        type: disposition,
      });
      ctx.status = 200;
    }
  }
});

export default fileRouter;
