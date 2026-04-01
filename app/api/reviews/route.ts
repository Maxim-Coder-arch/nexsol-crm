import { NextRequest, NextResponse } from 'next/server';
import { ReviewModel } from '@/lib/mongodb/models/crm/review';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, role, text, rating } = body;
    
    if (!name || !role || !text || !rating) {
      return NextResponse.json(
        { error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      );
    }
    
    if (name.length < 2 || name.length > 50) {
      return NextResponse.json(
        { error: 'Имя должно содержать от 2 до 50 символов' },
        { status: 400 }
      );
    }
    
    if (role.length > 100) {
      return NextResponse.json(
        { error: 'Должность не должна превышать 100 символов' },
        { status: 400 }
      );
    }
    
    if (text.length < 10 || text.length > 1000) {
      return NextResponse.json(
        { error: 'Текст отзыва должен содержать от 10 до 1000 символов' },
        { status: 400 }
      );
    }
    
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Рейтинг должен быть от 1 до 5' },
        { status: 400 }
      );
    }
    
    const newReview = await ReviewModel.create({
      name: name.trim(),
      role: role.trim(),
      text: text.trim(),
      rating: Number(rating)
    });
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Спасибо за отзыв! Он будет опубликован после модерации.',
        review: newReview 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Ошибка при создании отзыва:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при отправке отзыва' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let reviews;
    if (status && ['new', 'approved', 'rejected'].includes(status)) {
      reviews = await ReviewModel.getByStatus(status as any);
    } else {
      reviews = await ReviewModel.getAll(true);
    }
    
    return NextResponse.json({ success: true, reviews });
    
  } catch (error) {
    console.error('Ошибка при получении отзывов:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при загрузке отзывов' },
      { status: 500 }
    );
  }
}