import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Dish } from '@/app/foodtree/types';

const DATA_FILE = path.join(process.cwd(), 'public/foodtree/dishes/data.json');

async function readData(): Promise<Dish[]> {
  try {
    const fileContents = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function writeData(data: Dish[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET() {
  try {
    const dishes = await readData();
    return NextResponse.json(dishes);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dishes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newDish: Omit<Dish, 'id' | 'createdAt' | 'updatedAt'> = await request.json();
    const dishes = await readData();
    
    const dish: Dish = {
      ...newDish,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    dishes.push(dish);
    await writeData(dishes);
    
    return NextResponse.json(dish, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create dish' },
      { status: 500 }
    );
  }
}
