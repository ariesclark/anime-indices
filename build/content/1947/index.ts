import { type Anime } from "../../";

import spring from "./spring.json" assert { type: "json" };
import summer from "./summer.json" assert { type: "json" };
import unknown from "./unknown.json" assert { type: "json" };
import winter from "./winter.json" assert { type: "json" };

export const year = 1947;
// @ts-ignore
export const season: { spring: Anime[], summer: Anime[], unknown?: Anime[], winter: Anime[] } = { spring, summer, unknown, winter };