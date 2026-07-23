import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function GET(
    _request: Request,
    { params }: { params: Params },
) {
    const id = Number((await params).id);

    const plat = await prisma.plat.findFirst({
        where: { plat_id: id },
        select: { photo: true },
    });

    if (!plat || plat.photo.length === 0) {
        return new NextResponse("Photo introuvable", { status: 404 });
    }

    let type = "image/jpeg";
    // on cherche le type de l'image en analysant les 2 premiers octets du fichier  
    // si les 2 premiers octets sont 0x89 et 0x50, alors c'est un PNG
    // si les 2 premiers octets sont 0x47 et 0x49, alors c'est un GIF
    // si les 2 premiers octets sont 0x52 et 0x49, alors c'est un WEBP

    if (plat.photo[0] === 0x89 && plat.photo[1] === 0x50) {
        type = "image/png";
    } else if (plat.photo[0] === 0x47 && plat.photo[1] === 0x49) {
        type = "image/gif";
    } else if (plat.photo[0] === 0x52 && plat.photo[1] === 0x49) {
        type = "image/webp";
    }

    return new NextResponse(Buffer.from(plat.photo), {
        headers: {
            "Content-Type": type,
            "Cache-Control": "public, max-age=3600",
        },
    });
}
