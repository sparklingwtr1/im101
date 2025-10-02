const fs = require('fs');
const path = require('path');

// Sample sad/down user journal entries
const sadEntryTemplates = [
  "I feel so alone today",
  "Everything feels overwhelming right now",
  "I can't seem to find joy in anything anymore",
  "I'm feeling really down and don't know why",
  "Today was just too much for me to handle",
  "I feel like I'm not good enough",
  "I'm so tired of feeling this way",
  "Nothing seems to be going right",
  "I feel empty inside",
  "I'm struggling to get through each day",
  "I feel like giving up",
  "I don't feel like myself anymore",
  "Everything feels pointless",
  "I'm so exhausted emotionally",
  "I feel lost and don't know what to do",
  "I'm tired of pretending I'm okay",
  "I feel like a burden to everyone",
  "I can't stop crying today",
  "I feel so disconnected from everyone",
  "Nothing makes me happy anymore",
  "I'm having a really hard time",
  "I feel stuck in this sadness",
  "I don't see the point in trying anymore",
  "I feel so heavy and sad",
  "I'm drowning in my own thoughts",
  "I feel like nobody understands me",
  "I'm so disappointed in myself",
  "I feel hopeless about the future",
  "I can't seem to shake this feeling",
  "I'm feeling really low today",
  "I feel like I'm failing at everything",
  "I'm so sad and don't know how to cope",
  "I feel numb to everything",
  "I'm losing motivation for everything",
  "I feel broken inside",
  "I'm struggling with my self-worth",
  "I feel abandoned",
  "I'm having trouble seeing the good in anything",
  "I feel like I'm drowning in sadness",
  "I can't find a reason to smile",
  "I'm feeling really vulnerable right now",
  "I feel like my world is falling apart",
  "I'm so tired of feeling sad",
  "I feel like I'm invisible",
  "I'm struggling to find meaning in anything",
  "I feel so defeated",
  "I'm carrying so much pain",
  "I feel like I'm not enough",
  "I'm feeling really fragile today",
  "I feel like giving up on everything"
];

// Empathetic response templates
const empatheticResponses = [
  "I hear you, and your feelings are completely valid. It's okay to feel this way, and you're not alone in this experience.",
  "Thank you for sharing how you're feeling. What you're going through sounds really difficult, and it takes courage to acknowledge these emotions.",
  "I'm sorry you're experiencing this. Please know that these feelings are temporary, even though they feel overwhelming right now.",
  "Your feelings matter, and it's important that you're expressing them. You're taking an important step by acknowledging how you feel.",
  "I understand that things feel heavy right now. Remember to be gentle with yourself during this difficult time.",
  "It's okay to not be okay. What you're feeling is a natural human experience, and you deserve compassion and understanding.",
  "I hear the pain in your words. Please remember that you're stronger than you know, even when you don't feel strong.",
  "Thank you for being honest about your feelings. It's brave to face these emotions rather than push them away.",
  "I want you to know that your feelings are real and important. You don't have to go through this alone.",
  "What you're experiencing sounds incredibly difficult. Please be patient with yourself as you navigate these feelings.",
  "I'm here with you in this moment. Your emotions are valid, and it's okay to feel sad sometimes.",
  "I acknowledge your pain and want you to know that it's okay to take things one moment at a time.",
  "Your feelings are understandable given what you're going through. Remember that healing isn't linear.",
  "I hear you, and I want you to know that feeling this way doesn't make you weak. It makes you human.",
  "Thank you for trusting yourself enough to express these feelings. That's an important act of self-care.",
  "I understand that everything feels heavy right now. Small steps are still progress, even when they don't feel like it.",
  "What you're feeling is valid. Please remember that difficult feelings pass, even when they feel permanent.",
  "I'm sorry you're struggling. Remember that it's okay to ask for support when you need it.",
  "I hear the exhaustion in your words. Please know that rest and self-compassion are not weaknesses.",
  "Your feelings deserve to be acknowledged. You're doing the best you can with what you have right now.",
  "I understand that you're going through a tough time. Please be kind to yourself as you work through these feelings.",
  "Thank you for sharing. Your honesty takes strength, and you're taking an important step toward healing.",
  "I hear you, and I want you to know that your feelings won't last forever, even though they feel overwhelming now.",
  "What you're experiencing is valid. Remember that feeling sad doesn't define who you are.",
  "I'm sorry things feel so difficult right now. Please know that you deserve support and understanding.",
  "Your emotions are real and important. It's okay to take the time you need to process how you're feeling.",
  "I hear the struggle in your words. Please remember that you're worthy of compassion, especially from yourself.",
  "Thank you for being vulnerable. What you're feeling is part of being human, and you're not alone.",
  "I understand that things feel overwhelming. Remember to breathe and take things one moment at a time.",
  "Your feelings matter, and it's important that you're expressing them instead of bottling them up.",
  "I'm here for you. What you're experiencing is difficult, but you have the strength to get through this.",
  "I hear you, and I want you to know that it's okay to feel sad. Your emotions are valid.",
  "Thank you for sharing how you feel. Remember that seeking support is a sign of strength, not weakness.",
  "I understand that you're hurting. Please be patient with yourself as you navigate these difficult emotions.",
  "Your feelings are completely understandable. Remember that it's okay to not have all the answers right now.",
  "I hear the pain you're experiencing. Please know that you deserve kindness and understanding.",
  "What you're going through sounds really hard. Remember that you don't have to face this alone.",
  "I'm sorry you're feeling this way. Your emotions are valid, and it's okay to express them.",
  "I hear you, and I want you to know that feeling down doesn't make you a burden. You matter.",
  "Thank you for being honest about your feelings. That takes courage, and you should be proud of yourself.",
  "I understand that everything feels difficult right now. Please remember to show yourself compassion.",
  "Your feelings are important and deserve to be heard. You're taking a brave step by acknowledging them.",
  "I'm here with you. What you're feeling is valid, and you don't have to pretend to be okay.",
  "I hear the weight of what you're carrying. Please remember that it's okay to set down that burden sometimes.",
  "Thank you for trusting these feelings to words. You're stronger than you know, even in this moment.",
  "I understand that you're struggling. Remember that it's okay to take things slowly and be gentle with yourself.",
  "Your emotions are real and valid. Please know that feeling sad is a natural part of the human experience.",
  "I'm sorry things feel so heavy. Remember that you're not alone, and it's okay to reach out for support.",
  "I hear you, and I want you to know that your feelings won't define your future. This is just a moment in time.",
  "Thank you for sharing. Your honesty is a strength, and you're taking important steps toward healing."
];

