'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AITest() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testAPI = async () => {
    if (!message.trim()) {
      setError('Please enter a message to test');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history: [],
          prompt: message,
          eduscore: 85
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setResponse(data.response);
      } else {
        setError(`API Error: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      setError(`Network Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetEndpoint = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/ai/chat');
      const data = await res.json();
      setResponse(`GET Test: ${data.message || JSON.stringify(data)}`);
    } catch (err) {
      setError(`GET Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>AI API Test Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Test message (e.g., 'Tell me about scholarships')"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && testAPI()}
            />
            <Button onClick={testAPI} disabled={loading}>
              {loading ? 'Testing...' : 'Test POST'}
            </Button>
            <Button onClick={testGetEndpoint} disabled={loading} variant="outline">
              Test GET
            </Button>
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {response && (
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <strong>Response:</strong>
              <pre className="whitespace-pre-wrap mt-2 text-sm">{response}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}