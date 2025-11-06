import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BooleanFlag } from "@prisma/client";
import { uploadImageToImageKit } from "@/utils/uploadImageToImageKit";
import { v4 as uuidv4 } from "uuid";

// GET /api/master/getSubscriptionPlans
export async function GET(req: NextRequest) {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { active: BooleanFlag.Yes },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: false, message: "Failed to fetch subscription plans" },
      { status: 500 }
    );
  }
}

// POST /api/master/uploadImageToImageKit
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { status: false, message: "Content-Type must be multipart/form-data" },
        { status: 400 }
      );
    }

    // Parse multipart form
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ status: false, message: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResponse = await uploadImageToImageKit(buffer, uuidv4() + file.name);

    return NextResponse.json({
      status: true,
      fileType: uploadResponse.fileType,
      url: uploadResponse.url,
      thumbnailUrl: uploadResponse.thumbnailUrl,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: false, message: "File upload error" },
      { status: 500 }
    );
  }
}
