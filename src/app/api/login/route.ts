import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {

  try {

    await connectDB();

    const body = await req.json();

    const { email, password } = body;

    // Find User
    const existingUser = await User.findOne({ email });

    // User not found
    if (!existingUser) {

      return NextResponse.json({
        success: false,
        message: "User Not Found",
      });

    }

    // Compare Password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    // Wrong password
    if (!isPasswordCorrect) {

      return NextResponse.json({
        success: false,
        message: "Incorrect Password",
      });

    }

    // Login Success
    const token = jwt.sign(
  {
    userId: existingUser._id,
    email: existingUser.email,
  },
  process.env.JWT_SECRET!,
  { expiresIn: "7d" }
);

const response = NextResponse.json({
  success: true,
  message: "Login Successful",
  user: existingUser,
});

response.cookies.set("token", token, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7,
});

return response;

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Login Failed",
      error,
    });

  }
}