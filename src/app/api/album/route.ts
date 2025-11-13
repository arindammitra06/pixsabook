import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BooleanFlag } from "@prisma/client";
import { sendPublishEmail } from "@/utils/emailutil";
import { transformValueTypes } from "framer-motion";

type AlbumData = {
  id?: number;
  albumName?: string;
  albumDesc?: string;
  coverUrl?: string;
  backUrl?: string;
  photoUrls?: string[];
  creatorEmail?: string;
  clientEmail?: string;
  inviteeList?: string[];
  fieldname?: string;
  fieldValue?: any;
  albumId?: number;
  currentUserId?: number;
  email?: string;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const method = searchParams.get("method");

  // --- getAlbumById ---
  if (method === "getAlbumById") {
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const album = await prisma.album.findFirst({
      where: { id: Number(id), active: BooleanFlag.Yes },
      include: { createdBy: true, client: true, viewers: true },
    });

    return NextResponse.json(album);
  }

  // --- getAlbumsByUserId ---
  if (method === "getAlbumsByUserId") {
    const userId = searchParams.get("userId");
    const pageType = searchParams.get("pageType");

    if (!userId || !pageType)
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );

    const uid = Number(userId);

    if (pageType === "work") {
      const albums = await prisma.album.findMany({
        where: { createdById: uid },
        include: { createdBy: true, client: true, viewers: true },
      });

      return NextResponse.json(
        albums.map((a) => ({
          ...a,
          likesByEmail: Array.isArray(a.likesByEmail) ? a.likesByEmail : [],
        })),
      );
    } else {
      const albums = await prisma.album.findMany({
        where: {
          active: BooleanFlag.Yes,
          OR: [
            { createdById: uid },
            { clientId: uid },
            { viewers: { some: { id: uid } } },
          ],
        },
        include: { createdBy: true, client: true, viewers: true },
      });

      return NextResponse.json(
        albums.map((a) => ({
          ...a,
          likesByEmail: Array.isArray(a.likesByEmail) ? a.likesByEmail : [],
        })),
      );
    }
  }

  return NextResponse.json({ error: "Unknown method" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as any;
  const method = body.method;
  console.log(body);
  if (!method)
    return NextResponse.json({ error: "Missing method" }, { status: 400 });

  const dateTime = new Date();

  // --- createAlbum ---
  if (method === "createAlbum") {
    console.log(body);
    if (!body)
      return NextResponse.json({
        status: false,
        message: "Missing Album Data",
      });

    let createrId = 0,
      clientId = 0;
    let createrObj: any, clientObj: any;
    const viewerIds: any[] = [];

    if (body.form !== null && body.form !== undefined) {
      const creatorResult = await getUserIdByEmail(body.form.creatorEmail!);
      if (creatorResult) {
        createrId = creatorResult.id;
        createrObj = creatorResult.object;
      }
      const clientResult = await getUserIdByEmail(body.form.clientEmail!);
      if (clientResult) {
        clientId = clientResult.id;
        clientObj = clientResult.object;
      }

      if (body.form.inviteeList?.length) {
        for (const viewerEmail of body.form.inviteeList) {
          const viewer = await getUserIdByEmail(viewerEmail);
          if (viewer) viewerIds.push(viewer.object);
        }
      }

      if (Number(body.form.id) > 0) {
        await prisma.album.update({
          where: { id: body.form.id },
          data: {
            albumName: body.form.albumName,
            albumDesc: body.form.greetingMessage,
            coverImage: body.coverUrl,
            backImage: body.backUrl,
            imageUrls: body.photoUrls,
            clientId,
            viewers:
              viewerIds.length > 0
                ? { connect: viewerIds.map((v) => ({ id: v.id })) }
                : undefined,
            updatedBy: createrId,
            updatedAt: dateTime,
          },
        });

        return NextResponse.json({
          status: true,
          message: "Album Updated Successfully",
        });
      } else {
        await prisma.album.create({
          data: {
            albumName: body.form.albumName,
            albumDesc: body.form.greetingMessage,
            active: BooleanFlag.Yes,
            coverImage: body.coverUrl,
            backImage: body.backUrl,
            imageUrls: body.photoUrls,
            createdBy: { connect: { id: createrId } },
            client: { connect: { id: clientId } },
            viewers:
              viewerIds.length > 0
                ? { connect: viewerIds.map((u) => ({ id: u.id })) }
                : undefined,
            createdAt: dateTime,
            updatedAt: dateTime,
            updatedBy: createrId,
          },
        });
      }
    } else {
      return NextResponse.json({
        status: false,
        message: "Missing Album Data",
      });
    }

    return NextResponse.json({
      status: true,
      message: "Album Created Successfully",
    });
  }

  // --- updateAlbumByField ---
  if (method === "updateAlbumByField") {
    if (!body || !body.albumId)
      return NextResponse.json({
        status: false,
        message: "Missing Album Data",
      });

    const albumId = body.albumId;

    // publishing album
    if (body.fieldname === "isPublished" && body.fieldValue === "Yes") {
      const album = await prisma.album.findFirst({
        where: { id: albumId },
        include: {
          client: true,
          viewers: true,
          createdBy: { include: { UserSubscription: true } },
        },
      });

      if (!album)
        return NextResponse.json({ status: false, message: "Album not found" });

      const subscription = album.createdBy.UserSubscription[0];
      if (!subscription)
        return NextResponse.json({
          status: false,
          message: "No active subscription found",
        });

      const now = new Date();
      if (subscription.creditsLeft <= 0)
        return NextResponse.json({
          status: false,
          message: "No credits left to publish album",
        });

      if (subscription.expiresOn && subscription.expiresOn < now)
        return NextResponse.json({
          status: false,
          message: "Subscription expired, please renew plan",
        });

      // reduce credit
      await prisma.userSubscription.update({
        where: { id: subscription.id },
        data: { creditsLeft: subscription.creditsLeft - 1 },
      });

      // publish album
      await prisma.album.update({
        where: { id: albumId },
        data: {
          isPublished: BooleanFlag.Yes,
          updatedBy: body.currentUserId,
          updatedAt: dateTime,
        },
      });

      // send email
      await sendPublishEmail({
        creatorEmail: album.createdBy.email!,
        clientEmail: album.client.email!,
        viewersEmails: album.viewers
          .map((v) => v.email)
          .filter((e): e is string => e != null),
        name: album.albumName!,
        greeting: album.albumDesc!,
        cover: album.coverImage!,
        img1: album.imageUrls?.[0],
        img2: album.imageUrls?.[1],
        img3: album.imageUrls?.[2],
      });

      return NextResponse.json({
        status: true,
        message: "Album Published Successfully",
      });
    }

    // update viewers
    if (body.fieldname === "viewers" && Array.isArray(body.fieldValue)) {
      const viewerIds: any[] = [];
      for (const email of body.fieldValue) {
        const v = await getUserIdByEmail(email);
        if (v) viewerIds.push(v.object);
      }

      const albumFetched = await prisma.album.update({
        where: { id: albumId },
        data: {
          viewers: { set: viewerIds.map((u) => ({ id: u.id })) },
          updatedBy: body.currentUserId,
          updatedAt: dateTime,
        },
        include: {
          createdBy: true,
          client: true,
          viewers: true,
        },
      });
      if (
        albumFetched !== null &&
        albumFetched !== undefined &&
        albumFetched.isPublished.toString() === "Yes"
      ) {
        // send email
        await sendPublishEmail({
          creatorEmail: albumFetched.createdBy.email!,
          clientEmail: albumFetched.client.email!,
          viewersEmails: albumFetched.viewers
            .map((v) => v.email)
            .filter((e): e is string => e != null),
          name: albumFetched.albumName!,
          greeting: albumFetched.albumDesc!,
          cover: albumFetched.coverImage!,
          img1: albumFetched.imageUrls?.[0],
          img2: albumFetched.imageUrls?.[1],
          img3: albumFetched.imageUrls?.[2],
        });
      }

      return NextResponse.json({
        status: true,
        message: "Invitees Updated Successfully",
      });
    }

    // normal field update
    await prisma.album.update({
      where: { id: albumId },
      data: {
        [body.fieldname!]: body.fieldValue,
        updatedBy: body.currentUserId,
        updatedAt: dateTime,
      },
    });

    return NextResponse.json({ status: true, message: "Updated Successfully" });
  }

  // --- toggleLike ---
  if (method === "toggleLike") {
    const { albumId, email } = body;
    if (!albumId || !email)
      return NextResponse.json({
        status: false,
        message: "albumId and email required",
      });

    const album = await prisma.album.findUnique({ where: { id: albumId } });
    if (!album)
      return NextResponse.json({ status: false, message: "Album not found" });

    const likes: string[] = Array.isArray(album.likesByEmail)
      ? (album.likesByEmail as unknown as string[])
      : [];
    const hasLiked = likes.includes(email);
    const updatedLikes = hasLiked
      ? likes.filter((e) => e !== email)
      : [...likes, email];

    await prisma.album.update({
      where: { id: albumId },
      data: { likesByEmail: updatedLikes },
    });

    return NextResponse.json({
      albumId,
      liked: !hasLiked,
      totalLikes: updatedLikes.length,
      likesByEmail: updatedLikes,
    });
  }

  return NextResponse.json(
    { status: false, message: "Unknown method" },
    { status: 400 },
  );
}

// helper
async function getUserIdByEmail(email: string) {
  if (!email) return null;
  const dateTime = new Date();
  let user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: email,
        userType: "Viewer",
        active: BooleanFlag.Yes,
        createdAt: dateTime,
        createdBy: 1,
        updatedBy: 1,
        updatedAt: dateTime,
      },
    });
  }
  return { id: user.id, object: user };
}
