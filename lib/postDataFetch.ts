import { prisma } from "./prisma";

export async function fetchPosts(userId:string,username?:string){
  // プロフィールのタイムライン
  if (username) {
    return await prisma.post.findMany({
      where:{
        author:{
          name:username
        }
      }, 
      include:{
        author:true,
        likes:{
          select:{
            userId:true,
          },
        },
        _count:{
          select:{
            replies:true,
          },
        },
      },
     
    })
    
  }

  // ホームタイムライン(フォローしているユーザーの投稿も表示される)
  if (!username && userId) {
    const following = await prisma.follow.findMany( {
      where:{
        followerId: userId,
      },
      select:{
    followingId: true,
      },
    
    })


  const followerIds = following.map((f)=>f.followingId)
  const ids = [userId, ...followerIds]
  return  await prisma.post.findMany({


    where:{
      authorId:{
        in: ids,
      },
    },
    include:{
      author:true,
      likes:{
        select:{
          userId:true,
        },
      },
      _count:{
        select:{
          replies:true,
        },
      },
    },
    orderBy:{
      createdAt:"desc",
    }

  })
  }



}