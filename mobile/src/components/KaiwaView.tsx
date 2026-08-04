import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { SPACING, RADIUS, TYPE } from '@/src/theme/tokens';
import { Screen, Card, Button, ProgressBar, Icon } from '@/src/components/ui';
import { STORIES, DuolingoStory, StoryOption, StoryLine } from './kaiwa-stories';

function SpeakerIndicator({
  speaker,
  npcName,
}: {
  speaker: 'npc' | 'user';
  npcName?: string;
}) {
  const { theme } = useTheme();
  const isNpc = speaker === 'npc';
  const initials = (isNpc ? npcName : 'You')?.charAt(0).toUpperCase() ?? '?';

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs }}>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: isNpc ? theme.accentMuted : theme.surfaceAlt,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: SPACING.sm,
        }}
      >
        <Icon
          name={isNpc ? 'user' : 'user'}
          size={12}
          color={isNpc ? theme.accent : theme.textMuted}
        />
      </View>
      <Text style={[TYPE.caption, { color: theme.text, fontWeight: '700' }]}>
        {isNpc ? npcName : 'You'}
      </Text>
    </View>
  );
}

function ChatBubble({
  line,
  isCurrent,
}: {
  line: StoryLine;
  isCurrent: boolean;
}) {
  const { theme } = useTheme();

  return (
    <View style={{ marginBottom: SPACING.lg }}>
      <SpeakerIndicator speaker={line.speaker} npcName={line.npcName} />
      <View
        style={{
          backgroundColor: isCurrent ? theme.surface : theme.surfaceAlt,
          padding: SPACING.md,
          borderRadius: RADIUS.md,
          borderWidth: 1,
          borderColor: isCurrent ? theme.accent : theme.border,
          marginLeft: 32,
        }}
      >
        <Text style={[TYPE.bodyStrong, { color: theme.text, marginBottom: 2 }]}>
          {line.japanese}
        </Text>
        {Boolean(line.romaji) && (
          <Text style={[TYPE.caption, { color: theme.accent, marginBottom: 2 }]}>
            {line.romaji}
          </Text>
        )}
        {Boolean(line.english) && (
          <Text style={[TYPE.caption, { color: theme.textMuted }]}>
            {line.english}
          </Text>
        )}
      </View>
    </View>
  );
}

