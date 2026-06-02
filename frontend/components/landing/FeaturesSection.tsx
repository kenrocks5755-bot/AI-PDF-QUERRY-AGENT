"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Shield,
  Zap,
  Search,
  FileText,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Advanced RAG Pipeline",
    desc: "LangGraph-powered retrieval augmented generation ensures accurate, context-aware answers.",
  },
  {
    icon: Shield,
    title: "No Hallucinations",
    desc: "Answers are strictly grounded in your document context. Never makes up information.",
  },
  {
    icon: Zap,
    title: "DeepSeek V4 Powered",
    desc: "Cutting-edge open-source LLM via OpenRouter for premium-quality responses.",
  },
  {
    icon: Search,
    title: "Smart Retrieval",
    desc: "ChromaDB vector search with Jina AI embeddings finds the most relevant document chunks.",
  },
  {
    icon: FileText,
    title: "Multi-PDF Support",
    desc: "Upload multiple documents and search across all of them simultaneously.",
  },
  {
    icon: Globe,
    title: "Deployed Anywhere",
    desc: "Backend on Render, frontend on Vercel. Fully cloud-native and scalable.",
  },
];

export function FeaturesSection() {
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
            Enterprise-Grade{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Architecture
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Built with the latest AI stack for production reliability and
            accuracy.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-xl p-6 hover:border-border/60 transition-colors"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20">
                <feature.icon className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
