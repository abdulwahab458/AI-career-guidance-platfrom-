"use client";

import { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Crosshair,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Map,
  PenLine,
} from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { GetStarted, SignIn } from "./Ctas";
import ProductPreview from "./ProductPreview";
import BrandLogo from "../BrandLogo";

const ease = [0.22, 1, 0.36, 1];

const capabilities = [
  { icon: LayoutDashboard, label: "Industry insights" },
  { icon: Map, label: "Career roadmaps" },
  { icon: FileText, label: "Resume builder" },
  { icon: PenLine, label: "Cover letters" },
  { icon: GraduationCap, label: "Interview prep" },
  { icon: Crosshair, label: "Job matcher" },
];

const showcases = [
  {
    index: "01",
    title: "A roadmap that starts where you are.",
    body: "Name the role you want, your stage, and what you have already done. Mentora turns that into phases and a next action, including if you are still a student or changing fields.",
    panel: <RoadmapPanel />,
  },
  {
    index: "02",
    title: "Application materials, written for one role.",
    body: "Build a resume from your experience, improve the draft, and generate a cover letter aimed at the job in front of you.",
    panel: <MaterialsPanel />,
  },
  {
    index: "03",
    title: "See the gap before you apply.",
    body: "Compare your resume with a job description, then practice with industry-specific interview questions and review how you scored.",
    panel: <MatchPanel />,
  },
];

const steps = [
  {
    title: "Set your starting point",
    body: "Add your industry, specialization, years of experience, and skills. That profile is what the dashboard and the rest of the workspace use.",
  },
  {
    title: "Choose the move",
    body: "Describe the role you want, where you are aiming, and the education or projects you already have. Mentora builds a roadmap from that.",
  },
  {
    title: "Prepare the application",
    body: "Improve the resume, write the cover letter, take an interview quiz, and check how your resume lines up with a posting.",
  },
];

const features = [
  {
    icon: LayoutDashboard,
    title: "Industry dashboard",
    body: "Growth, demand, market outlook, top skills, and what to learn next for the field you selected.",
  },
  {
    icon: Map,
    title: "Career roadmap",
    body: "A phased path from your current stage to the role, with one next action to take.",
  },
  {
    icon: FileText,
    title: "Resume builder",
    body: "Structure your experience, then ask for an improved draft you can keep editing.",
  },
  {
    icon: PenLine,
    title: "Cover letters",
    body: "Generate a letter for a specific role and refine it before you send it.",
  },
  {
    icon: GraduationCap,
    title: "Interview prep",
    body: "Industry-specific questions, saved results, and a view of how your sessions are going.",
  },
  {
    icon: Crosshair,
    title: "Job matcher",
    body: "Upload a resume, paste a job description, and review matched skills against the gaps.",
  },
];

const moments = [
  {
    icon: Map,
    title: "Changing fields",
    body: "Put the target role in your own words. The roadmap looks at credentials, projects, and the gap from where you are now.",
  },
  {
    icon: FileText,
    title: "Applying this week",
    body: "Tighten the resume, write the cover letter, and run the job matcher against the posting before you submit.",
  },
  {
    icon: GraduationCap,
    title: "The day before",
    body: "Take a mock interview for your industry and read the result so thin answers are obvious while you can still practice.",
  },
];

const questions = [
  {
    value: "after-signup",
    question: "What happens after I create an account?",
    answer:
      "You complete a short profile: industry, specialization, experience, and skills. Mentora then opens a dashboard of insights for that field.",
  },
  {
    value: "workspace",
    question: "What can I do in the workspace?",
    answer:
      "Review industry insights, generate a career roadmap, build and improve a resume, write a cover letter, take interview quizzes, and compare your resume with a job description.",
  },
  {
    value: "experience",
    question: "Do I have to be an experienced hire?",
    answer:
      "No. The roadmap asks whether you are a student, a recent graduate, changing careers, or already working, and it starts from that point.",
  },
  {
    value: "saved",
    question: "Where is my work saved?",
    answer:
      "Roadmaps, resumes, cover letters, and interview results are saved to your account after you sign in.",
  },
];

function Reveal({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease }}
    >
      {children}
    </motion.div>
  );
}

function SectionIntro({ eyebrow, title, body }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">{title}</h2>
      {body ? <p className="mt-4 text-base leading-7 text-zinc-400">{body}</p> : null}
    </div>
  );
}

