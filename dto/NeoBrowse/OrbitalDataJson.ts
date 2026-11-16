export interface OrbitalDataJson {
  aphelion_distance: string;
  ascending_node_longitude: string;
  data_arc_in_days: number;
  eccentricity: string;
  epoch_osculation: string;
  equinox: string;
  first_observation_date: string;
  inclination: string;
  jupiter_tisserand_invariant: string;
  last_observation_date: string;
  mean_anomaly: string;
  mean_motion: string;
  minimum_orbit_intersection: string;
  observations_used: number;
  orbit_class: {
    orbit_class_type: string;
    orbit_class_description: string;
    orbit_class_range: string;
  };
  orbit_determination_date: string;
  orbit_id: string;
  orbit_uncertainty: string;
  orbital_period: string;
  perihelion_argument: string;
  perihelion_distance: string;
  perihelion_time: string;
  semi_major_axis: string;
}