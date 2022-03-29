import { type Anime } from "../../";

import fall from "./fall.json" assert { type: "json" };
import unknown from "./unknown.json" assert { type: "json" };

export const year = 1955;
// @ts-ignore
export const season: { fall: Anime[], unknown?: Anime[] } = { fall, unknown };