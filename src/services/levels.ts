import { Level } from "@/types/Level";

export async function GetLevels(): Promise<Level[]> {
  const res = await fetch("")

  if (!res.ok) {
    throw new Error(`Response status: ${res.status}`)
  }

  const levels = await res.json() as Level[]
  return levels
}