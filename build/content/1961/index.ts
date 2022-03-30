import { type Anime } from "../../";

import spring from "./spring.json";
import summer from "./summer.json";
import unknown from "./unknown.json";
import winter from "./winter.json";

export const year = 1961;
// @ts-ignore
export const season: { spring: Anime[], summer: Anime[], unknown?: Anime[], winter: Anime[] } = { spring, summer, unknown, winter };