import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, Modal } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { Screen, Card, SegmentedControl, Badge, Button, Input } from '@/src/components/ui';
import { apiFetch } from '@/src/lib/api-fetch';
import { TYPE, SPACING, RADIUS } from '@/src/theme/tokens';
import { LoadingSkeleton, EmptyState, ErrorBanner } from '@/src/components/common/StateViews';

type Role = 'external' | 'woxsen-student' | 'teacher' | 'admin';

interface UserItem {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export function AdminDashboard() {
  const { theme } = useTheme();
  const [tab, setTab] = useState<'users' | 'health' | 'audit'>('users');
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleModal, setRoleModal] = useState<{ user: UserItem } | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<{ users: UserItem[] }>('/api/admin/users');
      setUsers(data.users ?? []);
    } catch {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const changeRole = async (userId: string, newRole: Role) => {
    try {
      await apiFetch('/api/admin/users', {
        method: 'PUT',
        body: JSON.stringify({ userId, role: newRole }),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch {
      Alert.alert('Error', 'Failed to update role.');
    }
  };

  const roleOptions: Role[] = ['external', 'woxsen-student', 'teacher', 'admin'];

  const roleVariant = (role: Role): 'muted' | 'accent' | 'success' | 'warning' => {
    if (role === 'admin') return 'accent';
    if (role === 'teacher') return 'success';
    return 'muted';
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Screen style={{ gap: SPACING.lg }}>
      <Text style={[TYPE.title, { color: theme.text }]}>Super Admin Portal</Text>

      <SegmentedControl
        options={[
          { label: 'Users', value: 'users' },
          { label: 'Health', value: 'health' },
          { label: 'Audit', value: 'audit' },
        ]}
        value={tab}
        onChange={(v) => setTab(v as 'users' | 'health' | 'audit')}
      />

      {tab === 'users' && (
        <>
          <Input
            placeholder="Search users..."
            value={search}
            onChangeText={setSearch}
          />
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorBanner message={error} onRetry={fetchUsers} />
          ) : filteredUsers.length === 0 ? (
            <EmptyState title="No users found" />
          ) : (
            <FlatList
              data={filteredUsers}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <Card style={{ marginBottom: SPACING.sm }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={[TYPE.body, { color: theme.text }]}>{item.name}</Text>
                      <Text style={[TYPE.caption, { color: theme.textMuted }]}>{item.email}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setRoleModal({ user: item })}
                    >
                      <Badge
                        label={item.role === 'woxsen-student' ? 'Woxsen' : item.role.charAt(0).toUpperCase() + item.role.slice(1)}
                        variant={roleVariant(item.role)}
                      />
                    </TouchableOpacity>
                  </View>
                </Card>
              )}
            />
          )}
        </>
      )}

      {tab === 'health' && (
        <Card>
          <Text style={[TYPE.body, { color: theme.text }]}>System Healthy</Text>
          <Text style={[TYPE.caption, { color: theme.textMuted, marginTop: SPACING.xs }]}>
            API latency: 45ms · Uptime: 99.9%
          </Text>
          <Button title="Refresh" variant="secondary" size="sm" onPress={() => {}} style={{ marginTop: SPACING.md }} />
        </Card>
      )}

      {tab === 'audit' && (
        <Card>
          <EmptyState title="No audit entries" subtitle="Recent system activity will appear here." />
        </Card>
      )}

      <Modal visible={!!roleModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <Card style={{ width: '80%' }}>
            <Text style={[TYPE.bodyStrong, { color: theme.text, marginBottom: SPACING.lg }]}>
              Change role for {roleModal?.user.name}
            </Text>
            {roleOptions.map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => {
                  if (roleModal) {
                    changeRole(roleModal.user.id, r);
                    setRoleModal(null);
                  }
                }}
                style={{
                  paddingVertical: SPACING.md,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.border,
                }}
              >
                <Text style={[TYPE.body, { color: theme.text }]}>
                  {r === 'woxsen-student' ? 'Woxsen Student' : r.charAt(0).toUpperCase() + r.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
            <Button
              title="Cancel"
              variant="ghost"
              onPress={() => setRoleModal(null)}
              style={{ marginTop: SPACING.md }}
            />
          </Card>
        </View>
      </Modal>
    </Screen>
  );
}
