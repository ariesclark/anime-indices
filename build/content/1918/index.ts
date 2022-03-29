import { type Anime } from "../../";

import spring from "./spring.json" assert { type: "json" };
import summer from "./summer.json" assert { type: "json" };
import winter from "./winter.json" assert { type: "json" };

export const year = 1918;
// @ts-ignore
export const season: { spring: Anime[], summer: Anime[], winter: Anime[] } = { spring, summer, winter };