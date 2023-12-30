export type HourInstructionsType = string | (string | string[])[];

export interface SpecialComponentType {
  id: string;
  uniqueOptions: Record<string, string>;
}
