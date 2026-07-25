import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { PitchAccentCoach } from "../components/PitchAccentCoach";
import { S3ResourceManager } from "../components/S3ResourceManager";

export default function App() {
  const [activeTab, setActiveTab] = useState<"journey" | "pitch" | "files">("pitch");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Main Content View */}
      <View style={styles.main}>
        {activeTab === "pitch" && <PitchAccentCoach />}
        {activeTab === "files" && <S3ResourceManager />}
        {activeTab === "journey" && (
          <View style={styles.centerBox}>
            <Text style={styles.title}>🗺️ N5 Guided Learning Path</Text>
            <Text style={styles.subtitle}>Curriculum Chapter 1 to 10 Stepper</Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>Chapter 1: Self Introductions & Greetings</Text>
              <Text style={styles.stepText}>Step 3 of 5: Pitch Accent & Shadowing Practice</Text>
            </View>
          </View>
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === "journey" && styles.navItemActive]}
          onPress={() => setActiveTab("journey")}
        >
          <Text style={[styles.navText, activeTab === "journey" && styles.navTextActive]}>🗺️ Journey</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === "pitch" && styles.navItemActive]}
          onPress={() => setActiveTab("pitch")}
        >
          <Text style={[styles.navText, activeTab === "pitch" && styles.navTextActive]}>🎙️ Pitch Coach</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === "files" && styles.navItemActive]}
          onPress={() => setActiveTab("files")}
        >
          <Text style={[styles.navText, activeTab === "files" && styles.navTextActive]}>☁️ S3 Resources</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  main: { flex: 1 },
  centerBox: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", color: "#f8fafc" },
  subtitle: { fontSize: 13, color: "#94a3b8", marginTop: 4 },
  card: { backgroundColor: "#1e293b", padding: 20, borderRadius: 16, marginTop: 20, width: "100%", alignItems: "center" },
  cardText: { fontSize: 16, fontWeight: "bold", color: "#34d399" },
  stepText: { fontSize: 13, color: "#cbd5e1", marginTop: 6 },
  navBar: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderTopWidth: 1,
    borderTopColor: "#334155",
    paddingVertical: 10,
    justifyContent: "space-around",
  },
  navItem: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  navItemActive: { backgroundColor: "rgba(16, 185, 129, 0.2)" },
  navText: { color: "#94a3b8", fontSize: 13, fontWeight: "600" },
  navTextActive: { color: "#34d399", fontWeight: "bold" },
});
