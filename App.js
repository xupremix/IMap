/**
 * @format
 * @flow strict-local
 */

import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import Map from "./components/Map";

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<View style={styles.page}>
				<Map/>
			</View>
		);
	}
};
 
const styles = StyleSheet.create({
	page: {
		width: '100%',
		height: '100%',
	}
});

export default App;
