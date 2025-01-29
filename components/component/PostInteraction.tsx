"use client"
import React, { FormEvent, useOptimistic, useState } from 'react'
import { Button } from "@/components/ui/button";
import { HeartIcon, MessageCircleIcon, Share2Icon, ClockIcon } from "./Icons";
import { prisma } from "@/lib/prisma";
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { likeAction } from '@/lib/actions';
import { boolean } from 'zod';
import { Anek_Gujarati } from 'next/font/google';
type PostInteractionProps= {
    postId:string
    initialLikes:string[];
    commentNumber:number;
    userId:string|null;

}

interface LikeState{
    likeCount:number;
    isLiked:boolean;
}


const PostInteraction = ({postId,initialLikes,commentNumber,userId}:PostInteractionProps) => {
// authでuserId呼ぶとクライアントで使えないってエラー出るからpostから持ってきているけどこれでちゃんと楽観的UIが機能しているのかは謎、パソコンが重くてわからん本体はここでauth()使うみたいだけど

// const {userId } = auth()
// const [likeState, setLikeState] = useState({likeCount:initialLikes.length,isLiked:userId? initialLikes.includes(userId):false})

const initialState={likeCount:initialLikes.length,isLiked:userId? initialLikes.includes(userId):false}
const[ optimisticLike, addOptimisticLike]=useOptimistic< LikeState,void>(initialState, (currentState)=>({

    likeCount:currentState.isLiked?currentState.likeCount -1 : currentState.likeCount +1,
    isLiked: !currentState.isLiked,
}))

   

    const handleLikeSubmit = async()=>{
    
        try{
            addOptimisticLike()
            // setLikeState((prev)=>({
            //     likeCount:prev.isLiked?prev.likeCount -1 :prev.likeCount +1,
            //     isLiked: !prev.isLiked
            // }))
            await likeAction(postId)
        
            
        }catch(err){
            // setLikeState((prev)=>({
            //     likeCount:prev.isLiked?prev.likeCount +1 :prev.likeCount -1,
            //     isLiked: !prev.isLiked
            // }))
           

            console.log(err)
        }
       

      
    }

    
  return (
    <div className='flex items-center'>
        <form action={handleLikeSubmit}>
    <Button variant="ghost" size="icon">
          <HeartIcon className={`"h-5 w-5 " ${optimisticLike.isLiked?"text-destructive":"text-muted-foreground"}`}  />
        </Button>
        </form>
        <span className={`-ml-1 ${optimisticLike.isLiked?"text-destructive":""}`}>{optimisticLike.likeCount}</span>
        <Button variant="ghost" size="icon">
          <MessageCircleIcon className="h-5 w-5 text-muted-foreground" />
        </Button>
        <span>{commentNumber}</span>
        <Button variant="ghost" size="icon">
          <Share2Icon className="h-5 w-5 text-muted-foreground" />
        </Button>
        </div>

  )
}

export default PostInteraction