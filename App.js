/**
 * @format
 * @flow strict-local
 */

import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import Map from "./components/Map";

//extends per ereditarietà e per la funzione render
class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			//inserimento all'interno della pagina del nostro componente Map personalizzato
			<View style={styles.page}>
				<Map/>
			</View>
		);
	}
};
 
//stylesheet simile al css incapsulata in un oggetto React
const styles = StyleSheet.create({
	page: {
		width: '100%',
		height: '100%',
	}
});

//caricamento App
export default App;