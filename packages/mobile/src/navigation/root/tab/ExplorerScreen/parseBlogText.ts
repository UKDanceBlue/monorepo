import { Parser } from "htmlparser2";

export function parseBlogText(
  text: string,
  maxLength: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    let parsedText = "";
    const parser = new Parser({
      ontext: (text) => {
        if (parsedText.length < maxLength) {
          parsedText += text;
        } else {
          parser.end();
          const lastSpace = parsedText.lastIndexOf(" ", maxLength);
          resolve(`${parsedText.substring(0, lastSpace)} [...]`);
        }
      },
    });
    try {
      parser.write(text);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
      reject(error);
    } finally {
      parser.end();
    }
  });
}
