import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons'; Icon.loadFont();
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar, View, Text, Pressable, ActivityIndicator, ImageBackground } from 'react-native';
import styles from '../css/style';
import sv from '../css/variables';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { useNetInfo } from '@react-native-community/netinfo';
import capitalize from '../util/Words';
import H5mag from '@h5mag/react-native-h5mag';
import DbQuery from '../util/Queries';
import { Dimensions } from 'react-native';
import { useQuery } from 'react-query';

export default function Home({ navigation }) {
	const netInfo = useNetInfo();
	const { data: isDark } = useQuery('colorScheme');
	const { data: themeTextColor } = useQuery('colorScheme.textColor');

	const windowWidth = Dimensions.get('window').width;

	const [isLoading, setLoading] = useState(true);
	const [projects, setProjects] = useState(null);
	const [filteredProjects, setFilteredProjects] = useState(null);

	/**
	 * Executes when the netInfo state changes.
	 * This is used when reconnecting or disconnecting from an internet connection.
	 */
	useEffect(() => {
		if (netInfo.isConnected?.toString() === 'true') {
			getProjectsDataFromAPI();
		}
		if (netInfo.isConnected?.toString() === 'false') {
			DbQuery.findAllProjectsInDb().then((result) => {
				if (!result) { return; }
				setProjects(result);
				setFilteredProjects(result);
				setLoading(false);
			});
		}
	}, [netInfo?.isConnected]);

	/**
	 * Get project data.
	 */
	const getProjectsDataFromAPI = async () => {
		try {
			await H5mag.getProjectsList({ filterByHasLatestEdition: true }).then(result => {
				DbQuery.insertProjectsInDb(result);
				setProjects(result);
				setFilteredProjects(result);
			});
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Filters the project data by search input.
	 * @param {string} search
	 */
	const filterProjects = (search) => {
		if (projects.length > 0) {
			setFilteredProjects(projects.filter(project => project.name.toLowerCase().includes(search.toLowerCase())));
		}
	};

	/**
	 * Navigate to editions page.
	 * @param {project} p
	 */
	const goToEdition = (p) => {
		navigation.navigate('Editions', { projectDomain: p.domain, projectThumbnail: p.latest_edition.screenshot_src });
	};

	if (!projects && !isLoading) { return <Text style={themeTextColor}>No titles found.</Text>; }

	const renderItem = ({ item }) => (
		<ImageBackground source={{ uri: item.latest_edition.screenshot_src }} style={[styles.image, styles.projectImage]}>
			<LinearGradient
				colors={['#00000000', '#00000088']}
				locations={[0.1, 1]}
				style={styles.fullContainer}>
				<Pressable onPress={() => goToEdition(item)} style={styles.projectButton}>
					<Text style={[styles.projectTitle]}>
						{capitalize(item.name)}
					</Text>
				</Pressable>
			</LinearGradient>
		</ImageBackground>
	);

	return (
		<View>
			<LinearGradient
				colors={[sv.primaryColor + (isDark ? 'bb' : '20'), isDark ? '#000000ff' : '#ffffffff']}
				locations={[0.1, 1]}
				style={styles.fullContainer}>

				<StatusBar barStyle="light-content" backgroundColor={sv.primaryColor} />

				<View style={[styles.mainContainer]}>
					{isLoading
						? <ActivityIndicator style={styles.mt5} />
						: <FlatList
							ListHeaderComponent={
								<>
									<Text style={[themeTextColor, styles.header, styles.mb2, styles.mt3]}>
										Library
									</Text>
									<TextInput
										style={styles.searchInput}
										onChangeText={text => filterProjects(text)}
										clearButtonMode="always"
										placeholder="Search"
										placeholderTextColor={isDark ? sv.white : sv.gray}
									/>
								</>
							}
							ListFooterComponent={
								<>
									{netInfo.isConnected?.toString() !== 'true' &&
										<Text style={[themeTextColor, { margin: sv.m2 }]}>No internet connection</Text>
									}
								</>
							}
							ListEmptyComponent={<Text style={[themeTextColor, styles.ml1]}>No projects were found...</Text>}
							data={filteredProjects}
							renderItem={renderItem}
							style={{ paddingHorizontal: sv.m2 }}
							numColumns={windowWidth > 425 ? 3 : 2}
							keyExtractor={item => item.name}
						/>
					}
				</View>
			</LinearGradient>
		</View>
	);
}
