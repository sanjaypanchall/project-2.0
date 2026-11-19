import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Router } from 'express';
const here = path.dirname(fileURLToPath(import.meta.url));

export async function loadModules() {
    const api = Router();
    const folders = fs
        .readdirSync(here, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .sort();
    for (const folder of folders) {
        const file = path.join(here, folder, `${folder}.routes.js`);
        if (!fs.existsSync(file)) continue;
        const mod = await import(pathToFileURL(file).href);
        api.use(mod.path, mod.default);
        console.log(` module loaded: /api${mod.path}`);
    }
    return api;
}