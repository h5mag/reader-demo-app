import Icon from 'react-native-vector-icons/Ionicons'; Icon.loadFont();
import React, { useState, useCallback, useLayoutEffect } from 'react';
import { StatusBar, View, Text, Pressable, ActivityIndicator, Image } from 'react-native';
import styles from '../css/style';
import { FlatList } from 'react-native-gesture-handler';
import sv from '../css/variables';
import capitalize from '../util/Words';
import EditionMenu from '../components/EditionMenu';
import { useNetInfo } from '@react-native-community/netinfo';
import { findAllEditionsInDb } from '../util/Queries';
import { useFocusEffect } from '@react-navigation/native';
import H5mag from '@h5mag/react-native-h5mag';
import { goToEdition } from '../util/Editions';

export default function Editions({ navigation, route }) {
	const { projectDomain, projectThumbnail } = route.params;

	const netInfo = useNetInfo();

	const [isLoading, setLoading] = useState(true);
	const [data, setData] = useState();

	useFocusEffect(
		useCallback(() => {
			getAndSyncProjectDataWithDb();
		}, [netInfo.isConnected])
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

			let editions = await findAllEditionsInDb().then((result) => {
				return result;
			});

			let tempData = [...json.editions];

			for (let i = 0; i < tempData.length; i++) {
				for (let j = 0; j < editions.length; j++) {
					if (tempData[i].href.includes(editions[j].href)) {
						tempData[i] = editions[j];
					}
				}
			}

			setData({ ...json, editions: tempData });
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
		const index = data.editions.findIndex(e => edition.href === e.href);
		let tempData = [...data.editions];
		tempData[index] = edition;
		setData({ ...data, editions: tempData });
	};

	const renderItem = ({ item }) => (
		<View style={styles.editionBlock}>
			<Pressable onPress={() => goToEdition(item, projectDomain, navigation)} style={[styles.flexRowContainer, styles.spaceBetween, styles.alignCenter]}>
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

				<EditionMenu edition={item} projectDomain={projectDomain} navigation={navigation} route={route} onChangeFavorite={onChangeEdition} onChangeDownloaded={onChangeEdition} />
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
						<View style={{}}>
							{projectThumbnail && <Image source={{ uri: projectThumbnail }} style={styles.editionPhoto} />}
							<View style={{ marginHorizontal: sv.m3, marginBottom: sv.m2 }}>
								<Text style={[styles.header, !projectThumbnail && styles.mt3]}>{capitalize(data.title)}</Text>
								<Text style={styles.subheader}>Project description here</Text>
							</View>
						</View>
					}
					ListFooterComponent={!isLoading && data.editions.length <= 0 && <Text>Sorry! We did not find any editions...</Text>}
					data={data.editions}
					renderItem={renderItem}
					keyExtractor={item => item.title} />
			)}
		</View>
	);
}
