// import { NextResponse } from "next/server";
// import { getMegaStorage, findNodeById } from "@/lib/mega";
//
// export async function GET(request) {
//     try {
//         const { searchParams } = new URL(request.url);
//         const key = searchParams.get("key");
//
//         if (!key) {
//             return NextResponse.json({ error: "Missing file ID" }, { status: 400 });
//         }
//
//         const storage = await getMegaStorage();
//
//         // Ensure children are loaded for search
//         if (storage.root.fetchChildren && (!storage.root.children || storage.root.children.length === 0)) {
//             await new Promise(resolve => storage.root.fetchChildren(() => resolve()));
//         }
//
//         const file = findNodeById(storage.root, key);
//
//         if (!file || file.directory) {
//             return NextResponse.json({ error: "File not found" }, { status: 404 });
//         }
//
//         // For thumbnails and access-controlled downloads, we stream the file.
//         // If public links were preferred, we'd use file.link().
//         const chunks = [];
//         await new Promise((resolve, reject) => {
//             const stream = file.download();
//             stream.on("data", (chunk) => chunks.push(chunk));
//             stream.on("end", resolve);
//             stream.on("error", reject);
//         });
//
//         const buffer = Buffer.concat(chunks);
//
//         return new NextResponse(buffer, {
//             headers: {
//                 "Content-Type": "application/pdf", // Adjust if needed, but thumbnails are PDFs
//                 "Content-Disposition": `inline; filename="${file.name}"`,
//                 "Content-Length": String(buffer.length),
//             },
//         });
//     } catch (err) {
//         console.error("MEGA download error:", err);
//         return NextResponse.json({ error: "Could not fetch file" }, { status: 500 });
//     }
// }

import { NextResponse } from "next/server";
import { getMegaStorage, findNodeById } from "@/lib/mega";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get("key");

        if (!key) {
            return NextResponse.json({ error: "Missing file ID" }, { status: 400 });
        }

        const storage = await getMegaStorage();

        if (storage.root.fetchChildren && (!storage.root.children || storage.root.children.length === 0)) {
            await new Promise(resolve => storage.root.fetchChildren(() => resolve()));
        }

        const file = findNodeById(storage.root, key);

        if (!file || file.directory) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        const megaStream = file.download();

        // Wrap the MEGA download stream in a web ReadableStream,
        // forwarding chunks to the browser as they arrive instead of buffering.
        const webStream = new ReadableStream({
            start(controller) {
                megaStream.on("data", (chunk) => {
                    controller.enqueue(chunk);
                });
                megaStream.on("end", () => {
                    controller.close();
                });
                megaStream.on("error", (err) => {
                    controller.error(err);
                });
            },
            cancel() {
                // If the browser aborts the download, stop pulling from MEGA too
                megaStream.destroy?.();
            },
        });

        const ext = file.name.split(".").pop()?.toLowerCase();
        const contentType =
            ext === "pdf" ? "application/pdf" :
                ext === "docx" ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document" :
                    "application/octet-stream";

        return new NextResponse(webStream, {
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `inline; filename="${file.name}"`,
                "Content-Length": String(file.size), // known from MEGA metadata, no need to buffer first
            },
        });
    } catch (err) {
        console.error("MEGA download error:", err);
        return NextResponse.json({ error: "Could not fetch file" }, { status: 500 });
    }
}