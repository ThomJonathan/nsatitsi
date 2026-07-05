import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { b2Client } from "@/lib/b2";

const ALLOWED_CATEGORIES = ["books", "pastpapers", "answersheets"];

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const category = formData.get("category");

        if (!file) {
            return NextResponse.json({ error: "No files provided" }, { status: 400 });
        }
        if (!ALLOWED_CATEGORIES.includes(category)) {
            return NextResponse.json({ error: "Invalid category" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const safeName = file.name.replace(/\s+/g, "-");
        const key = `${category}/${Date.now()}-${safeName}`;

        await b2Client.send(
            new PutObjectCommand({
                Bucket: process.env.B2_BUCKET_NAME,
                Key: key,
                Body: buffer,
                ContentType: file.type,
            })
        );

        return NextResponse.json({ success: true, key, category, name: file.name });
    } catch (err) {
        console.error("B2 upload error:", err);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}