import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BooleanFlag } from "@prisma/client";
import { uploadImageToImageKit } from "@/utils/uploadImageToImageKit";
import { v4 as uuidv4 } from "uuid";
import imagekit from "@/utils/imagekitClient";

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
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json({ status: false, message: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();

    const upload = await imagekit.upload({
      file: Buffer.from(arrayBuffer), // Must be buffer
      fileName: uuidv4() + "-" + file.name,
    });

    return NextResponse.json({
      status: true,
      url: upload.url,
      thumbnailUrl: upload.thumbnailUrl,
      fileType: upload.fileType,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ status: false, message: "Upload failed" }, { status: 500 });
  }
}