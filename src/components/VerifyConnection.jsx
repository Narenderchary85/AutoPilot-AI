import { motion, AnimatePresence } from "framer-motion";

const VerifyConnection = ({ isOpen, onVerify }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
        >
          <h2 className="text-lg font-semibold text-slate-800">
            Verify your email
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Your account is not verified yet. Please verify your email to
            continue using all features.
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onVerify}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
            >
              Verify Now
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VerifyConnection;
