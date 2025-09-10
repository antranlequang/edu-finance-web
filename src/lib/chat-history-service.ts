'use client';

import { Message } from '@/ai/flows/advisor-flow';

export interface ChatHistory {
  userId?: string;
  messages: Message[];
  lastUpdated: Date;
}

export class ChatHistoryService {
  private static readonly STORAGE_KEY = 'chatHistory';
  private static readonly MAX_MESSAGES = 50; // Limit chat history size

  // Save chat history for logged-in users to localStorage
  // In a real app, this would sync to a database
  static saveChatHistory(messages: Message[], userId?: string): void {
    try {
      const chatHistory: ChatHistory = {
        userId,
        messages: messages.slice(-this.MAX_MESSAGES), // Keep only recent messages
        lastUpdated: new Date(),
      };

      const storageKey = userId ? `${this.STORAGE_KEY}_${userId}` : this.STORAGE_KEY;
      localStorage.setItem(storageKey, JSON.stringify(chatHistory));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }

  // Load chat history for current user
  static loadChatHistory(userId?: string): Message[] {
    try {
      const storageKey = userId ? `${this.STORAGE_KEY}_${userId}` : this.STORAGE_KEY;
      const stored = localStorage.getItem(storageKey);
      
      if (!stored) return [];

      const chatHistory: ChatHistory = JSON.parse(stored);
      
      // If user is logged in but stored history is for different user, return empty
      if (userId && chatHistory.userId && chatHistory.userId !== userId) {
        return [];
      }

      // Check if history is not too old (keep for 7 days)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      if (new Date(chatHistory.lastUpdated) < oneWeekAgo) {
        this.clearChatHistory(userId);
        return [];
      }

      return chatHistory.messages || [];
    } catch (error) {
      console.error('Failed to load chat history:', error);
      return [];
    }
  }

  // Clear chat history
  static clearChatHistory(userId?: string): void {
    try {
      const storageKey = userId ? `${this.STORAGE_KEY}_${userId}` : this.STORAGE_KEY;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  }

  // Add a new message to history
  static addMessage(message: Message, userId?: string): Message[] {
    const currentHistory = this.loadChatHistory(userId);
    const newHistory = [...currentHistory, message];
    this.saveChatHistory(newHistory, userId);
    return newHistory;
  }

  // Update last message (useful for streaming responses)
  static updateLastMessage(content: string, userId?: string): Message[] {
    const currentHistory = this.loadChatHistory(userId);
    if (currentHistory.length > 0) {
      const updatedHistory = [...currentHistory];
      updatedHistory[updatedHistory.length - 1].content = content;
      this.saveChatHistory(updatedHistory, userId);
      return updatedHistory;
    }
    return currentHistory;
  }

  // Get chat summary for context (useful for new sessions)
  static getChatSummary(userId?: string): string {
    const history = this.loadChatHistory(userId);
    if (history.length === 0) return '';

    // Create a summary of recent topics discussed
    const recentMessages = history.slice(-6); // Last 6 messages
    const topics = new Set<string>();

    recentMessages.forEach(msg => {
      if (msg.role === 'user') {
        const content = msg.content.toLowerCase();
        if (content.includes('scholarship') || content.includes('học bổng')) topics.add('scholarships');
        if (content.includes('course') || content.includes('khóa học')) topics.add('courses');
        if (content.includes('job') || content.includes('việc làm')) topics.add('jobs');
        if (content.includes('career') || content.includes('nghề nghiệp')) topics.add('career');
      }
    });

    return topics.size > 0 
      ? `Recent conversation topics: ${Array.from(topics).join(', ')}`
      : '';
  }

  // Clean up old history entries (run periodically)
  static cleanupOldHistory(): void {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.STORAGE_KEY));
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      keys.forEach(key => {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const chatHistory: ChatHistory = JSON.parse(stored);
            if (new Date(chatHistory.lastUpdated) < oneWeekAgo) {
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          // If parsing fails, remove the corrupted entry
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to cleanup old chat history:', error);
    }
  }
}

// React hook for managing chat history
export function useChatHistory(userId?: string) {
  const loadHistory = () => ChatHistoryService.loadChatHistory(userId);
  const saveHistory = (messages: Message[]) => ChatHistoryService.saveChatHistory(messages, userId);
  const addMessage = (message: Message) => ChatHistoryService.addMessage(message, userId);
  const clearHistory = () => ChatHistoryService.clearChatHistory(userId);
  const getChatSummary = () => ChatHistoryService.getChatSummary(userId);

  return {
    loadHistory,
    saveHistory,
    addMessage,
    clearHistory,
    getChatSummary,
  };
}