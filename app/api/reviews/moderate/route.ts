import { NextRequest, NextResponse } from 'next/server';
import { ReviewModel } from '@/lib/mongodb/models/crm/review';

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');
    
    if (!id || !action) {
      return NextResponse.json(
        { error: 'ID отзыва и действие обязательны' },
        { status: 400 }
      );
    }
    
    let result;
    if (action === 'approve') {
      result = await ReviewModel.approve(id);
    } else if (action === 'reject') {
      result = await ReviewModel.reject(id);
    } else if (action === 'delete') {
      result = await ReviewModel.delete(id);
    } else {
      return NextResponse.json(
        { error: 'Действие должно быть "approve", "reject" или "delete"' },
        { status: 400 }
      );
    }
    
    if (result.matchedCount === 0 && result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Отзыв не найден' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: action === 'approve' ? 'Отзыв одобрен' : 
               action === 'reject' ? 'Отзыв отклонен' : 
               'Отзыв удален'
    });
    
  } catch (error) {
    console.error('Ошибка при модерации отзыва:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при модерации отзыва' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'new';
    
    if (!['new', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Неверный статус' },
        { status: 400 }
      );
    }
    
    const reviews = await ReviewModel.getByStatus(status as any);
    
    return NextResponse.json({ success: true, reviews });
    
  } catch (error) {
    console.error('Ошибка при получении отзывов для модерации:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при загрузке отзывов' },
      { status: 500 }
    );
  }
}