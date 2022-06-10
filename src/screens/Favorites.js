import Icon from 'react-native-vector-icons/Ionicons'; Icon.loadFont();
import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar, View, Text, ActivityIndicator } from 'react-native';
import styles from '../css/style';
import { FlatList } from 'react-native-gesture-handler';
import DbQuery from '../util/Queries';
import { useFocusEffect } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';
import Edition from '../components/Edition';
import sv from '../css/variables';
import { useQueryClient } from 'react-query';

export default function Favorites({ navigation, route }) {
	const netInfo = useNetInfo();
	const queryClient = useQueryClient();

	const [isLoading, setLoading] = useState(true);
	const [editions, setEditions] = useState([]);

	useFocusEffect(
		useCallback(() => {
			getFavoriteEditions();
		}, [netInfo?.isConnected])
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
				DbQuery.findAllFavoriteEditionsInDb().then((result) => {
					setEditions(result);
				});
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		}
	};

	/**
	 * Update global edition favorite and downloaded state.
	 * @param {edition} edition
	 */
	const onChangeEdition = (edition) => {
		queryClient.setQueryData(['editions.status', edition.href], () => { return edition.status; });
		queryClient.setQueryData(['editions.favorite', edition.href], () => { return edition.favorite; });
		getFavoriteEditions();
	};

	const renderItem = ({ item }) => (
		<Edition item={item} projectDomain={item.projectDomain} navigation={navigation} route={route} onChangeDownloaded={onChangeEdition} onChangeFavorite={onChangeEdition}/>
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
					ListEmptyComponent={<Text style={[styles.black, styles.ml2]}>No favorites were found...</Text>}
					data={editions}
					renderItem={renderItem}
					keyExtractor={item => item.title}
				/>
			)}
		</View>
	);
}
