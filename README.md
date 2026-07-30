# Zengo (禅語) - JLPT N5 Learning Platform

A modern, full-stack Japanese learning platform featuring interactive Kana/Kanji stroke order practice, SRS flashcards, JLPT N5 syllabus stepping stones, and practice quizzes.

## Project Structure
- `mobile/`: React Native Expo application built with Expo Router.
- `web/`: Next.js web application.

## Mobile Development & Expo Go vs Dev Build (#039b)
- **Expo Go Prototyping**: Standard Expo UI components, navigation, and state run out-of-the-box using `npx expo start`.
- **Custom Development Build Escape Hatch**:
  When using native modules such as `expo-speech` or `@sentry/react-native`, create a custom development build:
  ```bash
  cd mobile
  npx expo run:android  # or npx expo run:ios
  ```
