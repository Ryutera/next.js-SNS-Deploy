"use client"
import React, { useOptimistic } from "react";
import { Button } from "../ui/button";
import { prisma } from "@/lib/prisma";
import { followAction } from "@/lib/actions";

interface FollowButtonProps {
  isCurrentUser: boolean;
  user:any;
  isFollowing: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({ isCurrentUser, isFollowing ,user}) => {
    const [optimisticLikeFollow,addOptimisticFollow]=useOptimistic<{isFollowing:boolean},void>({isFollowing},(currentState)=>({isFollowing:!currentState.isFollowing}))
  // ボタンのテキストを取得する関数
  const getButtonContent = () => {
    if (isCurrentUser) {
      return "プロフィール編集";
    }
    if (optimisticLikeFollow.isFollowing) {
      return "フォロー中";
    } 
      return "フォローする";
    
  };

  // ボタンのデザインバリアントを取得する関数
  const getButtonVariant = () => {
    if (isCurrentUser) {
      return "secondary";
    }
    if (optimisticLikeFollow.isFollowing) {
      return "outline"; // 修正: "autoline" は存在しないため "outline" を使用
    } 
      return "default";
    
  };

  const hadleFollowAction = async()=>{
    // 自分をフォローできるバグの修正
    if (isCurrentUser) {
        return 
    }
    try {
        addOptimisticFollow()
        await followAction(user )
    } catch (error) {
        console.log(error)
    }
  }


  return (
    
// サーバーアクションの関数に引数を渡すのは直接できない,bindを使う必要がある
        <form action={ hadleFollowAction}>
      <Button variant={getButtonVariant()} className="w-full">
        {getButtonContent()}
      </Button>
      </form>
   
  );
};

export default FollowButton;
