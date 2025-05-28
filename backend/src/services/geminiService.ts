import { GoogleGenerativeAI } from '@google/generative-ai';

interface ParsedTask {
  taskName: string;
  assignee: string;
  dueDate: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
}

export async function parseTasksFromTranscript(transcript: string): Promise<ParsedTask[]> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
      Parse the following meeting transcript and extract all tasks in JSON format:
      "${transcript}"
      
      For each task, extract:
      1. Task name (the main action/activity)
      2. Assignee (the person responsible)
      3. Due date and time (in ISO 8601 format, e.g., "2024-03-20T22:00:00Z" for "10:00 PM, Tomorrow")
      4. Priority (P1, P2, P3, or P4 - default to P3 if not specified)
      
      Return an array of tasks in JSON format without any markdown formatting or code blocks:
      [
        {
          "taskName": "string",
          "assignee": "string",
          "dueDate": "string (ISO 8601 format)",
          "priority": "P1|P2|P3|P4"
        }
      ]
      
      Example output for "Aman you take the landing page by 10pm tomorrow":
      [
        {
          "taskName": "Take the landing page",
          "assignee": "Aman",
          "dueDate": "2024-03-20T22:00:00Z",
          "priority": "P3"
        }
      ]
      
      Important: Convert all relative dates (today, tomorrow, next week) to actual ISO 8601 dates.
      For example:
      - "tonight" -> today's date at 20:00:00Z
      - "tomorrow" -> tomorrow's date at 09:00:00Z
      - "next week" -> next Monday at 09:00:00Z
      - "by 10pm tomorrow" -> tomorrow's date at 22:00:00Z
    `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    
    const response = result.response;
    const responseText = response.text();

    const cleanedResponse = responseText
      .replace(/```json\s*|\s*```/g, '')
      .replace(/^\s+|\s+$/g, '');

    try {
      const parsedResponse = JSON.parse(cleanedResponse);

      if (!Array.isArray(parsedResponse)) {
        throw new Error('Invalid response format from Gemini API');
      }

      return parsedResponse.map(task => ({
        taskName: task.taskName,
        assignee: task.assignee,
        dueDate: task.dueDate,
        priority: task.priority || 'P3',
      }));
    } catch (parseError) {
      console.error('Error parsing Gemini API response:', parseError);
      throw new Error('Failed to parse Gemini API response');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to process transcript with Gemini API');
  }
}
