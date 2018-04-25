import { Location, Permissions } from 'expo';

export async function registerForLocation() {
  console.log('Checking location permission');
  const { existingStatus } = await Permissions.getAsync(Permissions.LOCATION);
  let finalStatus = existingStatus;

  console.log('Asking for location permission');

  // prompt for permission if not determine
  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log("location not granted");
    return;
  }
  
  console.log('Location granted!');
  // get current location
  let location = await Location.getCurrentPositionAsync({});
  console.log(location);
}

export function findBuilding(str) {
  for (let name of Object.keys(buildings)) {
    if (name.toLowerCase().startsWith(str.toLowerCase())) {
      return buildings[name];
    }
  }
  return null;
}

/**
 * Find location in locs closest to point
 */
export function closest(point, locs) {
  let min = Number.MAX_SAFE_INTEGER;
  let minIndex;
  locs.forEach((loc, i) => {
    let diff = distance(point, loc);
    if (diff < min) {
      min = diff;
      minIndex = i;
    } 
  });
  return minIndex;
}

/**
 * Find Pitt building closest to location
 */
export function closestPittBuilding(loc) {
  return Object.values(buildings)[closest(loc, Object.values(buildings))];
}

/**
 * Haversine distance between two locations
 * Implementation from: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula/27943#27943
 */
