/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  MapView,
  StyleSheet,
  Text,
  View,
} = React;

var region = {
  latitude: 45.420591,
  longitude: -75.692859,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

var BusFollower = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={region}
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    height: 600,
    width: 350,
    margin: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
});

AppRegistry.registerComponent('BusFollower', () => BusFollower);