function RoadmapPanel() {
  const phases = [
    ["Clarify the goal", "The role, in your words"],
    ["Map the gap", "Skills and credentials still missing"],
    ["Next action", "One concrete move, not a list of advice"],
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Career roadmap</span>
        <span>Sample</span>
      </div>
      <ol className="mt-6 space-y-4">
        {phases.map(([title, detail], index) => (
          <li key={title} className="flex gap-3">
            <span
              className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] ${
                index === 1 ? "bg-white text-[#12141a]" : "border border-white/15 text-zinc-500"
              }`}
            >
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-white">{title}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function MaterialsPanel() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-xs text-zinc-500">Resume</p>
        <p className="mt-3 text-sm font-medium text-white">Summary</p>
        <div className="mt-3 space-y-2" aria-hidden="true">
          <span className="block h-1.5 w-full rounded-full bg-white/15" />
          <span className="block h-1.5 w-4/5 rounded-full bg-white/10" />
          <span className="block h-1.5 w-3/5 rounded-full bg-white/10" />
        </div>
        <p className="mt-5 text-sm font-medium text-white">Experience</p>
        <div className="mt-3 space-y-2" aria-hidden="true">
          <span className="block h-1.5 w-2/3 rounded-full bg-white/15" />
          <span className="block h-1.5 w-full rounded-full bg-white/10" />
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-[#10141c] p-5">
        <p className="text-xs text-zinc-500">Cover letter</p>
        <p className="mt-4 text-sm leading-6 text-zinc-300">
          Opening tied to the role, then two proofs from your experience, then a close that asks for the conversation.
        </p>
        <p className="mt-6 text-[11px] uppercase tracking-[0.16em] text-zinc-600">Draft for one posting</p>
      </div>
    </div>
  );
}

function MatchPanel() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Job match</span>
        <span>Sample</span>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-white">On your resume</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["SQL", "Stakeholder updates", "Dashboards"].map((skill) => (
              <span key={skill} className="rounded-full bg-white px-2.5 py-1 text-[11px] text-[#12141a]">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-white">Still missing</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["System design", "Experimentation"].map((skill) => (
              <span key={skill} className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-zinc-400">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketBars() {
  const bars = [42, 58, 50, 74, 66, 90, 78];

  return (
    <div className="mt-8 flex h-16 items-end gap-1.5" aria-hidden="true">
      {bars.map((height, index) => (
        <motion.span
          key={height}
          className="w-full rounded-sm bg-white/70"
          style={{ opacity: 0.35 + index * 0.08 }}
          initial={{ height: 4 }}
          whileInView={{ height: `${height}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.04, ease }}
        />
      ))}
    </div>
  );
}

