# Cloudinary Configuration Guide

It seems like your Cloudinary Cloud Name is configured incorrectly, causing image uploads to fail.

The error logs show: `Invalid cloud_name Rent`

This means "Rent" is not your actual Cloud Name.

## How to find your Cloud Name

1.  Log in to your [Cloudinary Dashboard](https://console.cloudinary.com/).
2.  Look at the "Product Environment Credentials" section on the main dashboard page.
3.  You will see:
    *   **Cloud Name**: (e.g., `dxyxyz123`, `my-app-name`)
    *   **API Key**: (e.g., `123456789012345`)
    *   **API Secret**: (e.g., `abcde_FGHIJkz...`)

## How to Fix It

1.  Open the file `.env.local` in your project root.
2.  Find the lines starting with `CLOUDINARY_`.
3.  Replace the values with the correct ones from your dashboard.

Example of what it SHOULD look like:

```env
CLOUDINARY_CLOUD_NAME=dxy123example         <-- Copy this from your dashboard (usually lowercase)
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_secret_key_here
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxy123example
```

**After saving the file, you MUST restart your development server for changes to take effect.**

```bash
npm run dev
```
