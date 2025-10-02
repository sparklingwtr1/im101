# Training Data

This directory contains training data for empathetic journaling assistants.

## Files

### sad_down_training_data.csv

A CSV file containing 1000 training pairs for an empathetic journaling assistant focused on the "Sad / Down" emotion.

**Format:**
- Column 1 (input): User journal entries prefixed with "Sad / Down: "
- Column 2 (output): Empathetic responses to the journal entries

**Usage:**
This data can be used to train or fine-tune AI models to provide compassionate, supportive responses to users experiencing sadness or feeling down.

**Generation:**
The data was generated using the script `scripts/generate_sad_training_data.js`, which combines various templates of sad/down journal entries with empathetic response templates to create diverse training examples.

**Example:**
```csv
"Sad / Down: I feel so alone today","I hear you, and your feelings are completely valid. It's okay to feel this way, and you're not alone in this experience."
```

**Statistics:**
- Total rows: 1000
- Format: CSV with header
- Character encoding: UTF-8
