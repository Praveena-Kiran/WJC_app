import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { STORIES, DuolingoStory, StoryOption } from './kaiwa-stories';

export function KaiwaView() {
  const [activeStory, setActiveStory] = useState<DuolingoStory | null>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [speechSpeed, setSpeechSpeed] = useState<0.75 | 1.0 | 1.25>(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedOption, setSelectedOption] = useState<StoryOption | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const startStory = (story: DuolingoStory) => {
    setActiveStory(story);
    setCurrentLineIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setIsFinished(false);
    setXpEarned(0);
  };

  const toggleSpeed = () => {
    if (speechSpeed === 0.75) setSpeechSpeed(1.0);
    else if (speechSpeed === 1.0) setSpeechSpeed(1.25);
    else setSpeechSpeed(0.75);
  };

  const handleSelectOption = (opt: StoryOption) => {
    setSelectedOption(opt);
    setShowFeedback(true);
    if (opt.isCorrect) {
      setXpEarned((prev) => prev + 20);
    }
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
      {/* Story Selection Screen */}
      {!activeStory && (
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Duolingo Kaiwa Stories</Text>
            <Text style={styles.subtitle}>
              Interactive conversational scenarios with audio controls & instant practice.
            </Text>
          </View>

          <Text style={styles.sectionHeader}>Available Stories</Text>
          {STORIES.map((story) => (
            <TouchableOpacity
              key={story.id}
              style={styles.storyCard}
              onPress={() => startStory(story)}
              activeOpacity={0.8}
            >
              <Text style={styles.storyIcon}>{story.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.storyTitle}>{story.title}</Text>
                <Text style={styles.storyJpTitle}>{story.japaneseTitle}</Text>
                <Text style={styles.storyCategory}>{story.category} • NPC: {story.npcName}</Text>
              </View>
              <Text style={styles.playArrow}>▶</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Active Story View */}
      {activeStory && !isFinished && (
        <View style={styles.card}>
          {/* Header Controls */}
          <View style={styles.storyHeader}>
            <TouchableOpacity onPress={() => setActiveStory(null)}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.storyHeaderTitle}>{activeStory.title}</Text>
            <TouchableOpacity style={styles.speedBadge} onPress={toggleSpeed}>
              <Text style={styles.speedText}>{speechSpeed}x Speed</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${((currentLineIndex + 1) / activeStory.lines.length) * 100}%`,
                },
              ]}
            />
          </View>

          {/* Current Line */}
          {(() => {
            const line = activeStory.lines[currentLineIndex];
            const isNpc = line.speaker === 'npc';

            return (
              <View style={styles.dialogueContainer}>
                <View style={styles.speakerRow}>
                  <Text style={styles.speakerAvatar}>{line.avatar}</Text>
                  <Text style={styles.speakerName}>{isNpc ? line.npcName : 'You'}</Text>

                  <TouchableOpacity
                    style={styles.audioButton}
                    onPress={() => setIsPlaying(!isPlaying)}
                  >
                    <Text style={styles.audioButtonText}>{isPlaying ? '⏸' : '🔊'}</Text>
                  </TouchableOpacity>
                </View>

                {/* Animated Waveform Visualizer */}
                {isPlaying && (
                  <View style={styles.waveformContainer}>
                    <View style={[styles.waveBar, { height: 16 }]} />
                    <View style={[styles.waveBar, { height: 24 }]} />
                    <View style={[styles.waveBar, { height: 12 }]} />
                    <View style={[styles.waveBar, { height: 20 }]} />
                  </View>
                )}

                {/* Bubble */}
                <View style={styles.speechBubble}>
                  <Text style={styles.japaneseText}>{line.japanese}</Text>
                  {Boolean(line.romaji) && <Text style={styles.romajiText}>{line.romaji}</Text>}
                  {Boolean(line.english) && <Text style={styles.englishText}>{line.english}</Text>}
                </View>

                {/* Interactive Options */}
                {line.options && (
                  <View style={styles.optionsContainer}>
                    <Text style={styles.optionsHeader}>Select Response:</Text>
                    {line.options.map((opt, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={[
                          styles.optionButton,
                          selectedOption === opt &&
                            (opt.isCorrect ? styles.optionCorrect : styles.optionIncorrect),
                        ]}
                        onPress={() => handleSelectOption(opt)}
                        disabled={showFeedback}
                      >
                        <Text style={styles.optionText}>{opt.text}</Text>
                        <Text style={styles.optionSubText}>{opt.english}</Text>
                      </TouchableOpacity>
                    ))}

                    {showFeedback && selectedOption && (
                      <View style={styles.feedbackContainer}>
                        <Text
                          style={[
                            styles.feedbackText,
                            { color: selectedOption.isCorrect ? '#10b981' : '#ef4444' },
                          ]}
                        >
                          {selectedOption.feedback}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Next Button */}
                {(!line.options || showFeedback) && (
                  <TouchableOpacity style={styles.nextButton} onPress={handleNextLine}>
                    <Text style={styles.nextButtonText}>Continue →</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })()}
        </View>
      )}

      {/* Completion Summary */}
      {activeStory && isFinished && (
        <View style={styles.card}>
          <Text style={styles.finishIcon}>🌟</Text>
          <Text style={styles.finishTitle}>Story Completed!</Text>
          <Text style={styles.finishSubtitle}>{activeStory.title}</Text>

          <View style={styles.xpBox}>
            <Text style={styles.xpNumber}>+{xpEarned + 50} XP</Text>
            <Text style={styles.xpLabel}>Earned from Scenario Practice</Text>
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={() => setActiveStory(null)}>
            <Text style={styles.nextButtonText}>Return to Story Deck</Text>
          </TouchableOpacity>
        </View>
      )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
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
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  storyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  storyIcon: {
    fontSize: 32,
  },
  storyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  storyJpTitle: {
    fontSize: 13,
    color: '#5c60f5',
    marginVertical: 2,
  },
  storyCategory: {
    fontSize: 11,
    color: '#64748b',
  },
  playArrow: {
    fontSize: 18,
    color: '#5c60f5',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    fontSize: 14,
    color: '#5c60f5',
    fontWeight: '700',
  },
  storyHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  speedBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  speedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5c60f5',
  },
  dialogueContainer: {
    marginTop: 8,
  },
  speakerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  speakerAvatar: {
    fontSize: 24,
  },
  speakerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  audioButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  audioButtonText: {
    fontSize: 14,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginVertical: 6,
  },
  waveBar: {
    width: 4,
    backgroundColor: '#5c60f5',
    borderRadius: 2,
  },
  speechBubble: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  japaneseText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  romajiText: {
    fontSize: 13,
    color: '#5c60f5',
    marginBottom: 2,
  },
  englishText: {
    fontSize: 13,
    color: '#64748b',
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionsHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  optionButton: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 8,
  },
  optionCorrect: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10b981',
  },
  optionIncorrect: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#ef4444',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  optionSubText: {
    fontSize: 12,
    color: '#64748b',
  },
  feedbackContainer: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#5c60f5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  finishIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 12,
  },
  finishTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  finishSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  xpBox: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  xpNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#5c60f5',
  },
  xpLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
});
