import type { Primitive, PrimitiveObject } from "@ukdanceblue/db-app-common";
import { isPrimitive, isPrimitiveObject } from "@ukdanceblue/db-app-common";
import type { Request, Response } from "express";

// Strings will be light blue, numbers will be purple,
// true will be dark green, and false will be light red,
// null will be dark red, and undefined will be dark gray.
const stringColor = "#11aaff";
const numberColor = "#aa11ff";
const trueColor = "#11ff11";
const falseColor = "#cc1111";
const nullColor = "#ff0000";
const undefinedColor = "#888888";

/**
 * Recursively converts a primitive or primitive object to an HTML string
 * suitable for including in a document body.
 *
 * @param content The content to convert
 * @param indentationLevel The indentation level to use
 * @return The HTML string
 */
function htmlifyJson(
  content: Primitive | PrimitiveObject | PrimitiveObject[] | Primitive[],
  indentationLevel = 0
): string {
  if (Array.isArray(content)) {
    return `<article><span>Array (${
      content.length
    } Elements)</span><ol style="margin-block-start: 0; margin-block-end: 0;" start="0">${content
      .map((item) => `<li>${htmlifyJson(item, indentationLevel + 1)}</li>`)
      .join("")}</ol></article>`;
  }
  if (isPrimitiveObject(content)) {
    // If we are at indent level 0 skip the list
    if (indentationLevel === 0) {
      return Object.entries(content)
        .map(
          ([key, value]) => `<article>${key}: ${htmlifyJson(value)}</article>`
        )
        .join("");
    } else {
      return `<article><span>Object:</span><ul>${Object.entries(content)
        .map(
          ([key, value]) =>
            `<li>${key}: ${htmlifyJson(value, indentationLevel + 1)}</li>`
        )
        .join("")}</ul></article>`;
    }
  }
  if (typeof content === "string") {
    return `<span style="color: ${stringColor}">"${content}"</span>`;
  }
  if (typeof content === "number") {
    return `<span style="color: ${numberColor}">${content}</span>`;
  }
  if (typeof content === "boolean") {
    return `<span style="color: ${content ? trueColor : falseColor}">${
      content ? "True" : "False"
    }</span>`;
  }
  if (content === null) {
    return `<span style="color: ${nullColor}">Null</span>`;
  }
  return `<span style="color: ${undefinedColor}">No Content</span>`;
}

/**
 * Sends a response to the client. If the client accepts HTML, it will send
 * the content as HTML. Otherwise, it will send the content as JSON.
 * If the content is undefined, it will send no body.
 *
 * @param res The response object
 * @param req The request object
 * @param content The content to send
 * @param status The status code to send
 * @return The response
 */
export function sendResponse(
  res: Response,
  req: Request,
  content?: unknown,
  status = 200
) {
  res.status(status);
  if (content === undefined) {
    return res.send();
  }

  return res.format({
    html: () => {
      if (!(isPrimitive(content) || isPrimitiveObject(content))) {
        const stringifiedContent = JSON.stringify(content, null, 2);
        return res.send(stringifiedContent);
      } else {
        return res
          .contentType("text/html")
          .send(
            `<!DOCTYPE html><html><head><meta name="robots" content="noindex"><title>DanceBlue API Viewer</title></head><body style="font-family: monospace; color: lightgray; background-color: black;">${htmlifyJson(
              content ?? undefined
            )}</body></html>`
          );
      }
    },
    json: () => {
      return res.json(content);
    },
    text: () => {
      const stringifiedContent = JSON.stringify(content, null, 2);
      return res
        .contentType("text/plain; charset=utf-8")
        .send(stringifiedContent);
    },
    default: () => {
      return res.status(406).send("Not Acceptable");
    },
  });
}
