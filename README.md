# Gallery Club London - Prototype

This is a React Native and Expo prototype for the "Gallery Club London" mobile application.

## Overview

This prototype was generated to demonstrate the core features of the application without a real backend. All data is mocked and stored locally within the app.

### Features Implemented:
- **Authentication**: Simulated login (email/password & social).
- **Profile Management**: View user profile, membership status, and points.
- **Events**: Browse upcoming events.
- **Perks & Partners**: View partner benefits based on membership tier.
- **Check-in**: Display a personal QR code for entry.
- **Staff Dashboard**: A special tab for staff to view members (visible if you log in with `admin@galleryclub.com`).
- **UI/Design**: A consistent dark theme with reusable components.

## Getting Started

### Prerequisites
- Node.js (LTS version recommended)
- `npm` or `yarn`
- Expo Go app on your iOS or Android device, or an emulator/simulator.

### Installation & Setup

1.  **Clone the repository (or download the files).**

2.  **Install dependencies.**
    As the auto-generation could not run this step for you, you need to run it manually. From the root of the project directory, run:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

3.  **Start the development server.**
    ```bash
    npm start
    ```
    or
    ```bash
    expo start
    ```

4.  **Run the app.**
    - Scan the QR code shown in the terminal with the Expo Go app on your phone.
    - Or, press `i` to run on an iOS simulator or `a` to run on an Android emulator.

## How to Use the Mock Data

### Test Users
You can log in with the following mock user accounts. Any password will work.

- **Gold Member**: `john.doe@example.com`
- **Silver Member**: `jane.smith@example.com`
- **Staff Member**: `admin@galleryclub.com` (This will reveal the "Staff" tab)

### Modifying Mock Data
All mock data (users, events, partners) is located in:
`src/api/mockData.ts`

You can edit this file directly to change the data used in the application. After making changes, you may need to reload the app (press `r` in the terminal where Expo is running).

## Project Structure

- `app/`: Contains all the screens and navigation logic, powered by `expo-router`.
  - `(tabs)/`: Defines the main bottom tab navigator and its screens.
  - `_layout.tsx`: The root navigator, handling auth vs. main app state.
  - `login.tsx`: The login screen.
- `src/`: Core application source code.
  - `api/`: Mock data definitions.
  - `components/`: Reusable UI components (Button, Card, etc.).
  - `constants/`: Theme (colors, fonts, sizes).
  - `store/`: Global state management with Zustand.
- `assets/`: Static assets like images and icons (currently placeholders).
- `package.json`: Project dependencies and scripts.
- `README.md`: This file.
