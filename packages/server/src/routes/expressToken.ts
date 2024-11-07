import { Token } from "@freshgum/typedi";
import type { Application } from "express";

export const expressToken = new Token<Application>("express");
