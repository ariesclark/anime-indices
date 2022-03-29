import { type Anime } from "../../";

import fall from "./fall.json" assert { type: "json" };
import spring from "./spring.json" assert { type: "json" };
import summer from "./summer.json" assert { type: "json" };
import unknown from "./unknown.json" assert { type: "json" };
import winter from "./winter.json" assert { type: "json" };

export const year = 2007;
// @ts-ignore
export const season: { fall: Anime[], spring: Anime[], summer: Anime[], unknown?: Anime[], winter: Anime[] } = { fall, spring, summer, unknown, winter };