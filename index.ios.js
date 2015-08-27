/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var queryString = require('query-string');

var {
  AppRegistry,
  ListView,
  MapView,
  StyleSheet,
  Text,
  View,
} = React;

var APP_ID = '1d5a86db';
var API_KEY = '336c4052a44a741a4b0344060ef73b12';

var ALL_ROUTES_URL = 'https://api.octranspo1.com/v1.2/GetNextTripsForStopAllRoutes'

var region = {
  latitude: 45.420591,
  longitude: -75.692859,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

var BusFollower = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      annotations: null,
      busData: ds.cloneWithRows(['Test 1', 'Test 2']),
    }
  },

  render: function() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={region}
          annotations={this.state.annotations}
        />
        <ListView
          style={styles.list}
          dataSource={this.state.busData}
          renderRow={(rowData) => <Text>{rowData}</Text>}
        />
      </View>
    );
  },

  componentDidMount: function() {
    this.fetchData();
  },

  fetchData: function() {
    var params = {
      method: 'POST',
      body: queryString.stringify({
        appID: APP_ID,
        apiKey: API_KEY,
        stopNo: '3001',
        format: 'json',
      }),
    };
    fetch(ALL_ROUTES_URL, params)
      .then((response) => response.json())
      .then((responseData) => {
        var routes = responseData.GetRouteSummaryForStopResult.Routes.Route;
        var annotations = [];
        for (var i = 0; i < routes.length; i++) {
          if (routes[i].Trips) {
            var trips = routes[i].Trips;
            var routeNo = routes[i].RouteNo;
            for (var j = 0; j < trips.length; j++) {
              var trip = trips[j];
              if (trip.Latitude) {
                annotations.push({
                  latitude: parseFloat(trip.Latitude),
                  longitude: parseFloat(trip.Longitude),
                  title: routeNo,
                });
              }
            }
          }
        }
        this.setState({
          annotations: annotations,
        });
      })
      .done();
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  map: {
    flex: 2,
  },
  list: {
    flex: 1,
  },
});

AppRegistry.registerComponent('BusFollower', () => BusFollower);
