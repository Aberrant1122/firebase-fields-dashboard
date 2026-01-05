import { Timestamp, GeoPoint, DocumentReference } from 'firebase-admin/firestore';

export function serializeFirestoreData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (data instanceof Timestamp) {
    return {
      type: 'timestamp',
      value: data.toDate().toISOString(),
      seconds: data.seconds,
      nanoseconds: data.nanoseconds,
    };
  }

  if (data instanceof GeoPoint) {
    return {
      type: 'geopoint',
      latitude: data.latitude,
      longitude: data.longitude,
    };
  }

  if (data instanceof DocumentReference) {
    return {
      type: 'reference',
      path: data.path,
      id: data.id,
    };
  }

  if (Array.isArray(data)) {
    return data.map(item => serializeFirestoreData(item));
  }

  if (typeof data === 'object') {
    const result: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = serializeFirestoreData(data[key]);
      }
    }
    return result;
  }

  return data;
}
