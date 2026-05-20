import { Button, EmptyState, Text, ThemedInput } from '@/components/ui';
import { borderRadius, colors, shadows, spacing } from '@/constants/theme';
import { concepts } from '@/data/vocabulary';
import { JournalEntryRow, useJournal } from '@/hooks/useDatabase';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,

  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const { entries, create, remove, update } = useJournal();
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntryText, setNewEntryText] = useState('');
  const [linkConceptId, setLinkConceptId] = useState<string | null>(null);
  const [showLinkPicker, setShowLinkPicker] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleSave = async () => {
    if (newEntryText.trim()) {
      await create(newEntryText.trim(), linkConceptId ?? undefined);
      setNewEntryText('');
      setLinkConceptId(null);
      setShowNewEntry(false);
      setShowLinkPicker(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this reflection? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await remove(id);
          },
        },
      ]
    );
  };

  const startEdit = (entry: JournalEntryRow) => {
    setEditingId(entry.id);
    setEditText(entry.content);
  };

  const handleUpdate = async () => {
    if (editingId && editText.trim()) {
      await update(editingId, editText.trim());
      setEditingId(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const formatDateDay = (dateString: string) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  const formatDateMonth = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { month: 'short' });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text variant="h2" style={styles.pageTitle}>
          Reflections
        </Text>
        {!showNewEntry && !editingId && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowNewEntry(true)}
            accessibilityRole="button"
            accessibilityLabel="Create new journal entry"
          >
            <Ionicons name="create-outline" size={24} color={colors.primary[600]} />
          </TouchableOpacity>
        )}
      </View>

      {/* New Entry Compose */}
      {showNewEntry && (
        <View style={styles.composeContainer}>
          <ThemedInput
            style={styles.input}
            containerStyle={styles.inputContainer}
            placeholder="What's been on your mind regarding your journey?"
            placeholderTextColor={colors.text.tertiary}
            multiline
            value={newEntryText}
            onChangeText={setNewEntryText}
            autoFocus
            accessibilityLabel="Journal entry text"
          />

          {/* Concept Link */}
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => setShowLinkPicker(!showLinkPicker)}
            accessibilityRole="button"
            accessibilityLabel={linkConceptId ? 'Change linked concept' : 'Link to a concept'}
          >
            <Ionicons
              name={linkConceptId ? 'pricetag' : 'pricetag-outline'}
              size={16}
              color={linkConceptId ? colors.primary[600] : colors.text.tertiary}
            />
            <Text
              variant="caption"
              color={linkConceptId ? colors.primary[600] : colors.text.tertiary}
              style={{ marginLeft: spacing.sm }}
            >
              {linkConceptId
                ? concepts.find((c) => c.id === linkConceptId)?.name ?? 'Linked concept'
                : 'Link to a concept (optional)'}
            </Text>
          </TouchableOpacity>

          {showLinkPicker && (
            <View style={styles.linkPicker}>
              <TouchableOpacity
                style={styles.linkOption}
                onPress={() => {
                  setLinkConceptId(null);
                  setShowLinkPicker(false);
                }}
              >
                <Text
                  variant="caption"
                  color={linkConceptId === null ? colors.primary[600] : colors.text.secondary}
                >
                  None
                </Text>
              </TouchableOpacity>
              {concepts.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={styles.linkOption}
                  onPress={() => {
                    setLinkConceptId(c.id);
                    setShowLinkPicker(false);
                  }}
                >
                  <Text
                    variant="caption"
                    color={linkConceptId === c.id ? colors.primary[600] : colors.text.secondary}
                  >
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.composeActions}>
            <Button
              title="Cancel"
              variant="ghost"
              size="sm"
              onPress={() => {
                setShowNewEntry(false);
                setNewEntryText('');
                setLinkConceptId(null);
                setShowLinkPicker(false);
              }}
            />
            <Button
              title="Save Entry"
              size="sm"
              onPress={handleSave}
              disabled={!newEntryText.trim()}
            />
          </View>
        </View>
      )}

      {/* Edit Inline */}
      {editingId && (
        <View style={styles.composeContainer}>
          <ThemedInput
            style={styles.input}
            containerStyle={styles.inputContainer}
            placeholder="Edit your reflection..."
            placeholderTextColor={colors.text.tertiary}
            multiline
            value={editText}
            onChangeText={setEditText}
            autoFocus
            accessibilityLabel="Edit journal entry text"
          />
          <View style={styles.composeActions}>
            <Button title="Cancel" variant="ghost" size="sm" onPress={cancelEdit} />
            <Button
              title="Update"
              size="sm"
              onPress={handleUpdate}
              disabled={!editText.trim()}
            />
          </View>
        </View>
      )}

      {entries.length > 0 ? (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JournalEntryRowItem
              entry={item}
              onDelete={() => handleDelete(item.id)}
              onEdit={() => startEdit(item)}
              isEditing={editingId === item.id}
              formatDateDay={formatDateDay}
              formatDateMonth={formatDateMonth}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : !showNewEntry && !editingId ? (
        <EmptyState
          title="Your personal space"
          message="Use this space to record thoughts, discoveries, and feelings. These are private to you."
          icon="book-outline"
          actionLabel="Write First Entry"
          onAction={() => setShowNewEntry(true)}
        />
      ) : null}
    </KeyboardAvoidingView>
  );
}

