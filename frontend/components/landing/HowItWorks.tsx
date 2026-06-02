"use client";

import { motion } from "framer-motion";
import { Upload, Search, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your PDF",
    desc: "Drag and drop any PDF document. Our system automatically processes and indexes it using ChromaDB vector storage.",
    step: "01",
  },
  {
    icon: Search,
    title: "AI Retrieves Context",
    desc: "When you ask a question, Jina AI embeddings find the most relevant chunks from your documents with semantic search.",
    step: "02",
  },
  {
    icon: MessageSquare,
    title: "Get Accurate Answers",
    desc: "DeepSeek V4 generates answers strictly from your document context, with exact source citations for every response.",
    step: "03",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            How It{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Three simple steps to unlock your document intelligence.
          </p>
        </motion.div>

        <div className="relative grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20">
                <step.icon className="h-7 w-7 text-blue-400" />
              </div>
              <div className="mb-2 text-sm font-mono text-muted-foreground">
                {step.step}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                {step.desc}
              </p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[calc(80%)] h-[1px] bg-gradient-to-r from-blue-500/20 to-purple-600/20" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
