import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useTheme } from '@/src/theme/ThemeContext';
import { useApp } from '@/src/context/AppContext';
import { Screen, Card, Button, Badge, ProgressBar, Icon } from '@/src/components/ui';
import { LoadingSkeleton, EmptyState, ErrorBanner } from '@/src/components/common/StateViews';
import { N5DeadlineCard } from './N5DeadlineCard';
import { PebbleTimeline } from './PebbleTimeline';
import { useApiQuery } from '@/src/lib/use-api-query';
import { apiFetch } from '@/src/lib/api-fetch';
import { getApiUrl } from '@/src/lib/api-url';
import { TYPE, SPACING } from '@/src/theme/tokens';
import { computeAttendancePct, type AttendanceRecord } from './attendance-utils';

interface VaultFile {
  id: string;
  name?: string;
  filename?: string;
  size: string;
  date?: string;
  uploadedAt?: string;
  fileUrl?: string;
  url?: string;
}

type DownloadState = Record<string, 'idle' | 'loading' | 'done' | 'error'>;

export function WoxsenStudentDashboard() {
  const { theme } = useTheme();
  const { state } = useApp();
  const router = useRouter();

  const {
    data: attendanceData,
    isLoading: attendanceLoading,
    isError: attendanceError,
    refetch: refetchAttendance,
  } = useApiQuery<{ ok: boolean; records: AttendanceRecord[] }>('/api/attendance');

  const {
    data: filesData,
    isLoading: filesLoading,
    isError: filesError,
    refetch: refetchFiles,
  } = useApiQuery<{ ok: boolean; files: VaultFile[] }>('/api/files');

  const [downloadState, setDownloadState] = useState<DownloadState>({});

  const attendanceRecords = attendanceData?.records ?? [];
  const vaultFiles = filesData?.files ?? [];
  const attendancePct = computeAttendancePct(attendanceRecords);

  const nav = useCallback(
    (route: string) => {
      router.push(route as Parameters<typeof router.push>[0]);
    },
    [router]
  );

  const handleDownload = useCallback(
    async (file: VaultFile) => {
      const fileId = file.id;
      setDownloadState((prev) => ({ ...prev, [fileId]: 'loading' }));

      try {
        const res = await apiFetch<{ ok: boolean; downloadUrl: string }>(
          `/api/files/${fileId}/download`
        );

        if (!res.ok || !res.downloadUrl) {
          setDownloadState((prev) => ({ ...prev, [fileId]: 'error' }));
          return;
        }

        let downloadUrl = res.downloadUrl;
        if (!downloadUrl.startsWith('http')) {
          downloadUrl = `${getApiUrl()}${downloadUrl}`;
        }

        const filename = file.name || file.filename || 'download';
        const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
        const localPath = `${FileSystem.cacheDirectory}${sanitized}`;

        const { uri } = await FileSystem.downloadAsync(downloadUrl, localPath);

        const shareAvailable = await Sharing.isAvailableAsync();
        if (shareAvailable) {
          await Sharing.shareAsync(uri, {
            mimeType: 'application/octet-stream',
            dialogTitle: filename,
          });
        }

        setDownloadState((prev) => ({ ...prev, [fileId]: 'done' }));
      } catch (err) {
        console.error('Download failed:', err);
        setDownloadState((prev) => ({ ...prev, [fileId]: 'error' }));
      }
    },
    []
  );

  const renderAttendanceStatus = () => {
    if (attendanceRecords.length === 0) {
      return (
        <Badge
          label="No Records"
          variant="warning"
        />
      );
    }

    if (attendancePct >= 85) {
      return <Badge label="On Track" variant="success" />;
    }
    if (attendancePct >= 75) {
      return <Badge label="Monitor" variant="warning" />;
    }
    return <Badge label="At Risk" variant="error" />;
  };

  return (
    <Screen style={{ gap: SPACING.lg }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={[TYPE.title, { color: theme.text }]}>
            Woxsen University Portal
          </Text>
          {state.activeStudentName ? (
            <Text style={[TYPE.caption, { color: theme.textMuted, marginTop: 2 }]}>
              {'こんにちは, '}{state.activeStudentName}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity
          onPress={() => nav('/more/settings')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Settings"
        >
          <Icon name="sliders" size={20} color={theme.accent} />
        </TouchableOpacity>
      </View>

      <N5DeadlineCard
        n5TargetDate={state.n5TargetDate}
        solvedCount={state.solvedLessons.length}
        kanaCount={state.masteredKana.length}
        kanjiCount={state.practicedKanji.length}
        starredVocabCount={state.starredVocab.length}
        leavesGrown={state.solvedLessons.length + 2}
        onNavigateToRoadmap={() => nav('/more/planner')}
      />

      <Card>
        <PebbleTimeline
          solvedLessons={state.solvedLessons}
          activeLessonId={state.activeLessonId}
          onSelectLesson={() => nav('/more/planner')}
        />
      </Card>

      <Card padding={SPACING.md}>
        <Text style={[TYPE.bodyStrong, { color: theme.text, marginBottom: SPACING.sm }]}>
          Attendance
        </Text>

        {attendanceLoading ? (
          <LoadingSkeleton message="Loading attendance…" />
        ) : attendanceError ? (
          <ErrorBanner
            message="Failed to load attendance"
            onRetry={() => refetchAttendance()}
          />
        ) : attendanceRecords.length === 0 ? (
          <EmptyState
            title="No marks yet"
            subtitle="Your instructor will mark attendance for each class."
          />
        ) : (
          <View style={{ gap: SPACING.sm }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1, marginRight: SPACING.md }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}
                >
                  <Text style={[TYPE.caption, { color: theme.textMuted }]}>
                    Attendance Rate
                  </Text>
                  <Text style={[TYPE.caption, { color: theme.accent, fontWeight: '700' }]}>
                    {attendancePct}%
                  </Text>
                </View>
                <ProgressBar
                  progress={attendancePct / 100}
                />
              </View>
              {renderAttendanceStatus()}
            </View>

            <Text style={[TYPE.caption, { color: theme.textMuted }]}>
              {attendanceRecords.filter((r) => r.status === 'present').length}/
              {attendanceRecords.length} classes attended
            </Text>

            {attendanceRecords.slice(0, 3).map((rec, idx) => (
              <View
                key={rec.id ?? idx}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: SPACING.xs,
                  borderTopWidth: idx > 0 ? 1 : 0,
                  borderTopColor: theme.border,
                }}
              >
                <Icon
                  name={rec.status === 'present' ? 'check-circle' : 'x-circle'}
                  size={14}
                  color={rec.status === 'present' ? theme.success : theme.error}
                />
                <Text
                  style={[
                    TYPE.body,
                    { color: theme.text, flex: 1, marginLeft: SPACING.sm },
                  ]}
                >
                  {rec.attendanceDate || rec.date || '—'}
                </Text>
                <Badge
                  label={rec.status === 'present' ? 'Present' : rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
                  variant={rec.status === 'present' ? 'success' : 'error'}
                />
              </View>
            ))}
          </View>
        )}
      </Card>

      <Card padding={SPACING.md}>
        <Text style={[TYPE.bodyStrong, { color: theme.text, marginBottom: SPACING.sm }]}>
          Course Vault
        </Text>

        {filesLoading ? (
          <LoadingSkeleton message="Loading course files…" />
        ) : filesError ? (
          <ErrorBanner
            message="Failed to load course files"
            onRetry={() => refetchFiles()}
          />
        ) : vaultFiles.length === 0 ? (
          <EmptyState
            title="No files yet"
            subtitle="Course materials will appear here once uploaded by your instructor."
          />
        ) : (
          <View style={{ gap: SPACING.xs }}>
            {vaultFiles.map((file, idx) => {
              const ds = downloadState[file.id] ?? 'idle';
              return (
                <View
                  key={file.id ?? idx}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: SPACING.sm,
                    borderTopWidth: idx > 0 ? 1 : 0,
                    borderTopColor: theme.border,
                  }}
                >
                  <Icon name="file-text" size={16} color={theme.accent} />
                  <View style={{ flex: 1, marginLeft: SPACING.sm }}>
                    <Text style={[TYPE.body, { color: theme.text }]} numberOfLines={1}>
                      {file.name || file.filename || 'Untitled'}
                    </Text>
                    <Text style={[TYPE.caption, { color: theme.textMuted }]}>
                      {file.size}
                      {file.date || file.uploadedAt
                        ? ` • ${file.date || file.uploadedAt}`
                        : ''}
                    </Text>
                  </View>
                  {ds === 'error' ? (
                    <View style={{ flexDirection: 'row', gap: SPACING.xs }}>
                      <Text style={[TYPE.caption, { color: theme.error }]}>Failed</Text>
                      <Button
                        title="Retry"
                        size="sm"
                        variant="secondary"
                        onPress={() => handleDownload(file)}
                      />
                    </View>
                  ) : (
                    <Button
                      title={ds === 'loading' ? 'Downloading…' : ds === 'done' ? 'Open' : 'Download'}
                      size="sm"
                      variant="secondary"
                      onPress={() => handleDownload(file)}
                      disabled={ds === 'loading'}
                    />
                  )}
                </View>
              );
            })}
          </View>
        )}
      </Card>

      <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
        <View style={{ flex: 1 }}>
          <Card padding={SPACING.md}>
            <Text
              style={[
                TYPE.bodyStrong,
                { color: theme.text, textAlign: 'center' },
              ]}
            >
              Kaiwa
            </Text>
            <Button
              title="Practice"
              size="sm"
              variant="ghost"
              onPress={() => nav('/more/kaiwa')}
              style={{ marginTop: SPACING.xs }}
            />
          </Card>
        </View>
        <View style={{ flex: 1 }}>
          <Card padding={SPACING.md}>
            <Text
              style={[
                TYPE.bodyStrong,
                { color: theme.text, textAlign: 'center' },
              ]}
            >
              Radicals
            </Text>
            <Button
              title="Build"
              size="sm"
              variant="ghost"
              onPress={() => nav('/more/radicals')}
              style={{ marginTop: SPACING.xs }}
            />
          </Card>
        </View>
      </View>
    </Screen>
  );
}
