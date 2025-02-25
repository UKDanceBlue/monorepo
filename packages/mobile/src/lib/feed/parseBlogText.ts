import { Parser } from "htmlparser2";

export function parseBlogText(
  text: string,
  maxLength: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    let parsedText = "";
    const parser = new Parser({
      ontext: (text) => {
        parsedText += text;

        if (parsedText.length > maxLength) {
          let lastSpace = parsedText.lastIndexOf(" ", maxLength);
          if (lastSpace === -1) {
            lastSpace = maxLength;
          }
          resolve(
            `${parsedText.substring(0, lastSpace)} [...]`
              .trim()
              .replaceAll(/(\s)\s+/gm, "$1")
          );
        }
      },
      onerror(error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      },
      onend() {
        resolve(parsedText.trim().replaceAll(/(\s)\s+/gm, "$1"));
      },
    });

    try {
      parser.write(text);
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)));
    } finally {
      parser.end();
    }
  });
}
