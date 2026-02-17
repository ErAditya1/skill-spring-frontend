'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'usehooks-ts';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/components/ui/use-toast';
import { AxiosError } from 'axios';
import { EyeIcon, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import api from '@/api';
import Image from 'next/image';

export default function SignUpForm() {

  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounce(username, 1000);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      role: 'student', // default role
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (!debouncedUsername) return;

      try {
        const response = await api.get<ApiResponse>(
          `/v1/users/check-username/?username=${debouncedUsername}`
        );

        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError.response?.data.message ?? 'Error checking username'
        );
      }
    };

    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await api.post<ApiResponse>(
        '/v1/users/register',
        data
      );

      toast({
        title: 'Success',
        description: response.data.message,
        variant: "success"
      });

      router.replace(`/auth/verify/${response.data.data.username}`);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: 'Sign Up Failed',
        description: axiosError.response?.data.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-dvh">
      <div className="w-full max-w-md p-8 space-y-8 bg-card border rounded-lg shadow-md">

        {/* LOGO */}
        <div className="text-center flex flex-col items-center">
          <div className='w-20 h-20 rounded-full border flex justify-center items-center'>
            <Image
              src='/skillspringDark.png'
              alt="Skill Spring logo"
              width={120}
              height={120}
              className="w-full h-full p-2 hidden dark:block rounded-full"
            />
            <Image
              src='/skillspringLight.png'
              alt="Skill Spring logo"
              width={120}
              height={120}
              className="w-full h-full p-2 block dark:hidden rounded-full"
            />
          </div>

          <h1 className="text-3xl font-bold mt-4">
            Join SkillSpring
          </h1>

          <p className="text-muted-foreground">
            Create your account and start learning or teaching
          </p>
        </div>

        {/* FORM */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* FULL NAME */}
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* USERNAME */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                  />
                  {usernameMessage && (
                    <p className="text-sm text-muted-foreground">
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* EMAIL */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PASSWORD */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Password</FormLabel>
                  <Input type={showPassword ? "text" : "password"} {...field} />
                  <span
                    className="absolute right-3 bottom-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <EyeIcon size={18} />}
                  </span>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ROLE SELECTION */}
            <FormField
              name="role"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>I want to join as:</FormLabel>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue="student"
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <label htmlFor="student">Student</label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="teacher" id="teacher" />
                      <label htmlFor="teacher">Instructor</label>
                    </div>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SUBMIT */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Create Account"
              )}
            </Button>

          </form>
        </Form>

        {/* SIGN IN */}
        <div className="text-center">
          <p>
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="text-primary font-medium">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
  