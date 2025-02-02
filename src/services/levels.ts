import { API_URL } from "@/constants/API_URL";
import { Level, NewLevel } from "@/types/Level";
import { ServerResp } from "@/types/ServerResponse";

export async function GetLevels(): Promise<Level[]> {
  const res = await fetch(API_URL + "/levels")

  if (!res.ok) {
    throw new Error(`Response status: ${res.status}`)
  }

  const serverRes = await res.json() as ServerResp<Level[]>
  return serverRes.data
}

export async function UploadLevelImage(image: FormData) {
  const res = await fetch(API_URL + "/levels/image", {
    method: 'POST',
    body: image
  })

  if (!res.ok) {
    throw new Error(`Response status: ${res.status}`)
  }
}

export async function CreateLevel(newLevel: NewLevel) {
  const res = await fetch(API_URL + "/levels", {
    method: "POST",
    body: JSON.stringify(newLevel),
    headers: {
      "Content-Type": "application / json",
    }
  })

  if (!res.ok) {
    throw new Error(`Response status: ${res.status}`)
  }
}

export async function DeleteLevel(id: number) {
  const res = await fetch(`${API_URL}/levels/${id}`, {
    method: "DELETE"
  })

  if (!res.ok) {
    throw new Error(`Response status: ${res.status}`)
  }
}