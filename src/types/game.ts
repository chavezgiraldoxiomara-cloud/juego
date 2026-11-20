export type HunterRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface Character {
  id: string;
  name: string;
  title: string;
  role: string;
  rankBadge: string;
  avatar: string;
  description: string;
  quote: string;
  lore: string;
}

export type ActivityType =
  | 'multiple_choice'
  | 'matching'
  | 'ordering'
  | 'true_false'
  | 'fill_blank'
  | 'detect_clues'
  | 'choose_objects'
  | 'decision'
  | 'reflection';

export interface BaseActivity {
  id: string;
  type: ActivityType;
  title: string;
  instruction: string;
  xpReward: number;
  explanation: string; // Literary feedback & Kafka context
  hint: string;
}

export interface MultipleChoiceActivity extends BaseActivity {
  type: 'multiple_choice';
  question: string;
  options: string[];
  correctIndex: number;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface MatchingActivity extends BaseActivity {
  type: 'matching';
  prompt: string;
  pairs: MatchingPair[];
}

export interface OrderingItem {
  id: string;
  text: string;
  correctOrder: number; // 1-indexed
}

export interface OrderingActivity extends BaseActivity {
  type: 'ordering';
  prompt: string;
  items: OrderingItem[];
}

export interface TrueFalseStatement {
  id: string;
  statement: string;
  isTrue: boolean;
  justification: string;
}

export interface TrueFalseActivity extends BaseActivity {
  type: 'true_false';
  statements: TrueFalseStatement[];
}

export interface FillBlankActivity extends BaseActivity {
  type: 'fill_blank';
  preText: string;
  blankAnswer: string;
  postText: string;
  options: string[]; // choices for the blank
}

export interface SceneClue {
  id: string;
  name: string;
  symbolism: string;
  xPercent: number; // 0-100% position on poster/scene
  yPercent: number; // 0-100%
  radiusPercent: number;
}

export interface DetectCluesActivity extends BaseActivity {
  type: 'detect_clues';
  sceneImage: string;
  clues: SceneClue[];
  requiredCount: number;
}

export interface SymbolicObject {
  id: string;
  name: string;
  iconName: string;
  isImportant: boolean;
  symbolism: string;
}

export interface ChooseObjectsActivity extends BaseActivity {
  type: 'choose_objects';
  prompt: string;
  objects: SymbolicObject[];
  requiredIds: string[];
}

export interface DecisionOption {
  id: string;
  title: string;
  interpretation: string;
  literaryWeight: string;
}

export interface DecisionActivity extends BaseActivity {
  type: 'decision';
  scenario: string;
  options: DecisionOption[];
}

export interface ReflectionActivity extends BaseActivity {
  type: 'reflection';
  prompt: string;
  guidanceQuestions: string[];
  minWords: number;
}

export type GameActivity =
  | MultipleChoiceActivity
  | MatchingActivity
  | OrderingActivity
  | TrueFalseActivity
  | FillBlankActivity
  | DetectCluesActivity
  | ChooseObjectsActivity
  | DecisionActivity
  | ReflectionActivity;

export interface Dimension {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  characters: string[]; // character IDs
  scenarioName: string;
  literaryTheme: string;
  videoClip: string;
  posterImage: string;
  videoStartTime: number;
  videoEndTime: number;
  briefing: {
    sungJinWooIntro: string;
    objective: string;
  };
  insignia: {
    id: string;
    name: string;
    title: string;
    icon: string;
    color: string;
    description: string;
  };
  activities: GameActivity[];
}

export interface SaveState {
  completedMissions: number[]; // [1, 2, ...]
  completedActivities: string[]; // ["d1_act1", ...]
  savedAnswers: Record<string, any>;
  hasSeenIntro: boolean;
  isSoundMuted: boolean;
  finalRewardClaimed: boolean;
}
