import { Service } from "@freshgum/typedi";
import { Request, Response } from "express";

import { FileManager } from "#files/FileManager.js";
import { combineMimePartsToString } from "#files/mime.js";
import { RouterService } from "#routes/RouteService.js";

@Service([FileManager])
export default class FileRouter extends RouterService {
  constructor(fileManager: FileManager) {
    super("/file");

    this.addGetRoute("/download/:uuid", async (req: Request, res: Response) => {
      const { uuid } = req.params;
      const { download } = req.query;

      let disposition: "inline" | "attachment" = "inline";
      if (download === "true") {
        disposition = "attachment";
      }

      if (!uuid) {
        res.status(400).send("No file UUID provided");
      } else {
        const val = await fileManager.getFileStream({ uuid });
        if (!val) {
          res.status(404).send("File not found");
        } else {
          res.setHeader(
            "Content-Type",
            combineMimePartsToString(
              val.file.mimeTypeName,
              val.file.mimeSubtypeName,
              val.file.mimeParameters
            )
          );
          res.setHeader(
            "Content-Disposition",
            `${disposition}; filename="${val.file.filename}"`
          );
          res.status(200);
          val.stream.pipe(res);
        }
      }
    });
  }
}
