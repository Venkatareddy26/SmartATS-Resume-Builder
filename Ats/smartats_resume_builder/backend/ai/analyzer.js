const OpenAI = require('openai');

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// Analyze resume against job description
async function analyzeResume(resumeContent, jobDescription) {
  if (!openai) {
    return mockAnalysis(resumeContent, jobDescription);
  }

  try {
    const prompt = `Analyze this resume against the job description and provide:
1. ATS match score (0-100)
2. Missing keywords
3. Strengths
4. Areas for improvement

Resume:
${JSON.stringify(resumeContent)}

Job Description:
${jobDescription}

Respond in JSON format with: { score, missingKeywords: [], strengths: [], improvements: [] }`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return mockAnalysis(resumeContent, jobDescription);
  }
}

// Generate improvement suggestions
async function generateSuggestions(resumeContent, jobDescription) {
  if (!openai) {
    return mockSuggestions();
  }

  try {
    const prompt = `Generate 5 specific suggestions to improve this resume for the job description.
For each suggestion provide: section, type, original text, suggested text, and reason.

Resume: ${JSON.stringify(resumeContent)}
Job Description: ${jobDescription}

Respond in JSON array format.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 1500
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return mockSuggestions();
  }
}

// Optimize specific content
async function optimizeContent(text, context = '') {
  if (!openai) {
    return `${text} (optimized with stronger action verbs and quantifiable metrics)`;
  }

  try {
    const prompt = `Optimize this resume text to be more impactful and ATS-friendly. ${context}

Original: ${text}

Provide only the optimized version.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 200
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API error:', error);
    return `${text} (optimized)`;
  }
}

// Mock functions for when OpenAI API is not configured
function mockAnalysis(resumeContent, jobDescription) {
  const keywords = extractKeywords(jobDescription);
  const resumeText = JSON.stringify(resumeContent).toLowerCase();
  
  const foundKeywords = keywords.filter(k => resumeText.includes(k.toLowerCase()));
  const missingKeywords = keywords.filter(k => !resumeText.includes(k.toLowerCase()));
  
  const score = Math.round((foundKeywords.length / keywords.length) * 100);

  return {
    score,
    missingKeywords: missingKeywords.slice(0, 5),
    strengths: [
      'Clear professional experience section',
      'Quantifiable achievements included',
      'Relevant technical skills listed'
    ],
    improvements: [
      'Add more industry-specific keywords',
      'Include metrics in all bullet points',
      'Tailor summary to job description'
    ]
  };
}

function mockSuggestions() {
  return [
    {
      section: 'experience',
      type: 'keyword',
      original: 'Developed web applications',
      suggested: 'Engineered scalable web applications using React and Node.js',
      reason: 'Added specific technologies and stronger action verb'
    },
    {
      section: 'experience',
      type: 'quantify',
      original: 'Improved system performance',
      suggested: 'Improved system performance by 40% through database optimization',
      reason: 'Added quantifiable metric and specific method'
    },
    {
      section: 'skills',
      type: 'keyword',
      original: null,
      suggested: 'Add: Kubernetes, Docker, CI/CD',
      reason: 'Job description mentions these technologies multiple times'
    }
  ];
}

function extractKeywords(text) {
  const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'a', 'an'];
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const frequency = {};
  
  words.forEach(word => {
    if (!commonWords.includes(word)) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

module.exports = {
  analyzeResume,
  generateSuggestions,
  optimizeContent
};
