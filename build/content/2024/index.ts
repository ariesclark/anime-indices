import { type Anime } from "../../";

import spring from "./spring.json" assert { type: "json" };
import unknown from "./unknown.json" assert { type: "json" };

export const year = 2024;
// @ts-ignore
export const season: { spring: Anime[], unknown?: Anime[] } = { spring, unknown };