export function distance(loc1, loc2) {
  const R = 6371;
  let lat1 = loc1.latitude;
  let long1 = loc1.longitude;
  let lat2 = loc2.latitude;
  let long2 = loc2.latitude;
  let dLat = degToRad(lat2-lat1);
  let dLong = degToRad(long2-long1);
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
          Math.sin(dLong/2) * Math.sin(dLong/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}

function degToRad(deg) {
  return deg * (Math.PI/180);
}

export const buildings = {
  "Allen Hall": {id: 1, name: "Allen Hall", latitude: 40.44461599, longitude: -79.95841026},
  "Alumni Hall": {id: 2, name: "Alumni Hall", latitude: 40.44557946, longitude: -79.95388269},
  "Amos Hall": {id: 3, name: "Amos Hall", latitude: 40.44349329, longitude: -79.95573342},
  "Bellefield Hall": {id: 4, name: "Bellefield Hall", latitude: 40.44539166, longitude: -79.95090008},
  "Benedum Hall": {id: 5, name: "Benedum Hall", latitude: 40.44369742, longitude: -79.95861411},
  "The University Store": {id: 6, name: "The University Store", latitude: 40.44318302, longitude: -79.95621622},
  "Brackenridge Hall": {id: 7, name: "Brackenridge Hall", latitude: 40.44275843, longitude: -79.95556712},
  "Bruce Hall": {id: 8, name: "Bruce Hall", latitude: 40.44297481, longitude: -79.95507896},
  "Biomedical Science Towers 1 and 2": {id: 9, name: "Biomedical Science Towers 1 and 2", latitude: 40.44211745, longitude: -79.96204734},
  "Biomedical Science Tower 3": {id: 10, name: "Biomedical Science Tower 3", latitude: 40.44104371, longitude: -79.9600625},
  "Cathedral of Learning": {id: 11, name: "Cathedral of Learning", latitude: 40.44425265, longitude: -79.95323896},
  "Chevron Science Center": {id: 12, name: "Chevron Science Center", latitude: 40.44597545, longitude: -79.95747149},
  "Clapp Hall": {id: 13, name: "Clapp Hall", latitude: 40.44620407, longitude: -79.95316386},
  "Charles L. Cost Sport Center": {id: 14, name: "Charles L. Cost Sport Center", latitude: 40.44628571, longitude: -79.9649334},
  "Craig Hall": {id: 15, name: "Craig Hall", latitude: 40.44617549, longitude: -79.94922638},
  "Crawford Hall": {id: 16, name: "Crawford Hall", latitude: 40.44697564, longitude: -79.95424747},
  "Eberly Hall": {id: 17, name: "Eberly Hall", latitude: 40.44590605, longitude: -79.95834589},
  "Engineering Auditorium": {id: 18, name: "Engineering Auditorium", latitude: 40.44406077, longitude: -79.95813668},
  "Falk Medical Building": {id: 19, name: "Falk Medical Building", latitude: 40.44152547, longitude: -79.95935977},
  "Falk School": {id: 20, name: "Falk School", latitude: 40.44699605, longitude: -79.95970309},
  "Forbes Craig Apartments": {id: 21, name: "Forbes Craig Apartments", latitude: 40.44451801, longitude: -79.94917274},
  "Fitzgerald Field House": {id: 22, name: "Fitzgerald Field House", latitude: 40.44345247, longitude: -79.96418238},
  "Frick Fine Arts Building": {id: 23, name: "Frick Fine Arts Building", latitude: 40.4416602, longitude: -79.9512434},
  "Gardner Steel Conference Center": {id: 24, name: "Gardner Steel Conference Center", latitude: 40.44443636, longitude: -79.95792747},
  "Heinz Memorial Chapel": {id: 25, name: "Heinz Memorial Chapel", latitude: 40.44526919, longitude: -79.95188177},
  "Hillman Library": {id: 26, name: "Hillman Library", latitude: 40.4425543, longitude: -79.95411873},
  "Holland Hall": {id: 27, name: "Holland Hall", latitude: 40.44288907, longitude: -79.95590508},
  "Information Sciences Building": {id: 28, name: "Information Sciences Building", latitude: 40.44737979, longitude: -79.95274544},
  "Langley Hall": {id: 29, name: "Langley Hall", latitude: 40.44669395, longitude: -79.95371103},
  "Barco Law Building": {id: 30, name: "Barco Law Building", latitude: 40.44177043, longitude: -79.95568514},
  "Lawrence Hall": {id: 31, name: "Lawrence Hall", latitude: 40.44239507, longitude: -79.95523453},
  "Loeffler Building": {id: 32, name: "Loeffler Building", latitude: 40.44085999, longitude: -79.95848536},
  "Lothrop" : {id: 33, name: "Lothrop", latitude: 40.44165611, longitude: -79.96004105},
  "Learning Research and Development Center": {id: 34, name: "Learning Research and Development Center", latitude: 40.44446086, longitude: -79.95894134},
  "McCormick Hall": {id: 35, name: "McCormick Hall", latitude: 40.44327284, longitude: -79.95540082},
  "Mervis Hall": {id: 36, name: "Mervis Hall", latitude: 40.44081099, longitude: -79.95333552},
  "Music Building": {id: 37, name: "Music Building", latitude: 40.44667354, longitude: -79.95223045},
  "Old Engineering Hall": {id: 38, name: "Old Engineering Hall", latitude: 40.44499158, longitude: -79.95809376},
  "Oxford Building": {id: 39, name: "Oxford Building", latitude: 40.44011692, longitude: -79.95946169},
  "Pennsylvania Hall": {id: 40, name: "Pennsylvania Hall", latitude: 40.444963, longitude: -79.96032},
  "Panther Hall": {id: 41, name: "Panther Hall", latitude: 40.44528144, longitude: -79.9616611},
  "Forbes Pavilion": {id: 42, name: "Forbes Pavilion", latitude: 40.44039047, longitude: -79.95901108},
  "Petersen Events Center": {id: 43, name: "Petersen Events Center", latitude: 40.44382806, longitude: -79.96228337},
  "Public Health": {id: 44, name: "Public Health", latitude: 40.44286049, longitude: -79.95842099},
  "Ruskin Hall": {id: 45, name: "Ruskin Hall", latitude: 40.44706545, longitude: -79.9530673},
  "Salk Hall": {id: 46, name: "Salk Hall", latitude: 40.44257879, longitude: -79.96272326},
  "Scaif Hall": {id: 47, name: "Scaif Hall", latitude: 40.44251347, longitude: -79.9618274},
  "Sennott Square": {id: 48, name: "Sennott Square", latitude: 40.44158671, longitude: -79.95638251},
  "Space Research Coordination Center": {id: 49, name: "Space Research Coordination Center", latitude: 40.44544882, longitude: -79.95723009},
  "Stephen Foster Memorial": {id: 50, name: "Stephen Foster Memorial", latitude: 40.44381582, longitude: -79.95280445},
  "Sutherland Hall": {id: 51, name: "Sutherland Hall", latitude: 40.44588564, longitude: -79.9626267},
  "Thackeray Hall": {id: 52, name: "Thackeray Hall", latitude: 40.44419549, longitude: -79.95744467},
  "Thaw Hall": {id: 53, name: "Thaw Hall", latitude: 40.44517937, longitude: -79.95759487},
  "Litchfield Towers": {id: 54, name: "Litchfield Towers", latitude: 40.44257471, longitude: -79.95667756},
  "Trees Hall": {id: 55, name: "Trees Hall", latitude: 40.44408118, longitude: -79.96550202},
  "Towers": {id: 54, name: "Litchfield Towers", latitude: 40.44257471, longitude: -79.95667756},
  "Tower A": {id: 54, name: "Litchfield Towers", latitude: 40.44257471, longitude: -79.95667756},
  "Tower B": {id: 54, name: "Litchfield Towers", latitude: 40.44257471, longitude: -79.95667756},
  "Tower C": {id: 54, name: "Litchfield Towers", latitude: 40.44257471, longitude: -79.95667756},
  "University Club": {id: 56, name: "University Club", latitude: 40.44421182, longitude: -79.95683312},
  "Victoria Building": {id: 57, name: "Victoria Building", latitude: 40.44129684, longitude: -79.96071696},
  "Van de Graaff Building": {id: 58, name: "Van de Graaff Building", latitude: 40.44479562, longitude: -79.95856583},
  "William Pitt Union": {id: 59, name: "William Pitt Union", latitude: 40.4434688, longitude: -79.95480001},
  "Wesley W. Posvar Hall": {id: 60, name: "Wesley W. Posvar Hall", latitude: 40.44164387, longitude: -79.95381832},
}
