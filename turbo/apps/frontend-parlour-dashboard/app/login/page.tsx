"use client";
import { CldImage } from 'next-cloudinary';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import { useState } from 'react';
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import { SigninInput, signinInput} from '@repo/common/types';
import axios,{AxiosError} from 'axios';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { useAuthStore } from '@/store/auth.store';





export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const form = useForm<SigninInput>({
    resolver: zodResolver(signinInput),
    defaultValues:{
      email: '',
      password: ''
    }
  });

  const login = useAuthStore((state) => state.login);

  const onSubmit = async(data : SigninInput)=>{

    setIsSubmitting(true);
    try{
      console.log("API URL:", process.env.NEXT_PUBLIC_BACKEND_URL);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,data);
      const { token, user } = response.data;
      login(token, user.role); 
      toast("successfully Logged In !!!");
      router.replace(`/`);
      setIsSubmitting(false);
    } catch (e){
      console.error("Error in signin of user",e);
      toast("Login failed !!!");
      setIsSubmitting(false);
    }
  }




  return (
    <div className="w-screen h-screen flex justify-center items-center bg-neutral-900">
      <div className="w-1/2 h-full relative ">
        <CldImage
          src="https://res.cloudinary.com/dzbfzbhtn/image/upload/v1751610359/parlour_dkllnt.png"
          fill
          alt="Parlour"
          className="object-cover "
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <h1 className="text-neutral-200 text-5xl  md:text-6xl  font-semibold text-center ">
           <span className='text-7xl font-bold text-white'>Poshlaksh</span>
          </h1>
        </div>
      </div>

      <div className="w-1/2 h-full flex justify-center items-center">
        <div className='w-full max-w-lg rounded shadow-[0_0_60px_#d1a85380] p-10 py-15 flex justify-center items-center flex-col'>
          <h1 className='font-bold text-white text-4xl'>Login to your Account</h1>
          <p className='text-white  mt-5'>Parlour Bussiness Management software.</p>
          <div className='w-full text-white mt-5 px-4'>
              <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="superadmin@gmail.com" {...field} className='py-6'/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="admin123" {...field} className=' py-6'/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className='w-full bg-white text-black h-12 hover:bg-neutral-300' type="submit" disabled={isSubmitting}>
                  {
                    isSubmitting ? (
                      <>
                        please wait...
                      </>
                    ) : ('SignIn')
                  }
                </Button>
              </form>
            </Form>
          </div>

        </div>
      </div>
    </div>
  );
}
