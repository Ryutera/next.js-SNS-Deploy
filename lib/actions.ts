'use server';

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

type State ={
    error?:string|undefined,
    success:boolean
}

export async function addPostAction(prevState: State, formData:FormData):Promise<State>{

  // 投稿の作成
  try {
        // userIdの確認
    // supabaseでauthor.idの外部リンクをuserのidからclerk.idに変更したら投稿できるようになったけどauth()でとるのはidではなくclerkid?
  const { userId } = auth();
  
  // userIdが存在しない場合
  if (!userId) {
    return {error:"ユーザーが存在しません",success:false};
  }

     // 投稿内容の取得
  const postText = formData.get("post") as string;
  const postTextSchema = z.string().min(1,"ポスト内容を入力してください。").max(140,"140字以内で入力してください。")

  const validatedpostTextSchema=postTextSchema.parse(postText)

    await prisma.post.create({
      data: {
        content: validatedpostTextSchema,
        authorId: userId,
      },
    });
   
    revalidatePath("/")
// revalidatePath("blog")

    return {
        error:undefined,
        success:true
      }

  } catch (error) {

    if (error instanceof z.ZodError) {
      return {
        error:error.errors.map((e)=>e.message).join(","),
        success:false
      }
    }else if (error instanceof Error){
      return{
        error:error.message,
        success:false
    }
    }else{
      return{
        error:"予期せぬエラーが発生しました",
        success:false
    }}
    // 以上のようにオブジェクト形式でエラーを返すのはあとで扱いやすくなるので一般的に推奨される書き方
    // 実際にsetErrorに格納するときに使っている
  }}


export  const likeAction =async(postId:string)=>{

    const {userId} = auth()
   
    if (!userId) {
        throw new Error("User is not authenticated")
        
    }
    try{
        const existingLike = await prisma.like.findFirst({
            where:{
                postId,
                userId,
            }
        })

       if (existingLike) {
        await prisma.like.delete({
            where:{
                id:existingLike.id,
            },
        })

       
        
       }else{
        await prisma.like.create({
            data:{
                postId,
                userId,
            }
        })
       }
       revalidatePath("/")
        
    }catch(err){
console.log(err)
    }
}


export const followAction =async(user:any)=>{
  
  
  const {userId:currentUserId} = auth()

   
  if (!currentUserId) {
      throw new Error("User is not authenticated")
      
  }
  try{
      const existingFollow = await prisma.follow.findFirst({
          where:{
              followerId:currentUserId,
          followingId:user.clerkId
          },
      })

     if (existingFollow) {
      await prisma.follow.delete({
          where:{
              followerId_followingId:{
                followerId:currentUserId,
                followingId:user.clerkId,
              }
          },
      })

     
      
     }else{
      await prisma.follow.create({
          data:{
            followerId:currentUserId,
            followingId:user.clerkId
          }
      })
     }
     revalidatePath("/");
      
  }catch(err){
console.log(err)
  }
    }