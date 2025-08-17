import { promises as fs } from "fs";
import path from "path";

const root = process.cwd();
const dataDir = path.resolve(root, "data");

async function ensureDataDir(){ try{ await fs.mkdir(dataDir, {recursive:true}); }catch{} }

export async function readJSON(file: string, fallback: any){
  await ensureDataDir();
  const p = path.resolve(dataDir, file);
  try{
    const buf = await fs.readFile(p);
    return JSON.parse(buf.toString("utf8"));
  }catch{
    await writeJSON(file, fallback);
    return fallback;
  }
}

export async function writeJSON(file: string, data: any){
  await ensureDataDir();
  const p = path.resolve(dataDir, file);
  const str = JSON.stringify(data, null, 2);
  await fs.writeFile(p, Buffer.from(str, "utf-8"));
}
