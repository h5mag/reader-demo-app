# H5mag reader app

Get up and running fast with our example H5mag reader app. 

It allows your customers to read your magazines, brochures or annual reports all within the app, online and offline. 

The app is fully customizable to your business needs and supports both iOS and Android. The app has been tested on the following OS versions:

| OS | Versions |
| ------ | ------ |
| iOS | 12.4, 15.0, 15.4 |
| Android | 7.0 - 12.0 |

## **List Of Contents**
- [Installation](#installation)
  - [Setup Android Emulator](#setup-android-emulator)
  - [Setup iOS Emulator](#setup-ios-emulator)
  - [Next steps](#next-steps)
- [Starting](#starting)
- [Project structure](#project-structure)
- [Using react-native-h5mag](#using-react-native-h5mag)
- [Troubleshooting](#troubleshooting)

## **Installation**

#### **Setup Android Emulator**

Installation instructions to get up and running for Android

1) Download and setup [Android Studio](https://developer.android.com/studio)
2) Create an Android device with at least SDK version 24 and at max 31

#### **Setup iOS Simulator**

Installation instructions to get up and running for iOS

1) Download and setup XCode 13 from the App Store
2) Create an Apple device with at least iOS 12.4 and at max 15.4

#### **Next steps**

1) Clone this repository.
2) Install packages using: `npm install`
3) Install cocoapods using: `sudo gem install cocoapods` || If you are on Apple Silicon use: `brew install cocoapods`
4) Install pod packages using: `cd ./ios && pod install`
5) cd back to the project root folder using: `cd ..`
6) In the project root folder, create a new js file called: `localConfig.js`
7) You need to add your public API key in the localConfig.js file like this:
```js
export const API_KEY = 'h5_public_abcdef';
```

## **Starting**

1) cd back to the project root folder.
2) Start the iOS emulator with Metro Bundler by using: `npx react-native run-ios`
3) Start the Android emulator with Metro Bundler by using: `npx react-native run-android`

## **Project structure**

```
    .
    ├── ...
    ├── android             # Android (build) files
    ├── assets              # Asset files (images)
    ├── ios                 # iOS (build) files
    ├── src                 # Source files
    │   ├── components      # Reusable components for screens
    │   ├── css             # CSS styles and variables
    │   ├── screens         # Views
    │   └── util            # Utility functions (Contains the SQLite Queries)
    ├── App.js              # Navigation (stack and tab)
    ├── config.js           # App settings (database and styling)
    ├── Database.js         # SQLite implementation
    ├── index.js            # AppRegistry
    └── ...
```

## **Using react-native-h5mag**

If you would like to see the full API and/or create your own app without the demo application, go [here](https://gitlab.local.schuttelaar.net/h5mag/app-framework-npm)

## **Troubleshooting**
##### Could not find tools.jar
On Windows you may encounter this error while building the app. In order to fix this do the following:
1) Open `android/gradle.properties`
2) Add this line: `org.gradle.java.home=C\:\\Program Files\\Java\\jdk1.8.0_181` (change it to your version)

## **License**
MIT
