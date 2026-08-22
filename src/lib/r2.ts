import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuid } from 'uuid'
import { promises as fs } from 'fs'
import path from 'path'

const isR2Configured = (): boolean => {
  const id = process.env.R2_ACCOUNT_ID || ''
  return id.length > 0 && !id.includes('your-')
}

export const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const LOCAL_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export async function uploadToR2(file: File, folder: string = 'uploads'): Promise<{ url: string; key: string }> {
  const ext = file.name.split('.').pop()
  const key = `${folder}/${uuid()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  if (isR2Configured()) {
    await r2.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }))

    return {
      url: `${process.env.R2_PUBLIC_URL}/${key}`,
      key,
    }
  }

  // Local file storage fallback
  const uploadDir = path.join(LOCAL_UPLOAD_DIR, folder)
  await fs.mkdir(uploadDir, { recursive: true })
  const filePath = path.join(uploadDir, `${uuid()}.${ext}`)
  await fs.writeFile(filePath, buffer)

  const relativePath = path.relative(path.join(process.cwd(), 'public'), filePath).replace(/\\/g, '/')
  return {
    url: `/${relativePath}`,
    key: relativePath,
  }
}

export async function deleteFromR2(key: string): Promise<void> {
  if (isR2Configured()) {
    await r2.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    }))
    return
  }

  // Local file storage fallback
  const filePath = path.join(process.cwd(), 'public', key)
  try {
    await fs.unlink(filePath)
  } catch {
    // File may not exist
  }
}
