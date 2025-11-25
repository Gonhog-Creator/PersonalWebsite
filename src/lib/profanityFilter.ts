// List of words that should bypass the profanity filter (case-insensitive)
const WHITELISTED_WORDS = [
  'shitake', 'shiitake', // Mushroom types
  'scunthorpe',         // Town in England
  'cocktail', 'cockpit', // Common words that might trigger false positives
  'assassin', 'classic', 'classical', // Words containing 'ass'
  'bass', 'pass', 'glass', 'grass',   // Words ending with 'ass'
  'molasses'                         // Sweetener
].map(word => word.toLowerCase());

// List of profane words to filter out (this is a basic example - consider using a more comprehensive list)
const PROFANE_WORDS = [
  // Common English profanity
  'ass', 'asshole', 'bitch', 'cock', 'crap', 'cunt', 'damn', 'dick', 'fuck',
  'fucking', 'fucker', 'motherfucker', 'nigga', 'nigger', 'piss', 'prick',
  'pussy', 'shit', 'slut', 'whore','cum',
  
  // Common Spanish profanity
  'puta', 'puto', 'mierda', 'joder', 'cabrón', 'cabron', 'pendejo', 'pendeja',
  'verga', 'picha', 'coño', 'cojones', 'gilipollas', 'zorra', 'zorro',
  'maricón', 'maricon', 'marica', 'subnormal', 'estúpido', 'estupido',
  'idiota', 'imbécil', 'imbecil', 'tonto', 'tonta', 'tontito', 'tontita'
];

// Create a regex pattern that matches any of the profane words without word boundaries
const PROFANITY_REGEX = new RegExp(
  `(${PROFANE_WORDS.join('|')})`,
  'gi'
);

// Create a pattern to match 3 or more consecutive word characters
const CONSECUTIVE_CHARS = /(\w)\1{2,}/gi;

// Create a pattern to match common word separators (for detecting combined words)
const WORD_SEPARATORS = /[\s\-_*.]*/g;

/**
 * Checks if a string contains profanity or suspicious patterns
 * @param text The text to check for profanity
 * @returns boolean indicating if profanity was found
 */
/**
 * Checks if a word is in the whitelist (case-insensitive)
 */
function isWhitelisted(word: string): boolean {
  return WHITELISTED_WORDS.includes(word.toLowerCase());
}

export function containsProfanity(text: string): boolean {
  if (!text) return false;
  
  // First, check if the entire text is whitelisted
  if (isWhitelisted(text)) {
    return false;
  }
  
  const lowerText = text.toLowerCase();
  
  // Check for direct profanity matches (including combined words)
  // But first check if the match is part of a whitelisted word
  const profanityMatch = lowerText.match(PROFANITY_REGEX);
  if (profanityMatch) {
    // Check if any of the matched words are not part of a whitelisted word
    const hasNonWhitelistedMatch = profanityMatch.some(match => {
      // Check if this match is part of a whitelisted word
      const wordBoundary = new RegExp(`\\b${match}\\b`, 'i');
      return !WHITELISTED_WORDS.some(whitelisted => wordBoundary.test(whitelisted));
    });
    
    if (hasNonWhitelistedMatch) {
      return true;
    }
  }
  
  // Check for suspicious patterns (3 or more consecutive identical characters)
  if (CONSECUTIVE_CHARS.test(text)) {
    return true;
  }
  
  // Check for combined profane words (e.g., 'crapcock')
  const normalizedText = lowerText.replace(WORD_SEPARATORS, '');
  for (const word of PROFANE_WORDS) {
    if (word.length < 3) continue; // Skip very short words to reduce false positives
    
    // Check if the word appears as a substring in the normalized text
    if (normalizedText.includes(word)) {
      return true;
    }
    
    // Check for words combined with other words (e.g., 'crap' + 'cock' = 'crapcock')
    if (PROFANE_WORDS.some(otherWord => {
      if (otherWord === word || otherWord.length < 3) return false;
      const combined = word + otherWord;
      return normalizedText.includes(combined) || 
             normalizedText.includes(combined.slice(0, -1)) || // Handle potential pluralization
             normalizedText.includes(combined + 's');
    })) {
      return true;
    }
  }
  
  // Check for partial matches (3 or more character sequences from profane words)
  const charGroups = lowerText.match(/[a-z]{3,}/g) || [];
  const profaneCharGroups = charGroups.filter(group => 
    PROFANE_WORDS.some(word => word.includes(group) && group.length >= 3)
  );
  
  // If we find 3 or more suspicious character groups, consider it profane
  return profaneCharGroups.length >= 3;
}

/**
 * Replaces profane words in a string with asterisks
 * @param text The text to sanitize
 * @returns Sanitized text with profanity replaced by asterisks
 */
export function sanitizeText(text: string): string {
  if (!text) return text;
  return text.replace(PROFANITY_REGEX, (match) => '*'.repeat(match.length));
}
