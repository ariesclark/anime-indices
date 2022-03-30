import { type Anime } from "../../";

import spring from "./spring.json";
import unknown from "./unknown.json";

export const year = 2024;
// @ts-ignore
export const season: { spring: Anime[], unknown?: Anime[] } = { spring, unknown };