// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { name, email, birthday } = await request.json();

    // Validate input
    if (!name || !email || !birthday) {
      return NextResponse.json(
        { message: 'Name, email, and birthday are required' }, 
        { status: 400 }
      );
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        birthday: new Date(birthday),
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { message: 'Failed to create user' }, 
      { status: 500 }
    );
  }
}