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
			location: [12.4964, 41.9028],
			points: 0,
			point1: false,
			point2: false,
			visible: false,
			showline: false
		};
	}
	
	renderAnnotation(feature) {
		var points = this.state.points % 2 + 1;
		if (points == 1){
			this.setState({
				points: (this.state.points % 2) + 1,
				point1: !this.state.point1,
				point1coordinates: feature.geometry.coordinates
			});
		}
		else if (points == 2){
			this.setState({
				points: (this.state.points % 2) + 1,
				point2: !this.state.point2,
				point2coordinates: feature.geometry.coordinates
			});
		}
	}
	
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
	
	hide(){
		this.setState({
			visible: !this.state.visible,
			showline: false
		});
	}

	calculateDistance(){
		if (!(this.state.point1 && this.state.point2)) return;
		const distance = (getPreciseDistance(
			this.state.point1coordinates, 
			this.state.point2coordinates
		)/1000).toString() + " Km";
		this.setState({
			visible: true,
			text: distance,
			showline: true
		});
	}

	renderLine(){
		if (!this.state.showline) return;
		return(
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

	render() {
		return (
			<View style={styles.container}>
				<MapboxGL.MapView 
					style={styles.map} 
					onPress={
						(feature) => {
							this.renderAnnotation(feature)
						}
					}
				>
					<MapboxGL.Camera 
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