export function KaiwaView() {
  const { theme } = useTheme();
  const [activeStory, setActiveStory] = useState<DuolingoStory | null>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<StoryOption | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const startStory = (story: DuolingoStory) => {
    setActiveStory(story);
    setCurrentLineIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setIsFinished(false);
  };

  const handleSelectOption = (opt: StoryOption) => {
    setSelectedOption(opt);
    setShowFeedback(true);
  };

  const handleNextLine = () => {
    if (!activeStory) return;
    if (currentLineIndex < activeStory.lines.length - 1) {
      setCurrentLineIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <Screen>
      {!activeStory && (
        <View>
          <View style={{ marginBottom: SPACING.lg }}>
            <Text style={[TYPE.title, { color: theme.text }]}>Kaiwa Stories</Text>
            <Text style={[TYPE.caption, { color: theme.textMuted, marginTop: SPACING.xs }]}>
              Interactive conversational scenarios for Japanese practice.
            </Text>
          </View>

          <Text style={[TYPE.bodyStrong, { color: theme.text, marginBottom: SPACING.md }]}>
            Available Stories
          </Text>
          {STORIES.map((story) => (
            <TouchableOpacity
              key={story.id}
              onPress={() => startStory(story)}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.surface,
                padding: SPACING.lg,
                borderRadius: RADIUS.md,
                marginBottom: SPACING.md,
                borderWidth: 1,
                borderColor: theme.border,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: theme.accentMuted,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: SPACING.md,
                }}
              >
                <Icon name="book-open" size={18} color={theme.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[TYPE.bodyStrong, { color: theme.text }]}>{story.title}</Text>
                <Text style={[TYPE.caption, { color: theme.accent, marginVertical: 2 }]}>
                  {story.japaneseTitle}
                </Text>
                <Text style={[TYPE.caption, { color: theme.textMuted }]}>
                  {story.category}
                </Text>
              </View>
              <Icon name="chevron-right" size={16} color={theme.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {activeStory && !isFinished && (
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: SPACING.md,
            }}
          >
            <TouchableOpacity
              onPress={() => setActiveStory(null)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: SPACING.md,
              }}
            >
              <Icon name="chevron-left" size={18} color={theme.accent} />
              <Text style={[TYPE.caption, { color: theme.accent, fontWeight: '700' }]}>
                Back
              </Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={[TYPE.bodyStrong, { color: theme.text }]} numberOfLines={1}>
                {activeStory.title}
              </Text>
              <Text style={[TYPE.caption, { color: theme.textMuted }]}>
                {activeStory.category}
              </Text>
            </View>
          </View>

          <ProgressBar
            progress={(currentLineIndex + 1) / activeStory.lines.length}
            height={4}
            style={{ marginBottom: SPACING.lg }}
          />

          <Card>
            {activeStory.lines.slice(0, currentLineIndex + 1).map((line, idx) => (
              <View key={line.id}>
                {line.options && idx === currentLineIndex ? (
                  <>
                    <ChatBubble
                      line={{ ...line, options: undefined }}
                      isCurrent={true}
                    />
                    <View style={{ marginLeft: 32, marginBottom: SPACING.lg }}>
                      <Text
                        style={[
                          TYPE.caption,
                          { color: theme.textMuted, marginBottom: SPACING.sm, fontWeight: '700' },
                        ]}
                      >
                        Select response:
                      </Text>
                      {line.options.map((opt, oi) => {
                        const isSelected = selectedOption === opt;
                        let borderColor = theme.border;
                        let bg = theme.surfaceAlt;

                        if (showFeedback && isSelected) {
                          if (opt.isCorrect) {
                            borderColor = theme.success;
                            bg = theme.successMuted;
                          } else {
                            borderColor = theme.error;
                            bg = theme.errorMuted;
                          }
                        }

                        return (
                          <TouchableOpacity
                            key={oi}
                            onPress={() => handleSelectOption(opt)}
                            disabled={showFeedback}
                            activeOpacity={0.7}
                            style={{
                              backgroundColor: bg,
                              padding: SPACING.md,
                              borderRadius: RADIUS.sm,
                              borderWidth: 1,
                              borderColor,
                              marginBottom: SPACING.sm,
                            }}
                          >
                            <Text style={[TYPE.bodyStrong, { color: theme.text }]}>
                              {opt.text}
                            </Text>
                            <Text style={[TYPE.caption, { color: theme.textMuted, marginTop: 2 }]}>
                              {opt.english}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}

                      {showFeedback && selectedOption && (
                        <View
                          style={{
                            marginTop: SPACING.sm,
                            padding: SPACING.sm,
                            backgroundColor: theme.surfaceAlt,
                            borderRadius: RADIUS.sm,
                          }}
                        >
                          <Text
                            style={[
                              TYPE.caption,
                              {
                                color: selectedOption.isCorrect ? theme.success : theme.error,
                                fontWeight: '600',
                              },
                            ]}
                          >
                            {selectedOption.feedback}
                          </Text>
                        </View>
                      )}
                    </View>
                  </>
                ) : (
                  <ChatBubble line={line} isCurrent={idx === currentLineIndex} />
                )}
              </View>
            ))}

            {(function () {
              const currentLine = activeStory.lines[currentLineIndex];
              if (!currentLine.options || showFeedback) {
                return (
                  <Button
                    title="Continue"
                    onPress={handleNextLine}
                    style={{ marginTop: SPACING.sm }}
                  />
                );
              }
              return null;
            })()}
          </Card>
        </View>
      )}

      {activeStory && isFinished && (
        <Card style={{ alignItems: 'center' }}>
          <Icon name="check-circle" size={48} color={theme.accent} />
          <Text style={[TYPE.title, { color: theme.text, marginTop: SPACING.md }]}>
            Story Completed!
          </Text>
          <Text style={[TYPE.body, { color: theme.textMuted, marginTop: SPACING.xs, marginBottom: SPACING.xl }]}>
            {activeStory.title}
          </Text>
          <Button
            title="Return to Story Deck"
            onPress={() => setActiveStory(null)}
          />
        </Card>
      )}
    </Screen>
  );
}
