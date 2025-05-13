# Card Game Scorekeeper

The **Card Game Scorekeeper** is a mobile application designed to replace pen and paper when keeping score for card games. It offers a simple, efficient, and organized way to track scores throughout gameplay. 

## Purpose

This project was created to solve a real-world problem of manually tracking scores during card games. The goal was to design a user-friendly mobile app that eliminates the need for paper, reduces scoring errors, and enhances the overall gaming experience. While the initial focus is on ***Guesstimate***, a game frequently played by my gamily, the long-term objective is to build a flexible system that can handle various scoring rules and game formats.

## Features
- Record player names and set the starting dealer
- Log and track each round played during a game
- Step-by-step score entry for each player per round
- View a live scoreboard to see who is currently winning
- Save game progress and continue previously played games
- Easily review past rounds and scores for reference

## Tech Stack

- **Framework**: [React Native](https://reactnative.dev/)
- **Language**: TypeScript
- **Local Storage**: [`@react-native-async-storage/async-storage`](https://github.com/react-native-async-storage/async-storage)


## Installation & Setup

### 1. Install Dependencies

In the root project directory, install the required packages:

```bash
npm install
```

### 2. Start the Expo Development Server

Open another terminal window and start the development server:

```bash
npx expo start
```
### 3. Start a  Simulator or Run on Expo App

Once the development server is started, the app can be ran a variety of ways...
- Andoird simulator: download Android Studio and install a simulator
- iOS simulator: if you are using a Mac, use a simulator that comes with Xcode
- Physical device: download the Expo app on an iOS or Android device and scan the QR code presented on the launch of the Expo server