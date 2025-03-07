import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Layout, Users, Clock, Star, Check, ChevronDown } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 mr-2 text-primary"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M7 7h.01" />
              <path d="M7 12h.01" />
              <path d="M7 17h.01" />
              <path d="M11 7h6" />
              <path d="M11 12h6" />
              <path d="M11 17h6" />
            </svg>
            <span className="text-xl font-bold">KanFlow</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 relative">
        <section className="w-full h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-primary/5 to-transparent pointer-events-none" />
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Manage your projects with ease
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  KanFlow helps you organize tasks, track progress, and collaborate with your team. Create boards,
                  manage tasks, and stay on top of your projects with our intuitive interface.
                </p>
              </div>
              <div className="flex justify-center w-full">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Layout className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Intuitive Boards</h3>
                  <p className="text-sm text-gray-500 text-center">Easy-to-use kanban boards</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Team Collaboration</h3>
                  <p className="text-sm text-gray-500 text-center">Work together seamlessly</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Real-time Updates</h3>
                  <p className="text-sm text-gray-500 text-center">Stay in sync with your team</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Premium Features</h3>
                  <p className="text-sm text-gray-500 text-center">Advanced tools for teams</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Trusted by Teams Worldwide</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of teams who use KanFlow to streamline their workflow
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
              {[
                {
                  quote: "KanFlow has transformed how our team collaborates. The intuitive interface and powerful features make project management a breeze.",
                  author: "Sarah Johnson",
                  role: "Product Manager at TechCorp"
                },
                {
                  quote: "The best project management tool we've used. It's simple yet powerful, and the real-time updates keep everyone in sync.",
                  author: "Michael Chen",
                  role: "Engineering Lead at StartupX"
                },
                {
                  quote: "KanFlow helped us increase productivity by 40%. The customizable workflows are exactly what we needed.",
                  author: "Emily Rodriguez",
                  role: "Operations Director at ScaleUp"
                }
              ].map((testimonial, i) => (
                <div key={i} className="flex flex-col justify-between space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                  <p className="text-gray-500 italic">{testimonial.quote}</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Simple, Transparent Pricing</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that's right for your team
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
              {[
                {
                  name: "Free",
                  price: "$0",
                  description: "Perfect for individuals and small teams",
                  features: ["Up to 3 boards", "Basic task management", "Core features"]
                },
                {
                  name: "Pro",
                  price: "$12",
                  description: "Great for growing teams",
                  features: ["Unlimited boards", "Advanced analytics", "Priority support", "Team collaboration"]
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  description: "For large organizations",
                  features: ["Custom workflows", "Enterprise security", "Dedicated support", "Advanced integrations"]
                }
              ].map((plan, i) => (
                <div key={i} className="flex flex-col justify-between space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.price !== "Custom" && <span className="text-gray-500 ml-1">/month</span>}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={i === 1 ? "default" : "outline"}>
                    Get Started
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Frequently Asked Questions</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to know about KanFlow
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl mt-12">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "How does KanFlow help with project management?",
                    answer: "KanFlow provides intuitive kanban boards, real-time collaboration features, and powerful task management tools to help teams stay organized and productive."
                  },
                  {
                    question: "Can I try KanFlow before subscribing?",
                    answer: "Yes! You can start with our free plan that includes all core features and up to 3 boards. No credit card required."
                  },
                  {
                    question: "Is there a limit to team members?",
                    answer: "The free plan supports up to 5 team members. Pro and Enterprise plans offer unlimited team members."
                  },
                  {
                    question: "What kind of support do you offer?",
                    answer: "We offer email support for all plans, with priority support for Pro users and dedicated support for Enterprise customers."
                  }
                ].map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <section className="w-full py-20 bg-primary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
                <p className="max-w-[600px] md:text-xl/relaxed">
                  Join thousands of teams already using KanFlow to improve their productivity
                </p>
              </div>
              <div className="flex flex-col gap-4 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Start for Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-12 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-sm text-gray-500 hover:text-gray-900">Features</Link></li>
                <li><Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900">Pricing</Link></li>
                <li><Link href="/integrations" className="text-sm text-gray-500 hover:text-gray-900">Integrations</Link></li>
                <li><Link href="/changelog" className="text-sm text-gray-500 hover:text-gray-900">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-gray-500 hover:text-gray-900">About</Link></li>
                <li><Link href="/blog" className="text-sm text-gray-500 hover:text-gray-900">Blog</Link></li>
                <li><Link href="/careers" className="text-sm text-gray-500 hover:text-gray-900">Careers</Link></li>
                <li><Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/docs" className="text-sm text-gray-500 hover:text-gray-900">Documentation</Link></li>
                <li><Link href="/help" className="text-sm text-gray-500 hover:text-gray-900">Help Center</Link></li>
                <li><Link href="/guides" className="text-sm text-gray-500 hover:text-gray-900">Guides</Link></li>
                <li><Link href="/api" className="text-sm text-gray-500 hover:text-gray-900">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">Privacy</Link></li>
                <li><Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">Terms</Link></li>
                <li><Link href="/security" className="text-sm text-gray-500 hover:text-gray-900">Security</Link></li>
                <li><Link href="/cookies" className="text-sm text-gray-500 hover:text-gray-900">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-center text-sm text-gray-500 md:text-left">
                © 2024 KanFlow. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <Link href="https://twitter.com" className="text-gray-500 hover:text-gray-900">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="https://github.com" className="text-gray-500 hover:text-gray-900">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="https://linkedin.com" className="text-gray-500 hover:text-gray-900">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

