"use client"
// components/PostForm.tsx

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon } from "./Icons";
import { useRef, useState } from "react";
import { addPostAction } from "@/lib/actions";
import SubmitButton from "./SubmitButton";
import { useFormState } from "react-dom";

export default function PostForm() {
  const initialState={
    error:undefined,
    success:false,
  }
  // const [error, setError] = useState<string|undefined>("")
  const formRef = useRef<HTMLFormElement>(null)

  const [state,formAction] = useFormState(addPostAction, initialState)
// const [] = useFormState(addPostAction,initialState )
// 現在ログイン中のユーザーのID
// console.log(userId)                          
 
// const handlesubmit = async(formData:FormData)=>{
// const result = await addPostAction(formData)
// if (!result?.success) {
//   setError(result?.error)
//   console.log(error)
  
// }else{
//   setError("")
//   if (formRef.current) {
//     formRef.current.reset()
    
//   }
// }

// }
if (state.success&&formRef.current) {
  formRef.current.reset()
  
}


  return (
    <div>
    <div className="flex items-center gap-4">
      <Avatar className="w-10 h-10">
        <AvatarImage src="/placeholder-user.jpg" />
        <AvatarFallback>AC</AvatarFallback>
      </Avatar>

      {/* serveractionはform内で使用、actionに登録した関数がサーバー側で実行される、 */}
      <form action={formAction} className="flex items-center flex-1" ref={formRef}>
      {/* ここのnameがgetのpostに対応する */}
      <Input
        type="text"
        placeholder="What's on your mind?"
        className="flex-1 rounded-full bg-muted px-4 py-2"
        name="post"

      />
      
      <SubmitButton/>
      </form>
      </div>
      {state.error&&(<p className="text-destructive mt-1 ml014">{state.error}</p>)}
    </div>
    
  );
}
