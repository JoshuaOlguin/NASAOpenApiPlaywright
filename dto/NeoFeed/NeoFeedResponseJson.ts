import { NearEarthObjectJson } from "./NearEarthObjectJson";

export interface NeoFeedResponseJson {
  links: {
    next: string | null;
    previous: string | null;
    self: string;
  };
  element_count: number;
  near_earth_objects: Record<string, NearEarthObjectJson[]>;
}