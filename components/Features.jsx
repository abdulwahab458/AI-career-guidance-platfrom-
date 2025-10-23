"use client"
import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { features } from "@/data/features";
const Features = () => {
  return (
    <div>
      <section className="py-20 text-center bg-neutral-950 text-neutral-100">
          <div>
            <h2 className="text-4xl font-bold mb-16 z-20 relative tracking-tighter">
              Some of the features of our application
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto z-20 relative">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="flex flex-col items-center p-8 rounded-2xl bg-neutral-900 hover:bg-neutral-800 transition-all duration-300 shadow-lg"
              >
                <CardContent className="flex flex-col items-center text-center">
                  {/* Icon */}
                  <div className="mb-4">{feature.icon}</div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>

                  {/* Description */}
                  <p className="text-neutral-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
    </div>
  )
}

export default Features
