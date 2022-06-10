import { StyleSheet } from 'react-native';
import sv from './variables';

export default StyleSheet.create({
	mb0: {
		marginBottom: sv.m0,
	},
	mb1: {
		marginBottom: sv.m1,
	},
	mb2: {
		marginBottom: sv.m2,
	},
	mb3: {
		marginBottom: sv.m3,
	},
	mb4: {
		marginBottom: sv.m4,
	},
	mb5: {
		marginBottom: sv.m5,
	},

	mt0: {
		marginTop: sv.m0,
	},
	mt1: {
		marginTop: sv.m1,
	},
	mt2: {
		marginTop: sv.m2,
	},
	mt3: {
		marginTop: sv.m3,
	},
	mt4: {
		marginTop: sv.m4,
	},
	mt5: {
		marginTop: sv.m5,
	},

	mr0: {
		marginRight: sv.m0,
	},
	mr1: {
		marginRight: sv.m1,
	},
	mr2: {
		marginRight: sv.m2,
	},
	mr3: {
		marginRight: sv.m3,
	},
	mr4: {
		marginRight: sv.m4,
	},
	mr5: {
		marginRight: sv.m5,
	},

	ml0: {
		marginLeft: sv.m0,
	},
	ml1: {
		marginLeft: sv.m1,
	},
	ml2: {
		marginLeft: sv.m2,
	},
	ml3: {
		marginLeft: sv.m3,
	},
	ml4: {
		marginLeft: sv.m4,
	},
	ml5: {
		marginLeft: sv.m5,
	},

	black: {
		color: sv.black,
	},

	flex1: {
		flex: 1,
	},

	fullContainer: {
		width: '100%',
		height: '100%',
	},

	alignStart: {
		alignContent: 'flex-start',
	},

	alignCenter: {
		alignItems: 'center',
	},

	alignEnd: {
		alignItems: 'flex-end',
	},

	spaceBetween: {
		justifyContent: 'space-between',
	},

	justifyContent: {
		justifyContent: 'center',
	},

	webview: {
		flex: 1,
		backgroundColor: 'black',
	},

	center: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: sv.m1,
	},

	mainContainer: {
		flex: 1,
		paddingHorizontal: sv.m2,
	},

	searchInput: {
		height: sv.m4,
		marginBottom: sv.m4,
		borderWidth: 1,
		borderColor: sv.lightGray,
		padding: sv.m1,
		borderRadius: sv.m2,
		color: sv.gray,
	},

	image: {
		flex: 1,
		overflow: 'hidden',
		justifyContent: 'center',
		borderRadius: sv.m1,
	},

	projectImage: {
		height: 100,
		margin: sv.m1,
		orderRadius: sv.m1,
	},

	centerContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},

	flexRowContainer: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
	},

	flexColumnContainer: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
	},

	header: {
		fontWeight: 'bold',
		fontSize: sv.m4,
		marginBottom: sv.m1,
		color: sv.black,
	},

	projectTitle: {
		fontWeight: 'bold',
		fontSize: sv.m2,
		color: sv.white,
		marginBottom: 4,
		padding: 4,
	},

	editionTitle: {
		fontWeight: 'bold',
		fontSize: sv.m2,
		color: sv.black,
		marginBottom: sv.m1,
	},

	subheader: {
		marginBottom: sv.m2,
		color: sv.black,
	},

	editionDescription: {
		marginBottom: sv.m3,
	},

	button: {
		marginBottom: sv.m3,
		padding: sv.m1,
		display: 'flex',
		alignItems: 'center',
		backgroundColor: sv.primaryColor,
		borderRadius: sv.m4,
	},

	iconButton: {
		padding: sv.m1,
		display: 'flex',
		justifyContent: 'center',
	},

	projectBlock: {
		padding: sv.m1,
	},

	editionContainer: {
		display: 'flex',
		height: '100%',
		backgroundColor: '#fafafa',
	},

	editionBlock: {
		marginVertical: sv.m2,
		marginHorizontal: sv.m3,
		display: 'flex',
	},

	editionBlockDescription: {
		width: '50%',
	},

	editionPhoto: {
		width: '100%',
		height: 175,
		marginBottom: sv.m3,
	},

	editionPhotoSmall: {
		width: 60,
		height: 60,
		borderRadius: sv.m1,
	},

	projectButton: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		height: '100%',
		alignItems: 'flex-end',
		justifyContent: 'center',
		marginBottom: sv.m3,
	},
});
