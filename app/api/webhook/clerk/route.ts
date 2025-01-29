// アカウントの作成、更新でsupabaseと連携するためのエンドポイント
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data
  const eventType = evt.type



  // 左辺のclerkIDなどはprismaSchemaなどのモデルに対応、右辺の値はWebhookのペイロードから取得したデータ
  // JSON.parse は、JSON形式の文字列をJavaScriptのオブジェクトに変換するメソッド
//   Prismaのスキーマでモデル名をUserと大文字で定義していても、Prisma Clientでは自動的に小文字のuserとして扱われます。
// これはPrismaの仕様であり、モデル名の大文字・小文字はPrisma Clientのメソッド名に影響しません。

  if (eventType === "user.created"){
    try{
      await prisma.user.create({
        data:{
          clerkId: evt.data.id,
          username:JSON.parse(body).data.username,
          name: JSON.parse(body).data.username,  
          image:JSON.parse(body).data.image_url,
        },
      } )
      return new Response("ユーザーの作成に成功しました",{status:200})

    }catch(err){
      console.log(err)
      return new Response("ユーザーの作成に失敗しました",{status:500})
    }

  }

  if (eventType === "user.updated"){
    try{
      await prisma.user.update({
        where:{
          clerkId: evt.data.id,
        
      },
        data:{
          username: JSON.parse(body).data.username,
        
          name:JSON.parse(body).data.username,
          image:JSON.parse(body).data.image_url,
        },
      } )
      return new Response("ユーザーの更新に成功しました",{status:200})

    }catch(err){
      console.log(err)
      return new Response("ユーザーの更新に失敗しました",{status:500})
    }

  }

  return new Response('Webhook received', { status: 200 })
}



