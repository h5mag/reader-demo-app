import Icon from 'react-native-vector-icons/Ionicons'; Icon.loadFont();
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import styles from '../css/style';
import sv from '../css/variables';
import EditionMenu from '../components/EditionMenu';
import EditionIcon from '../components/EditionIcon';
import { goToEdition } from '../util/Editions';
import { useQuery } from 'react-query';

export default function Edition(props) {
    const { item, index, fromDownloads, projectDomain, navigation, onChangeEdition, onChangeDownloaded, onChangeFavorite, route } = props;

	const { data: isDark } = useQuery('colorScheme');
	const { data: themeTextColor } = useQuery('colorScheme.textColor');

    const editionDescription = (edition) => {
        if (route.name === 'DownloadsTab') {
            return (
                <Pressable onPress={() => navigation.navigate('Editions', { projectDomain: edition.projectDomain })}>
                    <Text style={themeTextColor}>
                        In {edition.projectDomain} <Icon name={'chevron-forward'} size={12} color={sv.primaryColor} />
                    </Text>
                </Pressable>
            );
        }

        if (edition?.description?.length > 0) {
            <Text style={themeTextColor}>{edition.description}</Text>;
        }
    };

    return (
        <View style={{ alignItems: 'center', backgroundColor: isDark && (index % 2 === 0 ? sv.darkerGray : sv.darkGray) || !isDark && (index % 2 === 0 ? 'white' : '') }}>
            <View style={styles.editionBlock}>
                <Pressable onPress={() => goToEdition(item, projectDomain, navigation)} style={[styles.flexRowContainer, styles.spaceBetween, styles.alignCenter]}>
                    <Image source={{ uri: item.screenshot_src }} style={styles.editionPhotoSmall} />

                    <EditionIcon item={item} />

                    <View style={styles.editionBlockDescription}>
                        <Text style={[styles.editionTitle, themeTextColor]}>
                            {item.title}
                        </Text>

                        {fromDownloads
                            ? <Pressable onPress={() => navigation.navigate('Editions', { projectDomain: item.projectDomain })}>
                                <Text style={themeTextColor}>
                                    In {item.projectDomain} <Icon name={'chevron-forward'} size={12} color={sv.primaryColor} />
                                </Text>
                            </Pressable>
                            : editionDescription(item)
                        }
                    </View>

                    <EditionMenu edition={item} projectDomain={projectDomain} navigation={navigation} route={route} onChangeEdition={onChangeEdition} onChangeFavorite={onChangeFavorite} onChangeDownloaded={onChangeDownloaded} />
                </Pressable>
            </View>
        </View >
    );
}
