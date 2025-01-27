import { API_URL } from "@/constants/API_URL";
import { Level } from "@/types/Level";

export async function GetLevels(): Promise<Level[]> {
  const res = await fetch(API_URL + "/levels")

  if (!res.ok) {
    throw new Error(`Response status: ${res.status}`)
  }

  const levels = await res.json() as Level[]
  return levels
}

export async function UploadLevelImage(image: FormData) {
  return fetch(API_URL + "/levels/image", {
    method: 'POST',
    body: image
  })
}