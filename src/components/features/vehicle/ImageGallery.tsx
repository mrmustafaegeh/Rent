"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface ImageGalleryProps {
  images: string[]
  title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  
  // Use placeholder if no images
  const displayImages = images.length > 0 ? images : ["/images/car-placeholder.jpg"]

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-gray-100 border border-gray-200 shadow-sm group">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
             <Image
                src={displayImages[selectedIndex]}
                alt={`${title} - View ${selectedIndex + 1}`}
                fill
                className="object-cover"
                priority
             />
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
            <>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-navy rounded-full h-8 w-8 md:h-10 md:w-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300"
                    onClick={prevImage}
                >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-navy rounded-full h-8 w-8 md:h-10 md:w-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300"
                    onClick={nextImage}
                >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </Button>
            </>
        )}
      </div>
      
      {displayImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide px-1">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative aspect-[16/10] w-24 md:w-32 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300",
                selectedIndex === index ? "border-gold scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
              )}
            >
              <Image
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
