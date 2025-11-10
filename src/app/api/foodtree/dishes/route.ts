// This is a dynamic route that will be replaced during build time for static export

// In development or server-side rendering, use the real handler
if (process.env.NEXT_PHASE !== 'phase-export') {
  const { NextResponse } = require('next/server');
  const { promises: fs } = require('fs');
  const path = require('path');
  const { v4: uuidv4 } = require('uuid');
  
  // Define the Dish type locally since we can't import it
  interface Dish {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: any; // For any additional properties
  }

  const DATA_FILE = path.join(process.cwd(), 'public/foodtree/dishes/data.json');

  async function readData() {
    try {
      const fileContents = await fs.readFile(DATA_FILE, 'utf8');
      return JSON.parse(fileContents);
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw error;
    }
  }

  async function writeData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  }

  async function handleGet() {
    try {
      const dishes = await readData();
      return NextResponse.json(dishes);
    } catch (error) {
      console.error('Error fetching dishes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch dishes' },
        { status: 500 }
      );
    }
  }

  async function handlePost(request) {
    try {
      const newDish = await request.json();
      const dishes = await readData();
      
      const dish = {
        ...newDish,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      dishes.push(dish);
      await writeData(dishes);
      
      return NextResponse.json(dish, { status: 201 });
    } catch (error) {
      console.error('Error creating dish:', error);
      return NextResponse.json(
        { error: 'Failed to create dish' },
        { status: 500 }
      );
    }
  }

  module.exports = { 
    GET: handleGet,
    POST: handlePost,
    dynamic: 'force-dynamic',
    revalidate: 0
  };
} else {
  // In static export, use the static version
  const { NextResponse } = require('next/server');
  
  const staticGet = () => {
    return NextResponse.json([], {
      headers: { 'Content-Type': 'application/json' }
    });
  };
  
  const staticPost = () => {
    return new NextResponse(
      JSON.stringify({ error: 'Method not allowed in static export' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  };
  
  module.exports = { 
    GET: staticGet,
    POST: staticPost,
    dynamic: 'auto',
    revalidate: 0
  };
}
