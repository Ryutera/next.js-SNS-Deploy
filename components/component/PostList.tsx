// components/PostList.tsx

import { auth } from "@clerk/nextjs/server";
import { fetchPosts } from "@/lib/postDataFetch";
import Post from "./Post";

export default async function PostList({username}:{username:string}) {
  const {userId} = auth()
  console.log(userId)

  if (!userId) {
    return
  }

  const posts = await fetchPosts(userId,username)
 

  return (
    <div className="space-y-4">
      {posts?posts.map((post:any) => (
       <Post post={post} id={post.id}/>
      )):<div>ポストが見つかりません</div>}
    </div>
  );
}
