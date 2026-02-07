export const RESPONSE_SCHEMA = {
  type: 'OBJECT' as const,
  properties: {
    content: { type: 'STRING' as const },
    hashtags: {
      type: 'ARRAY' as const,
      items: { type: 'STRING' as const },
    },
    rationale: { type: 'STRING' as const },
    charCount: { type: 'NUMBER' as const },
    analysis: {
      type: 'OBJECT' as const,
      properties: {
        score: { type: 'NUMBER' as const },
        currentToneDescription: { type: 'STRING' as const },
        feedback: { type: 'STRING' as const },
        suggestions: {
          type: 'ARRAY' as const,
          items: { type: 'STRING' as const },
        },
      },
      required: ['score', 'currentToneDescription', 'feedback', 'suggestions'],
    },
  },
  required: ['content', 'hashtags', 'rationale', 'charCount', 'analysis'],
};
