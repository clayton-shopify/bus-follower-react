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
  TextInput,
  View,
} = React;

var APP_ID = '1d5a86db';
var API_KEY = '336c4052a44a741a4b0344060ef73b12';

var ALL_ROUTES_URL = 'https://api.octranspo1.com/v1.2/GetNextTripsForStopAllRoutes'
var DEFAULT_STOP = '3001'

var region = {
  latitude: 45.420591,
  longitude: -75.692859,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

var BusFollower = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      text: DEFAULT_STOP,
      stopNum: DEFAULT_STOP,
      annotations: null,
      busData: ds.cloneWithRows([]),
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
        <View style={{flexDirection: 'row'}}>
          <Text style={{flex: 0}}>Stop number:</Text>
          <TextInput
            style={styles.stopnum}
            value={this.state.text}
            onChangeText={(text) => this.setState({text})}
            onEndEditing={(event) => {
              var text = event.nativeEvent.text;
              if (text.length == 4) {
                this.state.stopNum = text;
                this.fetchData();
              }
            }}
          />
        </View>
        <ListView
          style={styles.list}
          dataSource={this.state.busData}
          renderRow={(rowData, sectionID, rowID, highlightRow) =>
            <View style={rowID % 2 == 0 ? styles.listitem1 : styles.listitem2}>
              <Text style={styles.route}>Route {rowData.routeNo}</Text>
              <Text style={styles.dest}>{rowData.dest}</Text>
              <Text style={styles.mins}>{rowData.mins} min.</Text>
            </View>
          }
        />
      </View>
    );
  },

  tick: function() {
    this.fetchData();
  },

  componentDidMount: function() {
    this.fetchData();
    this.interval = setInterval(this.tick, 30000);
  },

  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

  fetchData: function() {
    var params = {
      method: 'POST',
      body: queryString.stringify({
        appID: APP_ID,
        apiKey: API_KEY,
        stopNo: this.state.stopNum,
        format: 'json',
      }),
    };
    fetch(ALL_ROUTES_URL, params)
      .then((response) => response.json())
      .then((responseData) => this.parseTrips(responseData))
      .done();
  },

  parseTrips: function(responseData) {
    var routes = responseData.GetRouteSummaryForStopResult.Routes.Route;
    var annotations = [];
    var list = [];

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
              title: 'Route ' + routeNo + ' \u2014 ' + trip.AdjustedScheduleTime + ' min.',
              subtitle: trip.TripDestination,
            });
          }
          list.push({
            routeNo: routeNo,
            mins: parseInt(trip.AdjustedScheduleTime),
            dest: trip.TripDestination,
          })
        }
      }
    }

    list.sort(function (a, b) {
      return a.mins - b.mins;
    });
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.setState({
      annotations: annotations,
      busData: ds.cloneWithRows(list),
    });
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
  stopnum: {
    flex: 1,
    borderWidth: 1,
    marginLeft: 5,
  },
  list: {
    flex: 1,
  },
  listitem1: {
    flexDirection: 'row',
    padding: 2,
    backgroundColor: '#EEEEFF',
  },
  listitem2: {
    flexDirection: 'row',
    padding: 2,
    backgroundColor: '#FFFFFF',
  },
  route: {
    flex: 25,
  },
  dest: {
    flex: 80,
  },
  mins: {
    flex: 20,
    textAlign: 'right',
  },
});

AppRegistry.registerComponent('BusFollower', () => BusFollower);
