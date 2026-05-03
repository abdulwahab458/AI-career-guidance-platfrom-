"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingSchema } from "@/lib/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { industries } from "@/data/industries";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
// removed unused useFetch to avoid Server Action call from client
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const OnboardingForm = () => {
  const [selectIndustry, setselectIndustry] = useState(null)
  const router = useRouter()
  const [Loading, setLoading] = useState(false)

  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
  });


  

  const onSubmit = async (values) => {
    try {
      setLoading(true)
      const formattedIndustry = `${values.industry}-${values.subIndustry
        .toLowerCase()
        .replaceAll(" ", "-")}`;

      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ ...values, industry: formattedIndustry }),
      });
      const result = await res.json();

      if (res.status === 401 || /Unauthorized/i.test(result?.error || '')) {
        toast.error('Please sign in to continue.');
        router.push('/sign-in');
        return;
      }

      if (result?.updatedUser) {
        toast.success('Profile updated successfully!');
        router.push('/dashboard');
      } else {
        toast.error('Something went wrong.');
      }
    } catch (error) {
      console.error("Onboarding Error", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Removed stale effect that referenced removed `updateResult`/`updateLoading`.


  const watchIndustry = watch("industry");
  return (
    <div className="flex items-center  justify-center ">
      <Card className="flex flex-col mt-20 mx-auto w-full max-w-lg">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>Select Your industry for better career insights</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label htmlFor="industry">Industry</label>
              <Select
                onValueChange={(Value) => {
                  setValue("industry", Value)
                  setselectIndustry(
                    industries.find((ind) => ind.id == Value)
                  )
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select an Industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.id} value={industry.id}>
                      {industry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {
                errors.industry && (
                  <p className="text-red-500">{errors.industry.message}</p>
                )
              }
            </div>

            {watchIndustry && (
              <div className="space-y-2">
                <label htmlFor="subIndustry">Industry</label>
                <Select
                  onValueChange={(Value) => { setValue("subIndustry", Value) }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a subIndustry" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectIndustry?.subIndustries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {
                  errors.subIndustry && (
                    <p className="text-red-500">{errors.subIndustry.message}</p>
                  )
                }
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="experience">What is Your Expericence?</label>
              <Input id="experience"
                type="number"
                min="0"
                max="50"
                placeholder="Enter your years of experience"
                {...register("experience")}
              />
              {
                errors.experience && (
                  <p className="text-red-500">{errors.experience.message}</p>
                )
              }
            </div>
            <div className="space-y-2">
              <label htmlFor="skills">What are your Skills?</label>
              <Input id="skills"
                placeholder="eg. Python, Java, C++"
                {...register("skills")}
              />
              <p className="text-sm text-muted-foreground">separate multiple skills with commas</p>
              {
                errors.skills && (
                  <p className="text-red-500">{errors.skills.message}</p>
                )
              }
            </div>
            <div className="space-y-2">
              <label htmlFor="bio">Professional Bio</label>
              <Textarea id="bio"
                placeholder="Tell us about yourself? "
                {...register("bio")}
              />
              <p className="text-sm text-muted-foreground"></p>
              {
                errors.bio && (
                  <p className="text-red-500">{errors.bio.message}</p>
                )
              }
            </div>
            <Button type="submit" disabled={Loading}>
              {Loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Saving...
                </>
              ) : (
                "Complete Onboarding"
              )}
            </Button>

          </form>
        </CardContent>

      </Card>
    </div>
  )
}

export default OnboardingForm;
