"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./sidebar";
import { motion, AnimatePresence } from "framer-motion";

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between border-b border-border-light bg-bg-secondary px-4 md:hidden">
      <div className="flex items-center">
        <span className="font-bold text-xl tracking-tight text-primary">ApplyFlow</span>
        <span className="font-bold text-xl tracking-tight text-text-primary ml-1">AI</span>
      </div>
      <button onClick={() => setIsOpen(true)} className="p-2 -mr-2 text-text-primary">
        <Menu className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-50 w-72 bg-bg-secondary shadow-2xl md:hidden"
            >
              <button 
                onClick={() => setIsOpen(false)} 
                className="absolute right-4 top-4 z-50 p-2 text-text-secondary hover:text-text-primary bg-bg-primary rounded-full border border-border-light shadow-sm"
              >
                <X className="h-5 w-5" />
              </button>
              {/* Wrapping Sidebar in a div that closes the menu when clicked anywhere inside (e.g. a link) */}
              <div onClick={() => setIsOpen(false)} className="h-full w-full">
                <Sidebar className="w-full flex h-full border-l border-r-0" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
