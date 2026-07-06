import { Storage } from 'megajs';

// Reusable MEGA session, same role as your old S3 client singleton.
// MEGA has no concept of presigned URLs - you log in once per server
// process and reuse the authenticated session for every operation.

let storageInstance = null;
let loginPromise = null;

export async function getMegaStorage() {
    if (storageInstance) return storageInstance;

    if (!loginPromise) {
        loginPromise = new Promise((resolve, reject) => {
            console.log('Attempting MEGA login...');
            const storage = new Storage(
                {
                    email: process.env.MEGA_EMAIL,
                    password: process.env.MEGA_PASSWORD,
                    autologin: true,
                },
                (err) => {
                    if (err) {
                        console.error('MEGA login error:', err);
                        loginPromise = null; // Allow retry
                        return reject(err);
                    }
                    console.log('MEGA login successful');
                    storageInstance = storage;
                    // Pre-fetch children to speed up initial operations
                    if (storage.root.fetchChildren) {
                        storage.root.fetchChildren((err) => {
                            if (err) console.warn('Warning: fetchChildren failed:', err);
                            resolve(storage);
                        });
                    } else {
                        resolve(storage);
                    }
                }
            );

            // Timeout after 15 seconds if login callback isn't called
            setTimeout(() => {
                if (!storageInstance) {
                    console.error('MEGA login timeout');
                    loginPromise = null;
                    reject(new Error('MEGA login timeout'));
                }
            }, 15000);
        });
    }

    return loginPromise;
}

// MEGA doesn't have S3-style key prefixes - folders are real nodes.
// This walks/creates a folder path so "books/grade-10" behaves like
// the prefix "books/grade-10/" did in B2.
export async function findOrCreateFolder(storage, pathParts) {
    let current = storage.root;

    for (const part of pathParts) {
        if (!part) continue;

        let next = current.children?.find(
            (child) => child.directory && child.name.toLowerCase() === part.toLowerCase()
        );

        if (!next) {
            // Ensure children are loaded before making a decision
            if (current.fetchChildren) {
                await new Promise((resolve) => {
                    current.fetchChildren(() => resolve());
                });
                next = current.children?.find(
                    (child) => child.directory && child.name.toLowerCase() === part.toLowerCase()
                );
            }
        }

        if (!next) {
            next = await new Promise((resolve, reject) => {
                current.mkdir(part, (err, folder) => {
                    if (err) return reject(err);
                    resolve(folder);
                });
            });
        }

        current = next;
    }

    return current;
}

// Depth-first search for a node by its nodeId, needed since MEGA
// doesn't let you fetch a single file by "key" the way S3 GetObject does.
export function findNodeById(node, id) {
    if (node.nodeId === id) return node;
    if (!node.children) return null;

    for (const child of node.children) {
        const found = findNodeById(child, id);
        if (found) return found;
    }

    return null;
}
