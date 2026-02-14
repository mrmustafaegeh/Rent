import { NextResponse } from 'next/server';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary via stream
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'rental-cars', // Optional: organize uploads in a folder
          resource_type: 'auto',
        },
        (error: any, result: UploadApiResponse | undefined) => {
          if (error) reject(error);
          else resolve(result!);
        }
      ).end(buffer);
    });

    return NextResponse.json({ 
      success: true, 
      url: result.secure_url,
      public_id: result.public_id // Useful for future deletions/edits
    });

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    
    // Check for specific configuration errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('Invalid cloud_name')) {
      return NextResponse.json({ 
        error: 'Configuration Error: Invalid Cloudinary Cloud Name. Please check your .env.local file.', 
        details: errorMessage 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      error: 'Upload failed', 
      details: errorMessage 
    }, { status: 500 });
  }
}
