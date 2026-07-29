import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { apiFetch } from '@/src/lib/api-fetch';

interface UserItem {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  userProfile?: {
    role: string;
  };
}

interface AuditLogItem {
  id: string;
  actorId: string;
  action: string;
  targetId?: string;
  timestamp: string;
}

interface SystemHealth {
  status: string;
  dbLatencyMs: number;
  uptimeSeconds: number;
  memoryUsageMB: number;
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'health' | 'audit'>('users');

  // Users state
  const [users, setUsers] = useState<UserItem[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Health state
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

  // Audit state
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(false);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'health') {
      fetchHealth();
    } else if (activeTab === 'audit') {
      fetchAuditLogs();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res: any = await apiFetch(`/api/admin/users${userSearch ? `?search=${userSearch}` : ''}`);
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      console.warn('Failed to fetch users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchHealth = async () => {
    setLoadingHealth(true);
    try {
      const res: any = await apiFetch('/api/admin/health');
      if (res.success) {
        setHealth(res.data);
      }
    } catch (err) {
      console.warn('Failed to fetch health:', err);
    } finally {
      setLoadingHealth(false);
    }
  };

  const fetchAuditLogs = async () => {
    setLoadingAudit(true);
    try {
      const res: any = await apiFetch('/api/admin/audit');
      if (res.success) {
        setAuditLogs(res.data);
      }
    } catch (err) {
      console.warn('Failed to fetch audit logs:', err);
    } finally {
      setLoadingAudit(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await apiFetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      fetchUsers();
    } catch (err) {
      console.warn('Failed to update role:', err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚡ Super Admin Portal</Text>
        <Text style={styles.subtitle}>
          System management, role control, audit logs, and diagnostics.
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {(['users', 'health', 'audit'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab 1: User Management */}
      {activeTab === 'users' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>User Roster & Roles</Text>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search user name or email..."
              placeholderTextColor="#94a3b8"
              value={userSearch}
              onChangeText={setUserSearch}
              onSubmitEditing={fetchUsers}
            />
            <TouchableOpacity style={styles.searchButton} onPress={fetchUsers}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>

          {loadingUsers ? (
            <ActivityIndicator size="large" color="#5c60f5" style={{ marginVertical: 20 }} />
          ) : users.length === 0 ? (
            <Text style={styles.emptyText}>No users found.</Text>
          ) : (
            users.map((u) => {
              const currentRole = u.userProfile?.role || 'external';
              return (
                <View key={u.id} style={styles.userRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.userName}>{u.name}</Text>
                    <Text style={styles.userEmail}>{u.email}</Text>
                  </View>
                  <View style={styles.rolePickerRow}>
                    <TouchableOpacity
                      style={[
                        styles.roleBadge,
                        currentRole === 'SUPER_ADMIN' || currentRole === 'ADMIN'
                          ? styles.roleAdmin
                          : currentRole === 'teacher'
                          ? styles.roleTeacher
                          : styles.roleStudent,
                      ]}
                      onPress={() => {
                        const nextRole =
                          currentRole === 'external'
                            ? 'woxsen-student'
                            : currentRole === 'woxsen-student'
                            ? 'teacher'
                            : 'SUPER_ADMIN';
                        handleRoleChange(u.id, nextRole);
                      }}
                    >
                      <Text style={styles.roleBadgeText}>{currentRole}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
      )}

      {/* Tab 2: System Health */}
      {activeTab === 'health' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>System Diagnostics & Telemetry</Text>

          {loadingHealth ? (
            <ActivityIndicator size="large" color="#5c60f5" style={{ marginVertical: 20 }} />
          ) : !health ? (
            <Text style={styles.emptyText}>Unable to load health metrics.</Text>
          ) : (
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Server Status</Text>
                <Text style={[styles.metricValue, { color: '#10b981' }]}>
                  {health.status.toUpperCase()} 🟢
                </Text>
              </View>

              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>DB Query Latency</Text>
                <Text style={styles.metricValue}>{health.dbLatencyMs} ms</Text>
              </View>

              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Uptime</Text>
                <Text style={styles.metricValue}>{Math.floor(health.uptimeSeconds / 60)} mins</Text>
              </View>

              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Heap Memory</Text>
                <Text style={styles.metricValue}>{health.memoryUsageMB} MB</Text>
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.refreshButton} onPress={fetchHealth}>
            <Text style={styles.refreshButtonText}>Refresh Metrics 🔄</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tab 3: Audit Logs */}
      {activeTab === 'audit' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Security & System Audit Logs</Text>

          {loadingAudit ? (
            <ActivityIndicator size="large" color="#5c60f5" style={{ marginVertical: 20 }} />
          ) : auditLogs.length === 0 ? (
            <Text style={styles.emptyText}>No audit logs recorded.</Text>
          ) : (
            auditLogs.map((log) => (
              <View key={log.id} style={styles.auditRow}>
                <View style={styles.auditHeader}>
                  <Text style={styles.auditAction}>{log.action}</Text>
                  <Text style={styles.auditTime}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
                <Text style={styles.auditActor}>Actor ID: {log.actorId}</Text>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8fafc',
    flexGrow: 1,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#5c60f5',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 14,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: '#5c60f5',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    marginVertical: 20,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  userEmail: {
    fontSize: 12,
    color: '#64748b',
  },
  rolePickerRow: {
    alignItems: 'flex-end',
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleStudent: {
    backgroundColor: '#e2e8f0',
  },
  roleTeacher: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  roleAdmin: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e293b',
  },
  metricsGrid: {
    gap: 12,
    marginBottom: 16,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  metricLabel: {
    fontSize: 13,
    color: '#475569',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  refreshButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  refreshButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5c60f5',
  },
  auditRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  auditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  auditAction: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5c60f5',
  },
  auditTime: {
    fontSize: 11,
    color: '#94a3b8',
  },
  auditActor: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
});
