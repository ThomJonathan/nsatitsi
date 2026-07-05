import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { b2Client } from "@/lib/b2";

export async function POST(request) {
    try {
        const { key } = await request.json();

        if (!key) {
            return NextResponse.json({ error: "Missing file key" }, { status: 400 });
        }

        await b2Client.send(
            new DeleteObjectCommand({
                Bucket: process.env.B2_BUCKET_NAME,
                Key: key,
            })
        );

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("B2 delete error:", err);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}