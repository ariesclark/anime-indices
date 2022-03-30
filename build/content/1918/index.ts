import { type Anime } from "../../";

import spring from "./spring.json";
import summer from "./summer.json";
import winter from "./winter.json";

export const year = 1918;
// @ts-ignore
export const season: { spring: Anime[], summer: Anime[], winter: Anime[] } = { spring, summer, winter };