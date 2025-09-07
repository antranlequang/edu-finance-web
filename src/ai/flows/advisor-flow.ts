'use server';
/**
 * @fileOverview An AI advisor that can recommend scholarships, courses, and jobs.
 *
 * - chat - A function that handles the conversational chat process.
 * - Message - The type for a single chat message.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Mock data - in a real app, this would come from a database.
const allScholarships = [
  { name: "Future Leaders Grant", provider: "Tech Innovators Foundation", amount: 5000, minEduscore: 85, deadline: "2024-12-31" },
  { name: "Creative Minds Scholarship", provider: "Arts & Culture Council", amount: 3000, minEduscore: 75, deadline: "2024-11-30" },
  { name: "STEM Achievers Award", provider: "Science & Eng. Society", amount: 10000, minEduscore: 90, deadline: "2025-01-15" },
  { name: "Community First Scholarship", provider: "Local Goodwill Org", amount: 2000, minEduscore: 70, deadline: "2024-12-01" },
  { name: "Phoenix Scholars Program", provider: "Rise Up Foundation", amount: 7500, minEduscore: 80, deadline: "2025-02-01" },
  { name: "Global Citizen Grant", provider: "One World United", amount: 4000, minEduscore: 65, deadline: "2024-11-15" },
];

const allCourses = [
    { title: "Web Development Bootcamp", category: "Technology", price: "Paid", rating: 4.8 },
    { title: "Introduction to Business", category: "Business", price: "Free", rating: 4.5 },
    { title: "Graphic Design Masterclass", category: "Design", price: "Paid", rating: 4.9 },
    { title: "Data Science with Python", category: "Technology", price: "Paid", rating: 4.7 },
    { title: "The Science of Well-being", category: "Science", price: "Free", rating: 4.9 },
    { title: "Digital Marketing Essentials", category: "Business", price: "Paid", rating: 4.6 },
    { title: "UI/UX Design Fundamentals", category: "Design", price: "Free", rating: 4.7 },
    { title: "Quantum Physics Explained", category: "Science", price: "Paid", rating: 4.8 },
];

const allJobs = [
    { title: "Junior Web Developer Intern", company: "Innovatech Solutions", location: "Remote", type: "Internship", tags: ["React", "Node.js", "Web Dev"] },
    { title: "Marketing Assistant (Part-Time)", company: "Growth Wizards", location: "New York, NY", type: "Part-Time", tags: ["Social Media", "SEO", "Marketing"] },
    { title: "Data Analyst Intern", company: "DataDriven Inc.", location: "San Francisco, CA", type: "Internship", tags: ["SQL", "Python", "Tableau"] },
    { title: "Graphic Design Intern", company: "Creative Minds Agency", location: "Remote", type: "Internship", tags: ["Photoshop", "Illustrator", "UI/UX"] },
    { title: "Business Development Trainee", company: "Future Corp", location: "Chicago, IL", type: "Full-Time", tags: ["Sales", "CRM", "Business"] },
    { title: "Software Engineer Co-op", company: "CodeCrafters", location: "Boston, MA", type: "Co-op", tags: ["Java", "Spring", "Cloud"] },
];

const getScholarships = ai.defineTool(
  {
    name: 'getScholarships',
    description: 'Retrieves a list of available scholarships. Use this to help users find financial aid opportunities.',
    inputSchema: z.object({
        minEduscore: z.number().optional().describe("Filter by minimum Eduscore. Use the user's Eduscore if they have one."),
        maxAmount: z.number().optional().describe("Filter by maximum scholarship amount."),
    }),
    outputSchema: z.array(z.object({
        name: z.string(),
        provider: z.string(),
        amount: z.number(),
    })),
  },
  async ({minEduscore, maxAmount}) => {
    let scholarships = allScholarships;
    if (minEduscore) {
        scholarships = scholarships.filter(s => s.minEduscore <= minEduscore);
    }
    if (maxAmount) {
        scholarships = scholarships.filter(s => s.amount <= maxAmount);
    }
    return scholarships.map(({name, provider, amount}) => ({name, provider, amount}));
  }
);

const getCourses = ai.defineTool(
    {
        name: 'getCourses',
        description: 'Retrieves a list of available courses. Use this to recommend educational programs to users based on their interests.',
        inputSchema: z.object({
            category: z.enum(["Technology", "Business", "Design", "Science"]).optional().describe("Filter by category."),
            price: z.enum(["Free", "Paid"]).optional().describe("Filter by price.")
        }),
        outputSchema: z.array(z.object({
            title: z.string(),
            category: z.string(),
            price: z.string(),
        }))
    },
    async ({category, price}) => {
        let courses = allCourses;
        if (category) {
            courses = courses.filter(c => c.category === category);
        }
        if (price) {
            courses = courses.filter(c => c.price === price);
        }
        return courses.map(({title, category, price}) => ({title, category, price}));
    }
);

const getJobs = ai.defineTool(
    {
        name: 'getJobs',
        description: 'Retrieves a list of available job openings. Use this to help users find internships, part-time, or full-time positions.',
        inputSchema: z.object({
            type: z.enum(["Internship", "Part-Time", "Full-Time", "Co-op"]).optional().describe("Filter by job type."),
            location: z.string().optional().describe("Filter by location. 'Remote' is an option."),
        }),
        outputSchema: z.array(z.object({
            title: z.string(),
            company: z.string(),
            type: z.string(),
            location: z.string()
        }))
    },
    async ({type, location}) => {
        let jobs = allJobs;
        if (type) {
            jobs = jobs.filter(j => j.type === type);
        }
        if (location) {
            jobs = jobs.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
        }
        return jobs;
    }
);


const advisorPrompt = ai.definePrompt({
    name: 'advisorPrompt',
    inputSchema: z.object({
        history: z.array(MessageSchema),
        message: z.string(),
    }),
    system: `You are a helpful and friendly AI advisor for the Hyhan platform. Your goal is to provide personalized guidance to students on scholarships, courses, and job opportunities.

- Be conversational and encouraging.
- Use the available tools to find relevant information based on the user's query.
- If a user asks a general question, you can use the tools without specific filters to show them what's available. For example, if they ask "what jobs are there?", call getJobs with no parameters.
- When presenting information, format it clearly. Use markdown lists.
- If the user provides their Eduscore, use it to find matching scholarships.
- Keep your responses concise and to the point.`


,
    messages: (input) => [
        ...input.history,
        { role: 'user', content: input.message }
    ],
    tools: [getScholarships, getCourses, getJobs],
});


const MessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});
export type Message = z.infer<typeof MessageSchema>;

const ChatInputSchema = z.object({
    history: z.array(MessageSchema),
    prompt: z.string(),
    eduscore: z.number().optional()
});

export async function chat(input: z.infer<typeof ChatInputSchema>): Promise<string> {
    const history = [...input.history];
    if (input.eduscore) {
        history.unshift({
            role: 'user',
            content: `For your information, my Eduscore is ${input.eduscore}. Please use it when recommending scholarships.`
        });
    }

    const result = await ai.generate({
        prompt: advisorPrompt,
        input: {
            history: history,
            message: input.prompt
        },
        model: 'googleai/gemini-2.5-flash',
    });

    return result.text;
}
