import {motion, AnimatePresence } from "framer-motion";

export default function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Box */}
          <motion.div
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 z-10"
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition cursor-pointer"
            >
              ✕
            </button>

            {/* Title */}
            {title && (
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800">
                {title}
              </h2>
            )}

            {/* Content */}
            <div className="text-gray-700">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
