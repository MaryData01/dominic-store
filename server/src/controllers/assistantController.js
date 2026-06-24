export const chatWithAssistant = async (req, res, next) => {
  try {
    console.log('Incoming Assistant Request Body:', JSON.stringify(req.body, null, 2));
    console.log('Is GROQ_API_KEY defined?:', !!process.env.GROQ_API_KEY);
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400);
      throw new Error('Messages array is required');
    }

    const systemPrompt = {
      role: 'system',
      content: `You are NEXUS, a gaming gear expert for Dominic Store, a Nigerian gaming peripherals shop. 
You help customers choose the right gear for their needs and budget. 
Be direct, knowledgeable, and enthusiastic about gaming. 
When recommending products, mention specific product categories available in the store 
(keyboards, mice, headsets, monitors, controllers, chairs, capture cards, lighting).
Keep responses concise — 2–4 short paragraphs max. Use ₦ for prices.
Do not recommend products from other stores.`
    };

    const payload = {
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: [systemPrompt, ...messages],
      stream: true,
    };

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const baseUrl = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData = errorText;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {}
      
      console.error('=========================================');
      console.error('Groq API Request Failed');
      console.error('HTTP Status:', response.status);
      console.error('Base URL:', baseUrl);
      console.error('Error Details:', errorData);
      console.error('=========================================');
      
      res.write(`data: [ERROR] AI Assistant unavailable\n\n`);
      return res.end();
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith('data: ')) {
          const dataStr = trimmed.slice(6);
          if (dataStr === '[DONE]') {
            continue;
          }

          try {
            const parsed = JSON.parse(dataStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              res.write('data: ' + content + '\n\n');
            }
          } catch (e) {
            // Ignore incomplete chunks
          }
        }
      }
    }

    if (buffer && buffer.trim().startsWith('data: ')) {
      const dataStr = buffer.trim().slice(6);
      if (dataStr !== '[DONE]') {
        try {
          const parsed = JSON.parse(dataStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            res.write('data: ' + content + '\n\n');
          }
        } catch (e) {}
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Assistant Catch Block Error Object:', error);
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Status:', error.response?.status);
    console.error('Error Data:', error.response?.data);
    res.write(`data: [ERROR] Internal Server Error\n\n`);
    res.end();
  }
};
