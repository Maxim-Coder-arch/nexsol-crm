import { NextResponse } from 'next/server';
import { TemplateModel } from '@/lib/mongodb/models/crm/template';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let templates;
    if (category && category !== 'all') {
      templates = await TemplateModel.getByCategory(category);
    } else {
      templates = await TemplateModel.getAll();
    }
    
    return NextResponse.json(templates);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { author, title, content, category } = await request.json();
    
    // Валидация
    if (!author || !title || !content || !category) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Проверяем, что категория допустимая
    const validCategories = ['attraction', 'answers', 'ads', 'essential'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }
    
    const template = await TemplateModel.create({
      author,
      title,
      content,
      category
    });
    
    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error('Failed to create template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}