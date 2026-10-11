import React from 'react';
import {View, StyleSheet} from 'react-native';
import {GoogleMap, useJsApiLoader, Polyline, Marker} from '@react-google-maps/api';
import {C} from '../theme/colours';

const containerStyle = {width: '100%', height: '100%', minHeight: 220};
const defaultCenter = {lat: -26.2041, lng: 28.0473};
const LIBRARIES = ['places'];

export default function RouteMap({coordinates = []}) {
  const {isLoaded, loadError} = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyA6-2gMLpihIM-oaTEYbW8_E1LGv2wSvqs',
    libraries: LIBRARIES,
  });

  if (loadError) {
    return (
      <View style={styles.wrap}>
        <View style={styles.loading} />
      </View>
    );
  }

  if (!isLoaded) {
    return (
      <View style={styles.wrap}>
        <View style={styles.loading} />
      </View>
    );
  }

  const centerPoint = coordinates.length > 0
    ? {lat: coordinates[0].latitude, lng: coordinates[0].longitude}
    : defaultCenter;

  return (
    <View style={styles.wrap}>
      <GoogleMap mapContainerStyle={containerStyle} center={centerPoint} zoom={16}>
        {coordinates.length > 1 && (
          <Polyline
            path={coordinates.map(c => ({lat: c.latitude, lng: c.longitude}))}
            options={{strokeColor: '#FF8A65', strokeWeight: 5, strokeOpacity: 0.9}}
          />
        )}
        {coordinates.map((c, i) => (
          <Marker
            key={i}
            position={{lat: c.latitude, lng: c.longitude}}
            icon={{
              path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
              fillColor: i === 0 ? '#66BB6A' : '#FF8A65',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#ffffff',
              scale: 1.2,
            }}
          />
        ))}
      </GoogleMap>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {height: 220, borderRadius: 16, overflow: 'hidden', marginBottom: 14, borderWidth: 1.5, borderColor: C.border},
  loading: {flex: 1, backgroundColor: C.surface2},
});
