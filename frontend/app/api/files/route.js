// import { NextResponse } from "next/server";
// import { ListObjectsV2Command } from "@aws-sdk/client-s3";
// import { b2Client } from "@/lib/b2";
//
// export async function GET(request) {
//     try {
//         const { searchParams } = new URL(request.url);
//         const category = searchParams.get("category") || "";
//
//         const command = new ListObjectsV2Command({
//             Bucket: process.env.B2_BUCKET_NAME,
//             Prefix: category ? `${category}/` : "",
//         });
//
//         const result = await b2Client.send(command);
//         const files = (result.Contents || []).map((obj) => ({
//             key: obj.Key,
//             size: obj.Size,
//             lastModified: obj.LastModified,
//         }));
//
//         return NextResponse.json({ files });
//     } catch (err) {
//         console.error("B2 list error:", err);
//         return NextResponse.json({ error: "Failed to list files" }, { status: 500 });
//     }
// }


import { NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { b2Client } from "@/lib/b2";

const CATEGORY_LABELS = {
    books: "Textbook",
    pastpapers: "Past Paper",
    answersheets: "Answer Sheet",
};

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category") || "";

        const command = new ListObjectsV2Command({
            Bucket: process.env.B2_BUCKET_NAME,
            Prefix: category ? `${category}/` : "",
        });

        const result = await b2Client.send(command);

        const files = (result.Contents || [])
            // skip "folder placeholder" objects some tools create (keys ending in /)
            .filter((obj) => !obj.Key.endsWith("/"))
            .map((obj) => {
                const [cat, ...rest] = obj.Key.split("/");
                const rawName = rest.join("/");
                // strip the "<timestamp>-" prefix we add on upload, for display
                const displayName = rawName.replace(/^\d+-/, "");
                const ext = displayName.split(".").pop()?.toUpperCase() || "";

                return {
                    key: obj.Key,
                    category: cat,
                    categoryLabel: CATEGORY_LABELS[cat] || cat,
                    name: displayName,
                    ext,
                    size: obj.Size,
                    lastModified: obj.LastModified,
                };
            })
            .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

        return NextResponse.json({ files, total: files.length });
    } catch (err) {
        console.error("B2 list error:", err);
        return NextResponse.json({ error: "Failed to list files" }, { status: 500 });
    }
}