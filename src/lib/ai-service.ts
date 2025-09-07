// Direct Google AI integration without Genkit dependencies
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface ChatRequest {
  history: ChatMessage[];
  prompt: string;
  eduscore?: number;
}

// Mock data for AI responses
const scholarships = [
  { name: "Future Leaders Grant", provider: "Tech Innovators Foundation", amount: 5000, minEduscore: 85 },
  { name: "Creative Minds Scholarship", provider: "Arts & Culture Council", amount: 3000, minEduscore: 75 },
  { name: "STEM Achievers Award", provider: "Science & Eng. Society", amount: 10000, minEduscore: 90 },
  { name: "Community First Scholarship", provider: "Local Goodwill Org", amount: 2000, minEduscore: 70 },
  { name: "Phoenix Scholars Program", provider: "Rise Up Foundation", amount: 7500, minEduscore: 80 },
];

const courses = [
  { title: "Web Development Bootcamp", category: "Technology", price: "Paid", rating: 4.8 },
  { title: "Introduction to Business", category: "Business", price: "Free", rating: 4.5 },
  { title: "Graphic Design Masterclass", category: "Design", price: "Paid", rating: 4.9 },
  { title: "Data Science with Python", category: "Technology", price: "Paid", rating: 4.7 },
  { title: "UI/UX Design Fundamentals", category: "Design", price: "Free", rating: 4.7 },
];

const jobs = [
  { title: "Junior Web Developer Intern", company: "Innovatech Solutions", location: "Remote", type: "Internship" },
  { title: "Marketing Assistant (Part-Time)", company: "Growth Wizards", location: "New York, NY", type: "Part-Time" },
  { title: "Data Analyst Intern", company: "DataDriven Inc.", location: "San Francisco, CA", type: "Internship" },
  { title: "Graphic Design Intern", company: "Creative Minds Agency", location: "Remote", type: "Internship" },
];

async function callGoogleAI(messages: any[], apiKey: string): Promise<string> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages.map(msg => ({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        })),
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Google AI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I could not generate a response.';
  } catch (error) {
    console.error('Google AI API Error:', error);
    throw error;
  }
}

function generateIntelligentResponse(prompt: string, eduscore?: number): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('scholarship') || lowerPrompt.includes('funding') || lowerPrompt.includes('grant')) {
    const eligibleScholarships = eduscore 
      ? scholarships.filter(s => s.minEduscore <= eduscore)
      : scholarships.slice(0, 3);
    
    let response = `Based on ${eduscore ? `your EduScore of ${eduscore}` : 'your profile'}, here are some great scholarship opportunities:\n\n`;
    
    eligibleScholarships.forEach((scholarship, index) => {
      response += `${index + 1}. **${scholarship.name}**\n`;
      response += `   • Provider: ${scholarship.provider}\n`;
      response += `   • Amount: $${scholarship.amount.toLocaleString()}\n`;
      response += `   • Min EduScore: ${scholarship.minEduscore}\n\n`;
    });
    
    response += "Would you like more details about any of these scholarships or help with applications?";
    return response;
  }
  
  if (lowerPrompt.includes('course') || lowerPrompt.includes('learn') || lowerPrompt.includes('study')) {
    let response = "Here are some excellent courses that might interest you:\n\n";
    
    courses.slice(0, 4).forEach((course, index) => {
      response += `${index + 1}. **${course.title}**\n`;
      response += `   • Category: ${course.category}\n`;
      response += `   • Price: ${course.price}\n`;
      response += `   • Rating: ${course.rating}⭐\n\n`;
    });
    
    response += "These courses can help boost your EduScore and career prospects!";
    return response;
  }
  
  if (lowerPrompt.includes('job') || lowerPrompt.includes('intern') || lowerPrompt.includes('career')) {
    let response = "Here are some great job and internship opportunities:\n\n";
    
    jobs.forEach((job, index) => {
      response += `${index + 1}. **${job.title}**\n`;
      response += `   • Company: ${job.company}\n`;
      response += `   • Location: ${job.location}\n`;
      response += `   • Type: ${job.type}\n\n`;
    });
    
    response += "Would you like tips on how to apply or prepare for interviews?";
    return response;
  }
  
  if (lowerPrompt.includes('eduscore') || lowerPrompt.includes('score') || lowerPrompt.includes('improve')) {
    return `Your current EduScore is ${eduscore || 'not yet calculated'}. Here are ways to improve it:

📚 **Academic Excellence**
• Upload transcripts and certificates
• Complete relevant courses and certifications
• Maintain good grades

🔍 **Skills Development**  
• Add verified skills to your profile
• Get endorsements from peers and mentors
• Complete skill assessments

🌟 **Extracurricular Activities**
• Participate in volunteer work
• Join professional organizations
• Lead community projects

💼 **Professional Experience**
• Document internships and work experience
• Get recommendation letters
• Build a strong portfolio

Each verified element increases your EduScore and scholarship eligibility!`;
  }
  
  // Default helpful response
  return `Hello! I'm your AI advisor for education and career guidance. I can help you with:

🎓 **Scholarships** - Find funding opportunities matching your profile
📚 **Courses** - Discover learning opportunities to boost your skills  
💼 **Jobs & Internships** - Explore career opportunities
📊 **EduScore** - Tips to improve your academic scoring

What would you like to explore today? Just ask me about any of these topics!`;
}

export async function processAIChat(request: ChatRequest): Promise<string> {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;
  
  // Add system message with context
  const systemMessage = {
    role: 'user',
    content: `You are a helpful AI advisor for the HYHAN education platform. Help students with scholarships, courses, and career guidance. Be conversational and encouraging. ${request.eduscore ? `The user's EduScore is ${request.eduscore}.` : ''}`
  };
  
  const messages = [systemMessage, ...request.history, { role: 'user', content: request.prompt }];
  
  // Try Google AI API first
  if (apiKey && apiKey !== 'your-google-genai-api-key') {
    try {
      const aiResponse = await callGoogleAI(messages, apiKey);
      return aiResponse;
    } catch (error) {
      console.log('Google AI API failed, using intelligent fallback');
    }
  }
  
  // Fallback to intelligent mock responses
  return generateIntelligentResponse(request.prompt, request.eduscore);
}