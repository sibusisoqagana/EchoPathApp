import React from 'react';
import {View, StyleSheet} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {C} from '../theme/colours';

export default function RouteMap({coordinates = []}) {
  const region = coordinates.length > 0
    ? {latitude: coordinates[0].latitude, longitude: coordinates[0].longitude, latitudeDelta: 0.005, longitudeDelta: 0.005}
    : {latitude: -26.2041, longitude: 28.0473, latitudeDelta: 0.05, longitudeDelta: 0.05};
  return (
    <View style={styles.wrap}>
      <MapView style={styles.map} initialRegion={region}>
        {coordinates.length > 1 && <Polyline coordinates={coordinates} strokeColor={C.cyan} strokeWidth={4} />}
        {coordinates.map((c, i) => <Marker key={i} coordinate={c} pinColor={i === 0 ? '#10F981' : '#00E5FF'} />)}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {height: 220, borderRadius: 16, overflow: 'hidden', marginBottom: 14, borderWidth: 1.5, borderColor: C.border},
  map: {width: '100%', height: '100%'},
});
