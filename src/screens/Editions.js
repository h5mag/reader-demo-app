import Icon from 'react-native-vector-icons/Ionicons'; Icon.loadFont();
import React, { useState, useCallback, useLayoutEffect } from 'react';
import { StatusBar, View, Text, ActivityIndicator, Image } from 'react-native';
import styles from '../css/style';
import { FlatList } from 'react-native-gesture-handler';
import sv from '../css/variables';
import capitalize from '../util/Words';
import Edition from '../components/Edition';
import { useNetInfo } from '@react-native-community/netinfo';
import DbQuery from '../util/Queries';
import { useFocusEffect } from '@react-navigation/native';
import H5mag from '@h5mag/react-native-h5mag';
import { useQueryClient, useQuery } from 'react-query';

export default function Editions({ navigation, route }) {
	const { projectDomain, projectThumbnail } = route.params;

	const netInfo = useNetInfo();
	const queryClient = useQueryClient();
	const { data: themeTextColor } = useQuery('colorScheme.textColor');
	const { data: themeBackgroundColor } = useQuery('colorScheme.backgroundColor');

	const [isLoading, setLoading] = useState(true);
	const [projectWithEditions, setProjectWithEditions] = useState();

	useFocusEffect(
		useCallback(() => {
			getAndSyncProjectDataWithDb();
		}, [netInfo?.isConnected])
	);

	useLayoutEffect(() => {
		navigation.setOptions({
			title: capitalize(projectDomain),
		});
	}, [navigation]);

	/**
	 * Retrieves editions from the database and compares it with live data.
	 * @param {project} json contains the project data
	 */
	const getAndSyncProjectDataWithDb = async (json) => {
		if (netInfo.isConnected?.toString() === 'true') {
			if (!json) {
				getProjectDataFromAPI();
				return;
			}

			let editionsFromDb = await DbQuery.findAllEditionsInDb().then((result) => {
				return result;
			});

			let tempData = [...json.editions];

			for (let i = 0; i < tempData.length; i++) {
				for (let j = 0; j < editionsFromDb.length; j++) {
					if (tempData[i].href.includes(editionsFromDb[j].href)) {
						tempData[i] = editionsFromDb[j];
					}
				}
			}

			setProjectWithEditions({ ...json, editions: tempData });
			setLoading(false);
		}
	};

	/**
	 * Retrieves project data with its relevant editions.
	 */
	const getProjectDataFromAPI = async () => {
		try {
			await H5mag.getProjectAndEditions(projectDomain, { sort: true }).then((result) => {
				getAndSyncProjectDataWithDb(result);
			});
		} catch (error) {
			console.error(error);
		}
	};

	/**
	 * Update edition favorite and downloaded state.
	 * @param {edition} edition
	 */
	const onChangeEdition = (edition) => {
		let tempData = [...projectWithEditions.editions];
		const index = tempData.findIndex(e => edition.href === e.href);
		tempData[index] = edition;
		setProjectWithEditions({ ...projectWithEditions, editions: tempData });

		queryClient.setQueryData(['editions.favorite', tempData[index].href], () => { return tempData[index].favorite; });
		queryClient.setQueryData(['editions.status', tempData[index].href], () => { return tempData[index].status; });
	};

	const renderItem = ({ item, index }) => (
		<Edition item={item} index={index} projectDomain={projectDomain} navigation={navigation} route={route} onChangeEdition={onChangeEdition} onChangeDownloaded={onChangeEdition} onChangeFavorite={onChangeEdition} />
	);

	if (netInfo.isConnected?.toString() !== 'true') {
		return (<Text style={[styles.mt2, styles.ml2, themeTextColor]}>No internet connection</Text>);
	}

	return (
		<View style={[themeBackgroundColor, styles.editionContainer]}>
			<StatusBar barStyle="light-content" backgroundColor={sv.primaryColor} />
			{isLoading ? <ActivityIndicator style={styles.mt5} /> : (
				<FlatList
					ListHeaderComponent={
						<View style={{}}>
							{projectThumbnail && <Image source={{ uri: projectThumbnail }} style={styles.editionPhoto} />}
							<View style={{ marginHorizontal: sv.m3, marginBottom: sv.m2 }}>
								<Text style={[styles.header, !projectThumbnail && styles.mt3, themeTextColor]}>
									{capitalize(projectWithEditions.title)}
								</Text>
								<Text style={[styles.projectSubheader, themeTextColor]}>Project description here</Text>
							</View>
						</View>
					}
					ListEmptyComponent={<Text style={[styles.black, { marginHorizontal: sv.m3 }]}>Sorry! We did not find any editions...</Text>}
					data={projectWithEditions.editions}
					extraData={projectWithEditions}
					renderItem={renderItem}
					keyExtractor={item => item.title}
				/>
			)}
		</View>
	);
}
