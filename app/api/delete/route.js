import { NextResponse } from "next/server";
import { getMegaStorage, findNodeById } from "@/lib/mega";

export async function POST(request) {
    try {
        const { key } = await request.json();

        if (!key) {
            return NextResponse.json({ error: "Missing file ID" }, { status: 400 });
        }

        const storage = await getMegaStorage();

        // Ensure children are loaded for search
        if (storage.root.fetchChildren && (!storage.root.children || storage.root.children.length === 0)) {
            await new Promise(resolve => storage.root.fetchChildren(() => resolve()));
        }

        const file = findNodeById(storage.root, key);

        if (!file) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        await new Promise((resolve, reject) => {
            file.delete((err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("MEGA delete error:", err);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}