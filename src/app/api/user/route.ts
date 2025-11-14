import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BooleanFlag, Role } from "@prisma/client";
import { sendSubscriptionEmail } from "@/utils/emailutil";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { status: false, message: "Missing id" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { UserSubscription: { include: { Plan: true } } },
    });

    if (!user) {
      return NextResponse.json(
        { status: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action;

    if (!action) {
      return NextResponse.json(
        { status: false, message: "Missing action" },
        { status: 400 },
      );
    }

    const now = new Date();

    switch (action) {
      case "fetchUserDropdownForSearch": {
        const searchStr = body.partialString?.trim()?.toLowerCase();
        if (!searchStr) {
          return NextResponse.json({
            status: false,
            message: "Missing partialString",
          });
        }

        const users = await prisma.user.findMany({
          where: {
            email: { contains: searchStr },
            OR: [{ userType: Role.Admin }, { userType: Role.Editor }],
          },
          include: { UserSubscription: { include: { Plan: true } } },
          take: 5,
          orderBy: { name: "asc" },
        });

        return NextResponse.json({ status: true, data: users });
      }

      case "updateUserByField": {
        console.log(body);

        
        const userData = body;
        if (!userData?.id || !userData?.fieldname) {
          return NextResponse.json({
            status: false,
            message: "Missing User Data",
          });
        }

        const updatedUser = await prisma.user.update({
          where: { id: Number(userData.id) },
          data: {
            [userData.fieldname]: userData.fieldValue,
            updatedBy: userData.currentUserId,
            updatedAt: now,
          },
        });

        return NextResponse.json({
          status: true,
          message: "Updated Successfully",
          data: { updatedUser },
        });
      }

      case "addUpdateEditor": {
        const userData = body;
        if (!userData?.selectedPlan) {
          return NextResponse.json({
            status: false,
            message: "Missing selectedPlan",
          });
        }

        const plan = await prisma.subscriptionPlan.findFirst({
          where: { id: Number(userData.selectedPlan) },
        });

        if (!plan)
          return NextResponse.json({
            status: false,
            message: "Invalid Plan Selected",
          });

        if (userData?.id) {
          // Update existing user
          const existingUser = await prisma.user.findUnique({
            where: { id: userData.id },
            include: { UserSubscription: true },
          });

          if (existingUser) {
            const existingSub = existingUser.UserSubscription?.[0];

            if (existingSub) {
              const baseDate =
                existingSub.expiresOn && existingSub.expiresOn > now
                  ? existingSub.expiresOn
                  : now;

              const subscription = await prisma.userSubscription.update({
                where: { id: existingSub.id },
                data: {
                  planId: Number(userData.selectedPlan),
                  creditsLeft: existingSub.creditsLeft + plan.albumsCredit,
                  expiresOn: new Date(
                    baseDate.getTime() + plan.validityDays * 86400000,
                  ),
                },
              });

              //Send email
              await sendSubscriptionEmail({
                userEmail: existingUser.email!,
                planName: plan.name,
                credits: existingSub.creditsLeft + plan.albumsCredit,
                expiry: new Date(
                  baseDate.getTime() + plan.validityDays * 86400000,
                ).toDateString(),
              });
            } else {
              await prisma.userSubscription.create({
                data: {
                  userId: existingUser.id,
                  planId: Number(userData.selectedPlan),
                  creditsLeft: plan.albumsCredit,
                  startDate: now,
                  expiresOn: new Date(
                    now.getTime() + plan.validityDays * 86400000,
                  ),
                },
              });

              //Send email
              await sendSubscriptionEmail({
                userEmail: existingUser.email!,
                planName: plan.name,
                credits: plan.albumsCredit,
                expiry: new Date(
                  now.getTime() + plan.validityDays * 86400000,
                ).toDateString(),
              });
            }

            return NextResponse.json({
              status: true,
              message: "Subscription Updated Successfully",
              data: { updatedUser: existingUser },
            });
          }
        }

        // Create new editor
        if (!userData?.form?.email) {
          return NextResponse.json({
            status: false,
            message: "Missing Creator Email",
          });
        }

        const createdUser = await prisma.user.create({
          data: {
            email: userData.form.email,
            name: userData.form.name,
            mobile: userData.phone,
            active: BooleanFlag.Yes,
            createdBy: userData.currentUserId,
            createdAt: now,
            updatedBy: userData.currentUserId,
            updatedAt: now,
            userType: "Editor",
          },
        });

        await prisma.userSubscription.create({
          data: {
            userId: createdUser.id,
            planId: Number(userData.selectedPlan),
            creditsLeft: plan.albumsCredit,
            startDate: now,
            expiresOn: new Date(now.getTime() + plan.validityDays * 86400000),
          },
        });

        //Send email
        await sendSubscriptionEmail({
          userEmail: createdUser.email!,
          planName: plan.name,
          credits: plan.albumsCredit,
          expiry: new Date(
            now.getTime() + plan.validityDays * 86400000,
          ).toDateString(),
        });
        return NextResponse.json({
          status: true,
          message: "Editor Created Successfully",
          data: { updatedUser: createdUser },
        });
      }

      case "fetchUserById": {
        const { id } = body;
        try {
          if (!id) {
            return NextResponse.json(
              { status: false, message: "Missing user id" },
              { status: 400 },
            );
          }

          const user = await prisma.user.findUnique({
            where: { id: Number(id), active: BooleanFlag.Yes },
            include: { UserSubscription: { include: { Plan: true } } },
          });

          if (!user) {
            return NextResponse.json(
              { status: false, message: "User not found" },
              { status: 404 },
            );
          }

          return NextResponse.json({ status: true, data: user });
        } catch (error) {
          console.error(error);
          return NextResponse.json(
            { status: false, message: "Internal server error" },
            { status: 500 },
          );
        }
      }

      default:
        return NextResponse.json(
          { status: false, message: "Unknown action" },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
