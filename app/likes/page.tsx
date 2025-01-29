import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { ClockIcon } from './Icons';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import LeftSidebar from '@/components/component/LeftSidebar';
import RightSidebar from '@/components/component/RightSidebar';

const Likes = async () => {
  const { userId } = auth();

  const likes = await prisma.like.findMany({
    where: {
      userId: userId || undefined, // ログイン中のユーザーの ID
    },
    select: {
      id: true, // LikeのID
      post: {
        select: {
          id: true, // PostのID
          content: true, // Postの内容
          createdAt: true, // 投稿日時
          author: {
            select: {
              username: true, // 投稿者のユーザー名
              name: true, // 投稿者の名前
              image: true, // 投稿者の画像
            },
          },
        },
      },
    },
  });

  return (
    <div className="flex flex-row w-full">
  {/* メインコンテンツエリア */}
  <div className="flex flex-col flex-1 p-4 ml-10 max-w-[70%]">  {/* ポスト部分の幅を狭く */}
    {likes.map((like: any) => {
      const post = like.post; // likeに関連するpostデータを取得

      return (
        <div
          key={like.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4"
        >
          <div className="flex items-center gap-4 mb-4">
            <Link href={`profile/${post.author?.username}`}>
              <Avatar className="w-12 h-12">
                <AvatarImage src={post.author.image || undefined} />
                <AvatarFallback>{post.author.name?.[0] || "?"}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {post.author.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                @{post.author.username}
              </p>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <p className="text-gray-900 dark:text-white">{post.content}</p>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div>
              <span>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    })}
  </div>

  {/* 右サイドバー */}
  <div className="w-[30%] p-4 h-full">  {/* 右サイドバーの幅を広く */}
    <RightSidebar />
  </div>
</div>

  );
};

export default Likes;
