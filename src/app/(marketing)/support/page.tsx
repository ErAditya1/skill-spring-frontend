'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { AiFillTwitterCircle } from 'react-icons/ai'
import { FaInstagramSquare } from 'react-icons/fa'
import { FaFacebook, FaLinkedin } from 'react-icons/fa6'
import { ImProfile } from "react-icons/im"
import { Mail, Phone, MessageCircle } from 'lucide-react'

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background text-foreground">

      <div className="max-w-6xl mx-auto px-4 py-16">

        {/* HERO SECTION */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Need Help? We're Here.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether it's course access, payments, or technical issues —
            our team is ready to assist you quickly and professionally.
          </p>
        </div>

        {/* SUPPORT OPTIONS GRID */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">

          {/* Email */}
          <div className="bg-card border rounded-2xl p-6 shadow-md hover:shadow-xl transition">
            <Mail className="mb-4 text-blue-500" size={28} />
            <h3 className="text-xl font-semibold mb-2">Email Support</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Get detailed help via email within 24 hours.
            </p>
            <a
              href="mailto:mradityaji2@gmail.com"
              className="text-blue-600 font-medium"
            >
              mradityaji2@gmail.com
            </a>
          </div>

          {/* Phone */}
          <div className="bg-card border rounded-2xl p-6 shadow-md hover:shadow-xl transition">
            <Phone className="mb-4 text-green-500" size={28} />
            <h3 className="text-xl font-semibold mb-2">Call Us</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Speak directly with support for urgent queries.
            </p>
            <p className="font-medium">+91 9473774390</p>
          </div>

          {/* Chat */}
          <div className="bg-card border rounded-2xl p-6 shadow-md hover:shadow-xl transition">
            <MessageCircle className="mb-4 text-purple-500" size={28} />
            <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Message us directly inside the platform.
            </p>
            <Link href="/chat?u=aditya">
              <Button className="rounded-xl">Start Chat</Button>
            </Link>
          </div>

        </div>

        {/* CONTACT FORM */}
        <div className="bg-card border rounded-3xl p-10 shadow-lg max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Send Us a Message
          </h2>

          <form className="space-y-6">

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Your Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Your Message
              </label>
              <textarea
                rows={5}
                className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full py-3 rounded-xl text-lg"
            >
              Send Message
            </Button>

          </form>
        </div>

        {/* SOCIAL MEDIA */}
        <div className="text-center mb-20">
          <h3 className="text-xl font-semibold mb-6">
            Connect With Us
          </h3>

          <div className="flex justify-center gap-8 text-4xl">
            <a href="https://www.facebook.com/adityakumar411/" target="_blank">
              <FaFacebook className="text-blue-600 hover:scale-110 transition" />
            </a>
            <a href="https://twitter.com/excited_adi" target="_blank">
              <AiFillTwitterCircle className="text-sky-500 hover:scale-110 transition" />
            </a>
            <a href="https://linkedin.com/in/adityaji1" target="_blank">
              <FaLinkedin className="text-blue-700 hover:scale-110 transition" />
            </a>
            <a href="https://www.instagram.com/excited_adi/" target="_blank">
              <FaInstagramSquare className="text-pink-600 hover:scale-110 transition" />
            </a>
          </div>
        </div>


      </div>
    </div>
  )
}

export default SupportPage
