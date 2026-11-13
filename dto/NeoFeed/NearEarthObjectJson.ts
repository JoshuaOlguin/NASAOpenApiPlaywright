import { CloseApproachDataJson } from "./CloseApproachDataJson";
import { EstimatedDiameterJson } from "./EstimatedDiameterJson";

export interface NearEarthObjectJson {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: EstimatedDiameterJson;
  is_potentially_hazardous_asteroid: boolean;
  is_sentry_object: boolean;
  close_approach_data: CloseApproachDataJson[];
  links: { self: string };
}