function JournalEntryRowItem({
  entry,
  onDelete,
  onEdit,
  isEditing,
  formatDateDay,
  formatDateMonth,
}: {
  entry: JournalEntryRow;
  onDelete: () => void;
  onEdit: () => void;
  isEditing: boolean;
  formatDateDay: (d: string) => number;
  formatDateMonth: (d: string) => string;
}) {
  const linkedConcept = entry.concept_id
    ? concepts.find((c) => c.id === entry.concept_id)
    : null;

  if (isEditing) return null;

  return (
    <View style={styles.entryRow}>
      {/* Date Column */}
      <View style={styles.dateColumn}>
        <Text variant="h3" color={colors.text.primary} style={{ lineHeight: 28 }}>
          {formatDateDay(entry.created_at)}
        </Text>
        <Text variant="labelSmall" color={colors.text.tertiary}>
          {formatDateMonth(entry.created_at).toUpperCase()}
        </Text>
      </View>

      {/* Content Column */}
      <TouchableOpacity
        style={styles.entryContentBox}
        onPress={onEdit}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel={`Journal entry from ${formatDateMonth(entry.created_at)} ${formatDateDay(entry.created_at)}. Double tap to edit.`}
      >
        <Text variant="body" style={styles.entryText}>
          {entry.content}
        </Text>

        <View style={styles.entryFooter}>
          {linkedConcept && (
            <View style={styles.conceptTag}>
              <Ionicons name="pricetag-outline" size={12} color={colors.primary[600]} />
              <Text variant="caption" color={colors.primary[600]}>
                {linkedConcept.name}
              </Text>
            </View>
          )}

          <View style={styles.entryActions}>
            <TouchableOpacity
              onPress={onEdit}
              style={styles.actionBtn}
              accessibilityRole="button"
              accessibilityLabel="Edit entry"
            >
              <Ionicons name="pencil-outline" size={14} color={colors.text.tertiary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onDelete}
              style={styles.actionBtn}
              accessibilityRole="button"
              accessibilityLabel="Delete entry"
            >
              <Ionicons name="trash-outline" size={14} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
  },
  pageTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 32,
  },
  addButton: {
    padding: spacing.xs,
    backgroundColor: colors.primary[50],
    borderRadius: 20,
  },

  // Compose
  composeContainer: {
    margin: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    ...shadows.md,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  input: {
    minHeight: 120,
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: colors.text.primary,
    textAlignVertical: 'top',
    lineHeight: 28,
  },
  composeActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },

  // Concept Link
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  linkPicker: {
    maxHeight: 180,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  linkOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  // List
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  entryRow: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  dateColumn: {
    width: 50,
    alignItems: 'center',
    paddingTop: 4,
    marginRight: spacing.md,
  },
  entryContentBox: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderBottomLeftRadius: 0,
    ...shadows.sm,
  },
  entryText: {
    fontSize: 17,
    lineHeight: 26,
    color: colors.text.secondary,
  },
  entryFooter: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conceptTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  entryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionBtn: {
    padding: 4,
  },

  // Empty state now handled by <EmptyState /> component
});
