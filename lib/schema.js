import { date, email, z } from "zod";

export const onboardingSchema = z.object({
    industry: z.string({
        required_error: "Please select an industry",
    }),
    subIndustry: z.string({
        required_error: "Please select a specialization",
    }),
    bio: z.string().max(500).optional(),
    experience: z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(
            z
                .number()
                .min(0, "Experience should be a minimum of 0 years")
                .max(50, "Experience should be a maximum of 50 years")
        ),
    skills: z
        .string({
            required_error: "Please enter your skills",
        })
        .transform((val) =>
            val
                .split(",")
                .map((skill) => skill.trim())
                .filter((skill) => skill.length > 0)
        )
        .refine((arr) => arr.length > 0, {
            message: "You must provide at least one skill",
        }),
});



export const contactSchema = z.object({
    email:z.string().email("Invalid email address"),
    mobile:z.string().optional(),
    linkedin:z.string().optional(),
    twitter:z.string().optional(),
})

// export const entrySchema = z.object({
//     title:z.string().min(1,"Title is required "),
//     Organization:z.string().min(1,"Organization is required"),
//     startDate:z.string().min(1,"Start Date is Req.."),
//     endDate:z.string().optional(),
//     description:z.string().min(1,"Description is required"),
//     current:z.boolean().default(false),
// }).refine(()=>{
//     if(!date.current && !date.endDate){
//         return false;
//     }
//     return true;
// },{
//     message:"End Date is req unless it is your current pos",
//     path:["endDate"],
// });

export const entrySchema = z.object({
  title: z.string().min(1, "Title is required"),
  Organization: z.string().min(1, "Organization is required"),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  current: z.boolean().default(false),
}).refine(
  (data) => data.current || data.endDate,
  {
    message: "End Date is required unless it is your current position",
    path: ["endDate"],
  }
);

export const resumeSchema = z.object({
    contactInfo:contactSchema,
    summary:z.string().min(1,"Summary is required"),
    skills:z.string().min(1," Skills are Required"),
    experience:z.array(entrySchema),
    education:z.array(entrySchema),
    projects:z.array(entrySchema),
})