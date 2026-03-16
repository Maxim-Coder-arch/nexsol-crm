import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;


/*
рабочие модели:

медленная - nvidia/nemotron-3-super-120b-a12b:free

дипсик медленный - deepseek/deepseek-v3.2

gemini тоже не такой быстрый - google/gemma-3n-e2b-it:free

более быстрая - arcee-ai/trinity-large-preview:free

*/


export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const key = process.env.OPEN_ROUTER_KEY;

    console.log('📨 Запрос к Open Router:', { message });

    if (!key) {
      console.error('❌ Ключ не найден');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'arcee-ai/trinity-large-preview:free',
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    console.log('📊 Статус ответа:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Ошибка Open Router:', response.status, errorText);
      return NextResponse.json(
        { error: `Open Router error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Ответ от Open Router:', JSON.stringify(data, null, 2));

    // Проверяем разные варианты получения ответа
    const reply = data.choices?.[0]?.message?.content || 
                  data.choices?.[0]?.text || 
                  data.response || 
                  'Нет ответа';

    return NextResponse.json({ reply, raw: data });
    
  } catch (error) {
    console.error('💥 Ошибка:', error);
    return NextResponse.json(
      { error: 'Failed to process chat', details: String(error) },
      { status: 500 }
    );
  }
}