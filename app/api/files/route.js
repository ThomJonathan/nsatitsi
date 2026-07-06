import { NextResponse } from "next/server";
import { getMegaStorage } from "@/lib/mega";

const CATEGORY_LABELS = {
    books: "Textbook",
    pastpapers: "Past Paper",
    answersheets: "Answer Sheet",
};

/**
 * Recursively collects all files from a MEGA folder.
 */
function getAllFiles(node, category = null) {
    let files = [];
    if (!node.children) return files;

    for (const child of node.children) {
        if (child.directory) {
            // If we are at the top level (Nsatitsi root), the next level is the category
            const nextCategory = category || child.name;
            files = files.concat(getAllFiles(child, nextCategory));
        } else {
            const displayName = child.name.replace(/^\d+-/, "");
            const ext = displayName.split(".").pop()?.toUpperCase() || "";
            files.push({
                key: child.nodeId, // frontend expects 'key'
                category: category || "other",
                categoryLabel: CATEGORY_LABELS[category] || category || "Other",
                name: displayName,
                ext,
                size: child.size,
                lastModified: child.timestamp * 1000, // MEGA timestamp is in seconds
            });
        }
    }
    return files;
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const requestedCategory = searchParams.get("category") || "";

        const storage = await getMegaStorage();
        
        // Ensure children are loaded
        if (storage.root.fetchChildren && (!storage.root.children || storage.root.children.length === 0)) {
            await new Promise(resolve => storage.root.fetchChildren(() => resolve()));
        }

        // Look for the 'Nsatitsi' root folder
        const rootFolder = storage.root.children?.find(
            (child) => child.directory && child.name.toLowerCase() === "nsatitsi"
        );

        if (!rootFolder) {
            return NextResponse.json({ files: [], total: 0 });
        }

        let allFiles = getAllFiles(rootFolder);

        if (requestedCategory) {
            allFiles = allFiles.filter(f => f.category === requestedCategory);
        }

        allFiles.sort((a, b) => b.lastModified - a.lastModified);

        return NextResponse.json({ files: allFiles, total: allFiles.length });
    } catch (err) {
        console.error("MEGA list error:", err);
        return NextResponse.json({ error: "Failed to list files" }, { status: 500 });
    }
}