export default function LandingPage() {
  useEffect(() => {
    const previous = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#07080d";
    document.documentElement.classList.add("scroll-smooth");
    return () => {
      document.body.style.backgroundColor = previous;
      document.documentElement.classList.remove("scroll-smooth");
    };
  }, []);

  const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
  };

  return (
    <MotionConfig reducedMotion="user">
    <div className="relative overflow-x-hidden bg-[#07080d] text-white [color-scheme:dark]">
      <div aria-hidden="true" className="premium-blue-glow pointer-events-none absolute inset-0 opacity-90" />
      <section className="relative px-6 pb-16 pt-28 sm:pb-24 sm:pt-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, black 15%, transparent 72%)",
          }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[min(760px,90vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(148,168,196,0.16),transparent_68%)] blur-2xl"
          animate={{ opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <motion.div
            initial={false}
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
            }}
          >
            <motion.p variants={item} className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
              AI career guidance
            </motion.p>
            <motion.span
              aria-hidden="true"
              variants={item}
              className="mt-4 block h-px w-14 origin-left bg-white/50"
            />
            <motion.h1
              variants={item}
              className="mt-5 max-w-xl text-[2.55rem] font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.35rem]"
            >
              From the role you want
              <span className="mt-1 block text-zinc-500">to a plan you can follow.</span>
            </motion.h1>
            <motion.p variants={item} className="mt-6 max-w-md text-base leading-7 text-zinc-400">
              Mentora is a career workspace. Set your industry and background, then build a roadmap, resume, and cover letter, practice interview questions, and compare your resume with a role.
            </motion.p>
            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-2">
              <GetStarted>Get started</GetStarted>
              <a
                href="#product"
                className="inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium text-zinc-300 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                See the product
              </a>
            </motion.div>
          </motion.div>

          <ProductPreview />
        </div>
      </section>

      <div className="border-y border-white/10">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-y-3 px-6 py-5 sm:grid-cols-3 lg:grid-cols-6">
          {capabilities.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2.5 text-sm text-zinc-400">
              <Icon className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>

      <section id="product" className="scroll-mt-24 px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionIntro
              eyebrow="Product"
              title="The work of a job search, in one place."
              body="Each part uses the same account. You move from a plan, to the documents, to practice, without starting over in a new tool."
            />
          </Reveal>

          <div className="mt-8">
            {showcases.map((item, index) => (
              <Reveal key={item.index}>
                <article className="grid items-center gap-10 border-t border-white/10 py-14 lg:grid-cols-2 lg:gap-20 lg:py-16">
                  <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
                    <p className="font-mono text-xs text-zinc-600">{item.index}</p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">{item.title}</h3>
                    <p className="mt-4 max-w-md text-base leading-7 text-zinc-400">{item.body}</p>
                  </div>
                  <div className={index % 2 === 1 ? "lg:order-1" : undefined}>{item.panel}</div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="scroll-mt-24 border-t border-white/10 px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionIntro eyebrow="Workflow" title="Three steps. Then the work is specific." />
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal key={step.title} className="h-full">
                <article className="h-full bg-[#07080d] p-6 sm:p-8">
                  <p className="font-mono text-xs text-zinc-600">0{index + 1}</p>
                  <h3 className="mt-6 text-lg font-medium text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{step.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-24 px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionIntro
              eyebrow="Features"
              title="What opens after you sign in."
              body="Nothing here is a teaser. These are the tools in the workspace today."
            />
          </Reveal>
          <div className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Reveal key={feature.title}>
                  <article className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-sky-300/20 hover:bg-sky-400/[0.04]">
                    <Icon className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                    <h3 className="mt-5 text-base font-medium text-white">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{feature.body}</p>
                    {feature.title === "Industry dashboard" ? <MarketBars /> : null}
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionIntro eyebrow="In practice" title="Use it at the moment you need it." />
          </Reveal>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {moments.map((moment) => {
              const Icon = moment.icon;
              return (
                <Reveal key={moment.title}>
                  <article className="border-t border-white/15 pt-6">
                    <Icon className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                    <h3 className="mt-4 text-lg font-medium text-white">{moment.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">{moment.body}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="questions" className="scroll-mt-24 border-t border-white/10 px-6 py-24 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <SectionIntro eyebrow="Questions" title="Before you create an account." />
          </Reveal>
          <Reveal>
            <Accordion type="single" collapsible className="border-t border-white/10">
              {questions.map((item) => (
                <AccordionItem key={item.value} value={item.value} className="border-white/10">
                  <AccordionTrigger className="py-5 text-left text-base text-white hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="max-w-xl pb-5 text-sm leading-6 text-zinc-400">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      <section className="px-6 pb-24">
        <Reveal className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 transition-colors duration-300 hover:border-sky-300/20 sm:px-14">
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
                maskImage: "radial-gradient(ellipse at center, black 10%, transparent 70%)",
              }}
            />
            <div className="relative max-w-xl">
              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
                Start with the role in mind.
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-400">
                Create an account, set your background, and open a workspace you can return to.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <GetStarted>Create your workspace</GetStarted>
                <SignIn />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 sm:flex-row sm:justify-between">
          <div>
            <BrandLogo />
            <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500">
              Career guidance for the roadmap, the application, and the interview.
            </p>
          </div>
          <div className="flex gap-14 text-sm">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">Product</p>
              <a className="block text-zinc-400 transition-colors hover:text-white" href="#product">Overview</a>
              <a className="block text-zinc-400 transition-colors hover:text-white" href="#workflow">Workflow</a>
              <a className="block text-zinc-400 transition-colors hover:text-white" href="#features">Features</a>
            </div>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">Account</p>
              <a className="block text-zinc-400 transition-colors hover:text-white" href="/sign-in">Sign in</a>
              <a className="block text-zinc-400 transition-colors hover:text-white" href="/sign-up">Create account</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <p className="mx-auto max-w-6xl px-6 py-5 text-xs text-zinc-600">© 2026 Mentora</p>
        </div>
      </footer>
    </div>
    </MotionConfig>
  );
}
