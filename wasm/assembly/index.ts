// Enhanced word lists for better sentiment analysis
const positiveWords: string[] = [
  "happy", "joy", "love", "great", "excellent", "amazing", 
  "wonderful", "fantastic", "good", "nice", "perfect", 
  "awesome", "brilliant", "cheerful", "delighted", "excited",
  "grateful", "pleased", "satisfied", "content", "optimistic",
  "thrilled", "ecstatic", "blissful", "peaceful", "confident",
  "successful", "proud", "accomplished", "motivated", "inspired",
  "hopeful", "relaxed", "energetic", "vibrant", "radiant"
];

const negativeWords: string[] = [
  "sad", "angry", "hate", "terrible", "awful", "horrible", 
  "depressed", "bad", "worse", "worst", "frustrated", 
  "disappointed", "upset", "worried", "anxious", "stressed",
  "overwhelmed", "exhausted", "lonely", "isolated", "hopeless",
  "worthless", "guilty", "ashamed", "rejected", "abandoned",
  "betrayed", "hurt", "broken", "devastated", "miserable",
  "desperate", "fearful", "panic", "dread", "doom"
];

const neutralWords: string[] = [
  "okay", "fine", "normal", "average", "regular", "typical",
  "standard", "ordinary", "usual", "common", "basic",
  "simple", "plain", "neutral", "balanced", "stable"
];

// Intensity modifiers
const intensifiers: string[] = [
  "very", "extremely", "incredibly", "absolutely", "completely",
  "totally", "really", "quite", "rather", "fairly", "pretty",
  "somewhat", "slightly", "a bit", "kind of", "sort of"
];

// Negation words that flip sentiment
const negationWords: string[] = [
  "not", "no", "never", "nothing", "nobody", "nowhere",
  "neither", "none", "cannot", "can't", "won't", "wouldn't",
  "shouldn't", "couldn't", "don't", "doesn't", "didn't"
];

// Helper functions for text processing
function removePunctuation(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    if ((char >= 'a' && char <= 'z') || 
        (char >= 'A' && char <= 'Z') || 
        (char >= '0' && char <= '9') || 
        char === ' ') {
      result += char;
    } else {
      result += ' ';
    }
  }
  return result;
}

function normalizeWhitespace(text: string): string {
  let words: string[] = [];
  let currentWord = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    if (char === ' ') {
      if (currentWord.length > 0) {
        words.push(currentWord);
        currentWord = '';
      }
    } else {
      currentWord += char;
    }
  }
  if (currentWord.length > 0) {
    words.push(currentWord);
  }
  
  return words.join(' ');
}

function trimString(str: string): string {
  let start = 0;
  let end = str.length - 1;
  
  // Find first non-space character
  while (start <= end && str.charAt(start) === ' ') {
    start++;
  }
  
  // Find last non-space character
  while (end >= start && str.charAt(end) === ' ') {
    end--;
  }
  
  return str.substring(start, end + 1);
}

// Main sentiment analysis function
export function analyzeSentiment(text: string): f32 {
  if (text.length === 0) return 5.0;
  
  // Clean and normalize text
  const processedText = normalizeWhitespace(removePunctuation(text.toLowerCase()));
  const cleanText = trimString(processedText);
  
  const words = cleanText.split(" ");
  const wordCount = words.length;
  
  if (wordCount === 0) return 5.0;
  
  let sentimentScore: f32 = 5.0; // Neutral baseline
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;
  
  // Process each word with context
  for (let i = 0; i < words.length; i++) {
    const word = trimString(words[i]);
    if (word.length === 0) continue;
    
    // Check for negation in previous words
    let isNegated = false;
    if (i > 0) {
      for (let j = Math.max(0, i - 2); j < i; j++) {
        if (isNegationWord(words[i32(j)])) {
          isNegated = true;
          break;
        }
      }
    }
    

    let intensity: f32 = 1.0;
    if (i > 0 && isIntensifier(words[i - 1])) {
      intensity = getIntensityMultiplier(words[i - 1]);
    }
    

    let wordSentiment: f32 = 0.0;
    
    if (isPositiveWord(word)) {
      wordSentiment = 0.8 * intensity;
      positiveCount++;
    } else if (isNegativeWord(word)) {
      wordSentiment = -0.8 * intensity;
      negativeCount++;
    } else if (isNeutralWord(word)) {
      wordSentiment = 0.0;
      neutralCount++;
    }
    
    // Apply negation
    if (isNegated) {
      wordSentiment = -wordSentiment;
    }
    
    sentimentScore += wordSentiment;
  }
  

  const averageImpact = (sentimentScore - 5.0) / f32(wordCount);
  sentimentScore = 5.0 + (averageImpact * f32(wordCount) * 0.1);
  
  const positiveRatio = f32(positiveCount) / f32(wordCount);
  const negativeRatio = f32(negativeCount) / f32(wordCount);
  

  sentimentScore += (positiveRatio * 2.0) - (negativeRatio * 2.0);
  

  return f32(Math.max(1.0, Math.min(10.0, sentimentScore)));
}

function isPositiveWord(word: string): boolean {
  for (let i = 0; i < positiveWords.length; i++) {
    if (word.includes(positiveWords[i]) || positiveWords[i].includes(word)) {
      return true;
    }
  }
  return false;
}

function isNegativeWord(word: string): boolean {
  for (let i = 0; i < negativeWords.length; i++) {
    if (word.includes(negativeWords[i]) || negativeWords[i].includes(word)) {
      return true;
    }
  }
  return false;
}

function isNeutralWord(word: string): boolean {
  for (let i = 0; i < neutralWords.length; i++) {
    if (word.includes(neutralWords[i]) || neutralWords[i].includes(word)) {
      return true;
    }
  }
  return false;
}

function isNegationWord(word: string): boolean {
  for (let i = 0; i < negationWords.length; i++) {
    if (word === negationWords[i]) {
      return true;
    }
  }
  return false;
}

function isIntensifier(word: string): boolean {
  for (let i = 0; i < intensifiers.length; i++) {
    if (word === intensifiers[i]) {
      return true;
    }
  }
  return false;
}

function getIntensityMultiplier(word: string): f32 {
  if (word === "very" || word === "extremely" || word === "incredibly") return 1.5;
  if (word === "absolutely" || word === "completely" || word === "totally") return 1.7;
  if (word === "quite" || word === "rather" || word === "really") return 1.3;
  if (word === "slightly" || word === "somewhat" || word === "a bit") return 0.7;
  return 1.0;
}

// Additional analysis functions
export function getMoodCategory(score: f32): i32 {
  if (score >= 8.5) return 4; // Very Positive
  if (score >= 6.5) return 3; // Positive  
  if (score >= 3.5) return 2; // Neutral
  if (score >= 2.0) return 1; // Negative
  return 0; // Very Negative
}

export function getMoodLabel(score: f32): string {
  const category = getMoodCategory(score);
  if (category === 4) return "Very Positive";
  if (category === 3) return "Positive";
  if (category === 2) return "Neutral";
  if (category === 1) return "Negative";
  return "Very Negative";
}