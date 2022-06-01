import Icon from 'react-native-vector-icons/Ionicons'; Icon.loadFont();
import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar, View, Text, Pressable, ActivityIndicator, Image } from 'react-native';
import EditionMenu from '../components/EditionMenu';
import { FlatList } from 'react-native-gesture-handler';
import { findAllDownloadedEditionsInDb } from '../util/Queries';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../css/style';
import sv from '../css/variables';
import { goToEdition } from '../util/Editions';

export default function Downloads({ navigation, route }) {
	const [isLoading, setLoading] = useState(true);
	const [data, setData] = useState([]);

	useFocusEffect(
		useCallback(() => {
			getDownloadedEditions();
		}, [])
	);

	/**
	 * Retrieves editions from database where download = 1.
	 */
	const getDownloadedEditions = async () => {
		try {
			findAllDownloadedEditionsInDb().then((result) => {
				setData(result);
			});
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getDownloadedEditions();
	}, []);

	/**
	 * Update edition favorite state.
	 * @param {edition} edition
	 */
	const onChangeFavorite = (edition) => {
		const index = data.findIndex(e => edition.href === e.href);
		let tempData = [...data];
		tempData[index] = edition;
		setData(tempData);
	};

	/**
	 * Update edition downloaded state.
	 * @param {edition} edition
	 */
	const onChangeDownloaded = (edition) => {
		const index = data.findIndex(e => edition.href === e.href);
		let tempData = [...data];
		tempData.splice(index, 1);
		setData(tempData);
	};

	const renderItem = ({ item }) => (
		<View style={styles.editionBlock}>
			<Pressable onPress={() => goToEdition(item, item.projectDomain, navigation)} style={[styles.flexRowContainer, styles.spaceBetween, styles.alignCenter]}>
				<Image source={{ uri: item.screenshot_src }} style={styles.editionPhotoSmall} />
				{item.downloaded ? <Icon name={'cloud-done-outline'} size={sv.m2} color={sv.primaryColor} iconStyle={styles.mr0} /> : <View></View>}
				<View style={styles.editionBlockDescription}>
					<Text style={styles.editionTitle}>
						{item.title}
					</Text>
					{item.description?.length > 0 &&
						<Text>{item.description}</Text>
					}
				</View>
				<EditionMenu edition={item} projectDomain={item.projectDomain} navigation={navigation} route={route} onChangeFavorite={onChangeFavorite} onChangeDownloaded={onChangeDownloaded} />
			</Pressable>
		</View>
	);

	return (
		<View style={styles.editionContainer}>
			<StatusBar barStyle="light-content" backgroundColor={sv.primaryColor} />
			{isLoading ? <ActivityIndicator /> : (
				<FlatList
					ListHeaderComponent={
						<Text style={[styles.header, styles.mb2, styles.ml2, styles.mt3]}>
							Downloads
						</Text>
					}
					ListFooterComponent={!isLoading && data.length <= 0 && <Text style={[styles.mt2, styles.ml2]}>Hey, no downloads were found...</Text>}
					data={data}
					renderItem={renderItem}
					keyExtractor={item => item.href}
				/>
			)}
		</View>
	);
}
