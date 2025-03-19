import { NextResponse } from 'next/server';

const INSTAGRAM_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID;

export async function GET() {
  if (!INSTAGRAM_TOKEN || !INSTAGRAM_USER_ID) {
    console.warn('Instagram credentials not configured');
    return NextResponse.json([], { status: 200 });
  }

  try {
    const response = await fetch(
      `https://graph.instagram.com/v12.0/${INSTAGRAM_USER_ID}/media?fields=id,caption,media_url,permalink&access_token=${INSTAGRAM_TOKEN}`
    );

    if (!response.ok) {
      throw new Error(`Instagram API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || !data.data) {
      console.warn('Invalid response format from Instagram API');
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data.data);
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return NextResponse.json([], { status: 200 });
  }
} 