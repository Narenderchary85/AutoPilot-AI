import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCpu,
  FiUser,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiCopy,
  FiChevronDown,
} from "react-icons/fi";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

const MessageBubble = ({ message, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const isUser = message.role === "user";

  const containerVariants = {
    hidden: {
      opacity: 0,
      x: isUser ? 50 : -50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: index * 0.05,
      },
    },
  };

  const bubbleVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 15 },
    },
  };

  // ✅ Extract readable content (simplified)
  const extractContent = () => {
    if (typeof message === "string") return message;
    if (message?.text) return message.text;
    if (message?.content) return message.content;
    return "";
  };

  const content = extractContent();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3 group`}
    >
      <div
        className={`flex max-w-3xl gap-3 ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`relative mt-1 h-8 w-8 rounded-full flex items-center justify-center shadow-sm ${
            isUser
              ? "bg-gradient-to-br from-slate-800 to-slate-900"
              : "bg-gradient-to-br from-[#6264a7] to-[#505ac9]"
          }`}
        >
          {isUser ? (
            <FiUser className="text-white text-sm" />
          ) : (
            <FiCpu className="text-white text-sm" />
          )}
        </motion.div>

        {/* Bubble */}
        <div
          className={`flex flex-col ${
            isUser ? "items-end" : "items-start"
          } max-w-[90%]`}
        >
          <motion.div
            variants={bubbleVariants}
            className={`relative rounded-2xl shadow-sm overflow-hidden ${
              isUser
                ? "bg-gradient-to-r from-slate-800 to-slate-900 text-white"
                : "bg-white border border-slate-200"
            }`}
          >
            <div className="relative z-10 p-4">
              <div className="flex justify-between gap-3">
                {/* ✅ Markdown Rendering */}
                <div
                  className={`prose prose-sm max-w-none ${
                    isUser ? "prose-invert" : ""
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      code({ inline, className, children, ...props }) {
                        return !inline ? (
                          <pre className="rounded-lg p-3 overflow-x-auto bg-slate-900 text-sm">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        ) : (
                          <code className="bg-slate-200 px-1 py-0.5 rounded text-sm">
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>

                {/* Copy Button */}
                <div className="opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={copyToClipboard}
                    className={`p-1.5 rounded-lg ${
                      isUser
                        ? "bg-white/10 hover:bg-white/20"
                        : "bg-slate-100 hover:bg-slate-200"
                    }`}
                  >
                    <FiCopy
                      size={12}
                      className={copied ? "text-green-500" : "text-slate-500"}
                    />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Timestamp */}
          <div className="flex items-center gap-3 mt-1 ml-1">
            <span className="text-[10px] text-slate-400 font-medium">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

            {copied && (
              <div className="flex items-center gap-1 text-[10px] text-green-600">
                <FiCheckCircle size={10} />
                <span>Copied!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;