import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/utils/emailutil";
import { generateOTP } from "@/utils/utils";
import { BooleanFlag } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.params?.email);

    if (!email) {
      return NextResponse.json(
        { status: false, message: "Email is required", data: null },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        email,
        active: BooleanFlag.Yes,
      },
      include: {
        UserSubscription: { include: { Plan: true } },
      },
    });

    if (!user) {
      return NextResponse.json({
        status: false,
        message: "User not found",
        data: null,
      });
    }

    // Check album access for non-admin users
    const checkAlbumAccess = async () => {
      const linkedAlbum = await prisma.album.findFirst({
        where: {
          OR: [
            { createdById: user.id },
            { clientId: user.id },
            { viewers: { some: { id: user.id } } },
          ],
        },
        select: { id: true },
      });
      return !!linkedAlbum;
    };

    let message = "Login successful";

    if (user.userType === "Admin") {
      // Admin → always allow
      await sendOtpEmail({
        email: user.email!,
        name: user.name!,
        otp,
        companyName: "Pixsabook",
      });

      return NextResponse.json({ status: true, message, data: { currentUser: user, otp } });
    }

    // Editor / Viewer → check album access
    if (user.userType === "Editor" || user.userType === "Viewer") {
      const hasAccess = await checkAlbumAccess();

      await sendOtpEmail({
        email: user.email!,
        name: user.name!,
        otp,
        companyName: "Pixsabook",
      });

      message = hasAccess ? "Login successful" : "Album is not linked";

      return NextResponse.json({ status: true, message, data: { currentUser: user, otp } });
    }

    // Fallback
    return NextResponse.json({ status: false, message: "User not found", data: null });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: false, message: "Internal server error", data: null },
      { status: 500 }
    );
  }
}
