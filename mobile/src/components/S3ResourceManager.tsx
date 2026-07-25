import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export function S3ResourceManager() {
  const [status, setStatus] = useState<string>("Operating in Local Storage Mode (.env credentials pending)");
  const [files, setFiles] = useState([
    { name: "Minna-No-Nihongo-I-Grammar-Notes.pdf", size: "1.4 MB", date: "2026-07-14" },
    { name: "Basic-Kanji-Book-Chapter1-Exercises.pdf", size: "850 KB", date: "2026-07-17" }
  ]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>☁️ AWS S3 File Manager</Text>
        <Text style={styles.subtitle}>
          Upload and manage Japanese study guides, audio decks, and classroom PDFs.
        </Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{status}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Shared Course Documents</Text>

        {files.map((file, idx) => (
          <View key={idx} style={styles.fileRow}>
            <View>
              <Text style={styles.fileName}>{file.name}</Text>
              <Text style={styles.fileMeta}>{file.size} • {file.date}</Text>
            </View>
            <TouchableOpacity style={styles.downloadBtn}>
              <Text style={styles.downloadText}>Download</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  content: { padding: 16 },
  header: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#f8fafc" },
  subtitle: { fontSize: 13, color: "#94a3b8", marginTop: 4 },
  badge: {
    marginTop: 10,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
    alignSelf: "flex-start",
  },
  badgeText: { color: "#f59e0b", fontSize: 11, fontWeight: "bold" },
  card: { backgroundColor: "#1e293b", borderRadius: 16, padding: 16 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#f8fafc", marginBottom: 12 },
  fileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#334155",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  fileName: { color: "#f8fafc", fontSize: 13, fontWeight: "600" },
  fileMeta: { color: "#94a3b8", fontSize: 11, marginTop: 2 },
  downloadBtn: { backgroundColor: "#10b981", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  downloadText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
});
