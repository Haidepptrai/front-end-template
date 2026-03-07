import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '@/constants/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    closed: {
      x: '100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    opened: {
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  } as const;

  return (
    <nav className="relative flex items-center justify-between bg-white px-6 py-4 shadow-md">
      {/* Logo Section */}
      <div className="text-xl font-bold text-gray-800">JRM</div>

      {/* Desktop Navigation */}
      <ul className="hidden space-x-8 md:flex">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-medium text-gray-600 transition-colors duration-200 hover:text-blue-500"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Hamburger Icon (Visible on Mobile/Tablet) */}
      <button
        onClick={toggleMenu}
        className="z-50 block focus:outline-none md:hidden"
        aria-label="Toggle Menu"
      >
        <div className="space-y-1.5">
          <span
            className={`block h-0.5 w-6 bg-gray-800 transition-transform ${isOpen ? 'translate-y-2 rotate-45' : ''}`}
          />
          <span
            className={`block h-0.5 w-6 bg-gray-800 transition-opacity ${isOpen ? 'opacity-0' : 'opacity-100'}`}
          />
          <span
            className={`block h-0.5 w-6 bg-gray-800 transition-transform ${isOpen ? '-translate-y-2 -rotate-45' : ''}`}
          />
        </div>
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            />

            {/* Slide-in Menu (Right to Left) */}
            <motion.div
              initial="closed"
              animate="opened"
              exit="closed"
              variants={menuVariants}
              className="fixed top-0 right-0 z-40 h-full w-64 bg-white p-8 shadow-xl md:hidden"
            >
              <ul className="mt-16 flex flex-col space-y-6">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={toggleMenu}
                      className="block text-lg font-semibold text-gray-700 hover:text-blue-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
