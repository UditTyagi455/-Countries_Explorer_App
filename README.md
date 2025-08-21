# 🌎 Countries Explorer App

A React Native interview task that showcases country data with search, region filters, navigation to a detail view, favorites with persistence, and a light/dark theme switcher.

---

# 📸 Screenshots

![Home Screen](./assets\image\Screenshot_1755785133.png)

## ✨ Features

* Fetch countries from **REST Countries v3** (`/v3.1/all?fields=name,flags,region,population,languages,currencies,timezones`)
* Countries list with **name**, **flag**, and **region**
* **Search** (case‑insensitive) by country name
* **Filter by region** (All, Africa, Americas, Asia, Europe, Oceania, Antarctic)
* **Details screen**: population, languages, currencies, timezones
* **Loading** state + **error with retry**
* **FlatList** with proper `keyExtractor` and memoized rows
* **Favorites**: mark/unmark and **persist** with AsyncStorage (or MMKV)
* **Light/Dark theme** toggle via React Context
* **React Navigation** for stack navigation

> This repo is designed to evaluate coding style, state management, navigation, and performance handling.

---

## 🛠️ Tech Stack

* **React Native** (CLI or Expo)
* **TypeScript** (optional but recommended)
* **React Navigation** (`@react-navigation/native`, `@react-navigation/native-stack`)
* **AsyncStorage** (`@react-native-async-storage/async-storage`) or **MMKV** (`react-native-mmkv`)
* **React Context** for theme + favorites state
* **Jest** + **@testing-library/react-native** (optional test setup)

---

## 📦 Getting Started

### 1) Prerequisites

* Node.js LTS
* Yarn or npm
* Xcode (iOS) / Android Studio (Android)

### 2) Clone

```bash
git clone https://github.com/UditTyagi455/-Countries_Explorer_App.git
cd -countries-explorer
```

### 3) Install dependencies

```bash
# using yarn
yarn

# or npm
npm install
```

#### If using **React Native CLI**

```bash
# iOS
cd ios && pod install && cd ..

# run
npx react-native run-ios
npx react-native run-android
```


---

## ⚙️ Environment

No API keys required. Public API endpoint (REST Countries):

```
https://restcountries.com/v3.1/all?fields=name,flags,region,population,languages,currencies,timezones
```

---

## 🗂️ Project Structure (suggested)

```
src/
  components/
    CountryDetail
    CountryList
  screens/
    HomeScreen.tsx      # list + search + region filter
App.tsx
```

---

## 🔌 API Notes

Sample country shape (simplified):

```json
{
  "name": { "common": "Germany" },
  "flags": { "png": "https://.../de.png", "svg": "https://.../de.svg" },
  "region": "Europe",
  "population": 83240525,
  "languages": { "deu": "German" },
  "currencies": { "EUR": { "name": "Euro", "symbol": "€" } },
  "timezones": ["UTC+01:00"]
}
```

---

## 📱 Usage

* **Home**: list of countries, search bar, region filter chips/buttons
* Tap a country → **Details**: flag, region, population, languages, currencies, timezones
* Tap ⭐ on a country to add/remove from **Favorites** (persisted)
* Toggle **Theme** in header or settings button

---

## 🧩 Key Implementation Details

### State Management

* **ThemeContext**: provides current theme + toggle function
* **FavoritesContext**: manages a Set
