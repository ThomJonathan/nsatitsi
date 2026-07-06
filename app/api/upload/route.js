import { NextResponse } from "next/server";
import { getMegaStorage, findOrCreateFolder } from "@/lib/mega";

const ALLOWED_CATEGORIES = ["books", "pastpapers", "answersheets"];

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const category = formData.get("category");
        const subfolder = formData.get("subfolder") || ""; // Optional subfolder support

        if (!file) {
            return NextResponse.json({ error: "No files provided" }, { status: 400 });
        }
        if (!ALLOWED_CATEGORIES.includes(category)) {
            return NextResponse.json({ error: "Invalid category" }, { status: 400 });
        }

        const storage = await getMegaStorage();
        const folderPath = ["Nsatitsi", category];
        if (subfolder) folderPath.push(subfolder);
        
        const targetFolder = await findOrCreateFolder(storage, folderPath);

        const buffer = Buffer.from(await file.arrayBuffer());
        const safeName = file.name.replace(/\s+/g, "-");
        const fileName = `${Date.now()}-${safeName}`;

        const uploadedFile = await new Promise((resolve, reject) => {
            const uploadStream = targetFolder.upload(
                { name: fileName, size: buffer.length },
                buffer
            );
            uploadStream.on("complete", resolve);
            uploadStream.on("error", reject);
        });

        return NextResponse.json({
            success: true,
            key: uploadedFile.nodeId, // Returning nodeId as 'key' for frontend consistency
            category,
            name: file.name
        });
    } catch (err) {
        console.error("MEGA upload error:", err);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}