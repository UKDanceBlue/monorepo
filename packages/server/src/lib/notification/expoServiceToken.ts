import { Token } from "@freshgum/typedi";
import type { Expo } from "expo-server-sdk";

export const expoServiceToken = new Token<Expo>("Expo");
