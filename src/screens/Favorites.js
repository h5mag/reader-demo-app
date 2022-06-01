import Icon from 'react-native-vector-icons/Ionicons'; Icon.loadFont();
import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar, View, Text, Pressable, ActivityIndicator, Image } from 'react-native';
import styles from '../css/style';
import { FlatList } from 'react-native-gesture-handler';
import { findAllFavoriteEditionsInDb } from '../util/Queries';
import { useFocusEffect } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';
import EditionMenu from '../components/EditionMenu';
import sv from '../css/variables';
import { goToEdition } from '../util/Editions';

export default function Favorites({ navigation, route }) {
	const netInfo = useNetInfo();

	const [isLoading, setLoading] = useState(true);
	const [data, setData] = useState([]);

	useFocusEffect(
		useCallback(() => {
			getFavoriteEditions();
		}, [netInfo])
	);

	useEffect(() => {
		getFavoriteEditions();
	}, []);

	/**
	 * Retrieves only favorite editions from the database.
	 */
	const getFavoriteEditions = async () => {
		if (netInfo.isConnected?.toString() === 'true') {
			try {
				findAllFavoriteEditionsInDb().then((result) => {
					setData(result);
				});
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		}
	};

	/**
	 * Update edition favorite state.
	 * @param {edition} edition
	 */
	const onChangeFavorite = (edition) => {
		const index = data.findIndex(e => edition.href === e.href);
		let tempData = [...data];
		tempData.splice(index, 1);
		setData(tempData);
	};

	/**
	 * Update edition downloaded state.
	 * @param {edition} edition
	 */
	const onChangeDownloaded = (edition) => {
		const index = data.findIndex(e => edition.href === e.href);
		let tempData = [...data];
		tempData[index] = edition;
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

	if (netInfo.isConnected?.toString() !== 'true') {
		return (<Text style={[styles.mt2, styles.ml2]}>No internet connection</Text>);
	}

	return (
		<View style={styles.editionContainer}>
			<StatusBar barStyle="light-content" backgroundColor={sv.primaryColor} />
			{isLoading ? <ActivityIndicator style={styles.mt5} /> : (
				<FlatList
					ListHeaderComponent={
						<Text style={[styles.header, styles.mb2, styles.ml2, styles.mt3]}>
							Favorites
						</Text>
					}
					ListFooterComponent={!isLoading && data.length <= 0 && <Text style={[styles.mt2, styles.ml2]}>Hey, no favorite editions were found...</Text>}
					data={data}
					renderItem={renderItem}
					keyExtractor={item => item.title}
				/>
			)}
		</View>
	);
}
