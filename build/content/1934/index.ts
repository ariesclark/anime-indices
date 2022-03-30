import { type Anime } from "../../";

import fall from "./fall.json";
import spring from "./spring.json";
import summer from "./summer.json";
import winter from "./winter.json";

export const year = 1934;
// @ts-ignore
export const season: { fall: Anime[], spring: Anime[], summer: Anime[], winter: Anime[] } = { fall, spring, summer, winter };