// Additional context words to make entries more diverse
const contextWords = [
  ", and I don't know how to move forward",
  ". I'm trying to stay strong but it's hard",
  ". Nobody seems to understand what I'm going through",
  ". I just want to feel okay again",
  ", but I'm trying my best",
  ". I'm scared it will always be like this",
  ", and it's affecting everything in my life",
  ". I wish I could just make it stop",
  ", but I don't know where to turn",
  ". I'm afraid to reach out for help",
  ", and I'm exhausted from pretending",
  ". I miss feeling like myself",
  ", but I keep putting on a brave face",
  ". I don't want to burden anyone with this",
  ", and it's getting harder each day",
  ". I feel like I'm failing everyone",
  ", but nobody can see how much I'm hurting",
  ". I just need someone to understand",
  ", and I'm running out of energy",
  ". I can't remember the last time I felt happy"
];

// Generate combinations
function generateTrainingData(count) {
  const trainingData = [];
  
  for (let i = 0; i < count; i++) {
    // Select random entry and response
    const entryIndex = Math.floor(Math.random() * sadEntryTemplates.length);
    const responseIndex = Math.floor(Math.random() * empatheticResponses.length);
    
    let userEntry = sadEntryTemplates[entryIndex];
    
    // Randomly add context (60% of the time)
    if (Math.random() > 0.4 && contextWords.length > 0) {
      const contextIndex = Math.floor(Math.random() * contextWords.length);
      userEntry += contextWords[contextIndex];
    }
    
    const response = empatheticResponses[responseIndex];
    
    // Add variation to make entries more unique
    const variations = [
      '',
      '. It feels never-ending',
      '. I need support',
      '. Please help me understand this',
      '. I want to feel better'
    ];
    
    if (Math.random() > 0.7) {
      const varIndex = Math.floor(Math.random() * variations.length);
      userEntry += variations[varIndex];
    }
    
    trainingData.push({
      input: `Sad / Down: ${userEntry}`,
      output: response
    });
  }
  
  return trainingData;
}

// Convert to CSV format
function convertToCSV(data) {
  const header = 'input,output\n';
  const rows = data.map(item => {
    // Escape quotes and wrap in quotes
    const input = `"${item.input.replace(/"/g, '""')}"`;
    const output = `"${item.output.replace(/"/g, '""')}"`;
    return `${input},${output}`;
  });
  
  return header + rows.join('\n');
}

// Main execution
console.log('Generating 1000 empathetic Sad / Down journal training data rows...');

const trainingData = generateTrainingData(1000);
const csvContent = convertToCSV(trainingData);

// Save to file
const outputPath = path.join(__dirname, '..', 'data', 'sad_down_training_data.csv');
fs.writeFileSync(outputPath, csvContent, 'utf8');

console.log(`✓ Successfully generated ${trainingData.length} training data rows`);
console.log(`✓ Saved to: ${outputPath}`);
console.log(`\nFirst 3 examples:`);
for (let i = 0; i < 3; i++) {
  console.log(`\nExample ${i + 1}:`);
  console.log(`Input: ${trainingData[i].input}`);
  console.log(`Output: ${trainingData[i].output}`);
}
