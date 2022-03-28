import React, { Component } from 'react';
import { View, StyleSheet, Button, Modal, Text, Pressable, Dimensions } from 'react-native';
import MapboxGL from "@react-native-mapbox-gl/maps";
import { getPreciseDistance } from 'geolib';

//key to load the map
const apiKey = "";
MapboxGL.setAccessToken(apiKey);

export default class Map extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//posizione che verrà caricata
			location: [12.4964, 41.9028],
			//numero di punti che ha selezionato l'utente
			points: 0,
			//variabile per determinare se mostrare il marker1
			point1: false,
			//variabile per determinare se mostrare il marker2
			point2: false,
			//variabile per determinare se mostrare il popup con la distanza
			visible: false,
			//variabile per determinare se mostrare la linea che connette i marker
			showline: false
		};
	}
	
	//funzione che prende una featore (conentente le coordinate di dove ha cliccato l'utente) e imposta il n° marker
	renderAnnotation(feature) {
		//calcolo ciclico numero di punti
		var points = this.state.points % 2 + 1;
		if (points == 1){
			//nel caso sia 1 imposto mostro il primo marker
			this.setState({
				points: (this.state.points % 2) + 1,
				point1: !this.state.point1,
				point1coordinates: feature.geometry.coordinates
			});
		}
		else if (points == 2){
			//nel caso sia 2 imposto mostro il secondo marker
			this.setState({
				points: (this.state.points % 2) + 1,
				point2: !this.state.point2,
				point2coordinates: feature.geometry.coordinates
			});
		}
	}
	
	//funzione per modificare la visibilità di un marker
	togglePoint(){
		switch (this.state.points){
			case 1:
				this.setState({
					point1: !this.state.point1
				});
				break;
			case 2:
				if (this.state.points == 2){
					this.setState({
						point2: !this.state.point2
					});
				}
				break;
		}
	}
	
	//funzione che genera il primo marker
	renderPoint1(){
		if (this.state.point1){
			return (
				<MapboxGL.PointAnnotation 
					id={"point1"} 
					coordinate={this.state.point1coordinates}
				/>
			);
		}
	}
	
	//funzione che genera il secondo marker
	renderPoint2(){
		if (this.state.point2){
			return (
				<MapboxGL.PointAnnotation 
					id={"point2"} 
					coordinate={this.state.point2coordinates}
				/>
			);
		}
	}
	
	//funzione che nasconde la linea precedentemente tracciata
	hide(){
		this.setState({
			visible: !this.state.visible,
			showline: false
		});
	}

	//calcolo distanza usando la libraria geolib e passando le coordinate dei due marker [Km]
	calculateDistance(){
		if (!(this.state.point1 && this.state.point2)) return;
		const distance = (getPreciseDistance(
			this.state.point1coordinates, 
			this.state.point2coordinates
		)/1000).toString() + " Km";
		//aggiornamento visibilità
		this.setState({
			visible: true,
			text: distance,
			showline: true
		});
	}

	//funzione per la visualizzazione della linea
	renderLine(){
		if (!this.state.showline) return;
		return(
			//creazione linea date le coordinate
			<MapboxGL.ShapeSource 
				id="source"
				shape={{
					"type": "FeatureCollection",
					"features": [
						{
							"type": "Feature",
							"properties": {},
							"geometry": {
								"type": "LineString",
								"coordinates": [
									this.state.point1coordinates,
									this.state.point2coordinates
								]
							}
						}
					]
				}}
			>
				<MapboxGL.LineLayer id="line" style={styles.line}/>
			</MapboxGL.ShapeSource>
		);
	}

	//funzione render default di un React-Native component per la visualizzazione di componenti
	render() {
		return (
			//contenitore per la mappa
			<View style={styles.container}>
				<MapboxGL.MapView 
					//mappa con funzione onPress -> creazione marker 
					style={styles.map} 
					onPress={
						(feature) => {
							this.renderAnnotation(feature)
						}
					}
				>
					<MapboxGL.Camera 
						//impostazione punto di vista dell'utente
						zoomLevel={4}
						animationMode={'flyTo'}
						centerCoordinate={this.state.location}
					/>
					<View onFocus={this.togglePoint}>
						{this.renderPoint1()}
					</View>
					<View onFocus={this.togglePoint}>
						{this.renderPoint2()}
					</View>
					{this.renderLine()}
				</MapboxGL.MapView>
				<View>
					<Button onPress={() => {this.calculateDistance()}} title={"Calculate Distance"}/>
					<Modal
						//popup
						transparent={true}
						visible={this.state.visible}
						onRequestClose={
							this.hide
						}
						animationType="fade"
					>
						<View style={styles.popup}>
							<Text style={styles.text}>
								{this.state.text}
							</Text>
							<Pressable onPress={() => {this.hide()}}>
								<Text style={styles.closetext}>
									CLOSE.
								</Text>
							</Pressable>
						</View>
					</Modal>
				</View>
			</View>
		);
	}
}

//style simili al css ma contenuti dentro ad un oggetto React
const styles = StyleSheet.create({
	container: {
		height: "100%",
		width: "100%",
		flex: 1,
	},
	map: {
		flex: 1,
	},
	popup: {
		left: Dimensions.get("window").width / 2 - 45,
		top: Dimensions.get("window").height / 2 - 40,
		width: 90,
		height: 80,
		backgroundColor: "lightgreen",
		borderRadius: 20,
		alignItems: "center"
	},
	text: {
		top: 10,
		color: "black",
	},
	closetext: {
		top: 15,
		color: "black",
		fontSize: 14,
		fontWeight: "bold"
	},
	line: {
		lineColor: "red",
		lineWidth: 3
	}
});
