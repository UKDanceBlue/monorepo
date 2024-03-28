import { MIMEType } from "util";

export function combineMimePartsToString(
  typeName: string,
  subtypeName: string,
  parameters: string[]
) {
  return `${typeName}/${subtypeName}${
    parameters.length > 0 ? `; ${parameters.join("; ")}` : ""
  }`;
}

export function combineMimeParts(
  typeName: string,
  subtypeName: string,
  parameters: string[]
) {
  return new MIMEType(
    combineMimePartsToString(typeName, subtypeName, parameters)
  );
}
