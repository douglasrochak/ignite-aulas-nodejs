export interface Coordinate {
  latitude: number;
  longitude: number;
}

export function getDistanceBetweenCoordinates(
  from: Coordinate,
  to: Coordinate
): number {
  if (from.latitude === to.latitude && from.longitude === to.longitude)
    return 0;

  const radFromLat = (Math.PI * from.latitude) / 180;
  const radToLat = (Math.PI * to.latitude) / 180;

  const theta = from.longitude - to.longitude;
  const radTheta = (Math.PI * theta) / 180;

  let distance =
    Math.sin(radFromLat) * Math.sin(radToLat) +
    Math.cos(radFromLat) * Math.cos(radToLat) * Math.cos(radTheta);

  if (distance > 1) distance = 1;

  distance = Math.acos(distance);
  distance = (distance * 180) / Math.PI;
  distance = distance * 60 * 1.1515;
  distance = distance * 1.609344;

  return distance;
}
