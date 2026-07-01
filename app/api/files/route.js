import { NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { b2Client } from "@/lib/b2";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category") || "";

        const command = new ListObjectsV2Command({
            Bucket: process.env.B2_BUCKET_NAME,
            Prefix: category ? `${category}/` : "",
        });

        const result = await b2Client.send(command);
        const files = (result.Contents || []).map((obj) => ({
            key: obj.Key,
            size: obj.Size,
            lastModified: obj.LastModified,
        }));

        return NextResponse.json({ files });
    } catch (err) {
        console.error("B2 list error:", err);
        return NextResponse.json({ error: "Failed to list files" }, { status: 500 });
    }
}