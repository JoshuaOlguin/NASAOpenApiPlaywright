import { MissDistanceJson } from "./MissDistanceJson";
import { RelativeVelocityJson } from "./RelativeVelocityJson";

export interface CloseApproachDataJson {
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  relative_velocity: RelativeVelocityJson;
  miss_distance: MissDistanceJson;
  orbiting_body: string;
}