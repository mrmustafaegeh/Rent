import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Company from '@/models/Company';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const { 
        firstName, lastName, email, phone, password, // User details
        companyName, companyEmail, companyPhone, companyAddress, companyDescription // Company details
    } = body;

    // 1. Validation
    if (!email || !password || !firstName || !lastName || !companyName) {
        return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 });
    }

    // 2. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // 3. Check if company exists
    const companyExists = await Company.findOne({ name: companyName });
    if (companyExists) {
        return NextResponse.json({ error: 'Company name already registered' }, { status: 400 });
    }

    // 4. Create User
    const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        role: 'company_owner',
        isActive: true // User can login, but company might be pending
    });

    // 5. Create Company
    const company = await Company.create({
        name: companyName,
        email: companyEmail || email,
        phone: companyPhone || phone,
        address: { city: companyAddress }, // Simplified for now
        description: companyDescription,
        owner: user._id,
        isActive: false // Pending approval
    });

    // 6. Link Company to User
    user.companyId = company._id;
    await user.save();

    // 7. Notify Admin
    // In a real app, this would be an actual email call
    console.log(`[EMAIL to ADMIN] New Partner Registration: ${companyName} by ${firstName} ${lastName} (${email}). Needs approval.`);

    // 7. Return success
    return NextResponse.json({ 
        success: true, 
        message: 'Partner account created. Please wait for admin approval.',
        data: {
            user: { id: user._id, email: user.email, role: user.role },
            company: { id: company._id, name: company.name, status: 'pending' }
        }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Partner register error:', error);
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
