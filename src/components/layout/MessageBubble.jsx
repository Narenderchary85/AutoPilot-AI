// components/chat/MessageBubble.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiUser, FiCheckCircle, FiAlertCircle, FiClock, FiCopy, FiChevronDown, FiExternalLink } from 'react-icons/fi';
import EnhancedResponseDisplay from '../chat/EnhancedResponseDisplay';

const MessageBubble = ({ message, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  // Animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      x: isUser ? 50 : -50,
      scale: 0.9 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: index * 0.05
      }
    }
  };

  const bubbleVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 15 }
    }
  };
  console.log(message)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return <FiCheckCircle className="text-green-500" size={14} />;
      case 'failed':
      case 'error':
        return <FiAlertCircle className="text-red-500" size={14} />;
      case 'processing':
      case 'pending':
        return <FiClock className="text-yellow-500" size={14} />;
      default:
        return null;
    }
  };

  const formatTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAgentType = () => {
    if (!message.meta?.details?.agent) return 'AutoPilot AI';
    
    const agent = message.meta.details.agent;
    return agent.charAt(0).toUpperCase() + agent.slice(1) + ' Agent';
  };

  function extractReadableText(response) {
    console.log("RAW RESPONSE:", response);
  
    let text = "";
  
    // 1️⃣ If response is a string
    if (typeof response === "string") {
      text = response;
    }
  
    // 2️⃣ If response is an object
    else if (typeof response === "object" && response !== null) {
      if (typeof response.message === "string") {
        text = response.message;
      } else if (typeof response.emails === "string") {
        text = response.emails;
      } else if (typeof response.text === "string") {
        text = response.text;
      } else {
        // Last resort: stringify object
        text = JSON.stringify(response);
      }
    }
  
    // 3️⃣ CLEAN THE TEXT (MOST IMPORTANT PART)
    return cleanReadableText(text);
  }

  function cleanReadableText(text) {
    if (!text) return "";
  
    return text
      // Remove JSON braces
      .replace(/^{|}$/g, "")
      // Remove quotes around entire string
      .replace(/^"+|"+$/g, "")
      // Remove escaped newlines
      .replace(/\\n/g, "\n")
      // Remove escaped quotes
      .replace(/\\"/g, '"')
      // Remove excessive colons used in JSON
      .replace(/"\s*:\s*"/g, " ")
      // Collapse multiple spaces
      .replace(/\s{2,}/g, " ")
      // Fix multiple newlines
      .replace(/\n{3,}/g, "\n\n")
      // Trim
      .trim();
  }
  

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 group`}
    >
      <div className={`flex max-w-2xl gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar with animation */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`relative mt-1 h-8 w-8 rounded-full flex items-center justify-center
                      shadow-sm ${isUser ? 'bg-gradient-to-br from-slate-800 to-slate-900' 
                        : 'bg-gradient-to-br from-[#6264a7] to-[#505ac9]'}`}
        >
          {isUser ? (
            <FiUser className="text-white text-sm" />
          ) : (
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FiCpu className="text-white text-sm" />
            </motion.div>
          )}
          
          {/* Online indicator for agent */}
          {!isUser && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white"
            />
          )}
        </motion.div>

        {/* Message bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%]`}>
          {/* Agent label for AI messages */}
          {!isUser && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-1 ml-1"
            >
              <span className="text-xs font-semibold text-[#6264a7]">
                {getAgentType()}
              </span>
              {message.meta?.status && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  {getStatusIcon(message.meta.status)}
                  <span className="font-medium">{message.meta.status}</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Bubble container */}
          <motion.div
            variants={bubbleVariants}
            className={`relative rounded-2xl shadow-sm overflow-hidden
                        ${isUser 
                          ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white' 
                          : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200'
                        }`}
          >
            {/* Animated background for AI messages */}
            {!isUser && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              />
            )}

            {/* Message content */}
            <div className="relative z-10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm leading-relaxed whitespace-pre-line">
                <p className="text-sm leading-relaxed whitespace-pre-line">
                {extractReadableText(message)}
                </p>
                </div>
                
                {/* Action buttons */}
                <div className={`flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                ${isUser ? 'flex-row' : 'flex-row-reverse'}`}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={copyToClipboard}
                    className={`p-1.5 rounded-lg ${
                      isUser 
                        ? 'bg-white/10 hover:bg-white/20' 
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    <FiCopy size={12} className={copied ? 'text-green-500' : 'text-slate-500'} />
                  </motion.button>
                </div>
              </div>

              {/* Status details if available */}
              {message.meta?.details && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`flex items-center gap-1 mt-3 text-xs font-medium px-2 py-1 rounded-lg
                              ${isUser 
                                ? 'bg-white/10 text-white/80 hover:bg-white/20' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                  >
                    <span>Details</span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiChevronDown size={12} />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className={`mt-3 p-3 rounded-lg border text-xs ${
                          isUser ? 'border-white/20' : 'border-slate-200'
                        }`}>
                          <div className="grid grid-cols-2 gap-2">
                            {message.meta.status && (
                              <div>
                                <div className="text-slate-500 mb-1">Status</div>
                                <div className="font-medium flex items-center gap-1">
                                  {getStatusIcon(message.meta.status)}
                                  {message.meta.status}
                                </div>
                              </div>
                            )}
                            {message.meta.details.agent && (
                              <div>
                                <div className="text-slate-500 mb-1">Agent</div>
                                <div className="font-medium text-[#6264a7]">
                                  {message.meta.details.agent}
                                </div>
                              </div>
                            )}
                            {message.meta.details.timestamp && (
                              <div>
                                <div className="text-slate-500 mb-1">Timestamp</div>
                                <div className="font-medium">
                                  {new Date(message.meta.details.timestamp).toLocaleTimeString()}
                                </div>
                              </div>
                            )}
                            {message.meta.details.duration && (
                              <div>
                                <div className="text-slate-500 mb-1">Duration</div>
                                <div className="font-medium">
                                  {message.meta.details.duration}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {message.meta.details.additionalInfo && (
                            <div className="mt-2 pt-2 border-t border-slate-200">
                              <div className="text-slate-500 mb-1">Additional Info</div>
                              <pre className="text-xs overflow-x-auto p-2 bg-slate-50 rounded">
                                {JSON.stringify(message.meta.details.additionalInfo, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </motion.div>

          {/* Footer with timestamp and copy feedback */}
          <div className="flex items-center gap-3 mt-1 ml-1">
            <span className="text-[10px] text-slate-400 font-medium">
              {formatTimestamp()}
            </span>
            
            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1 text-[10px] text-green-600"
                >
                  <FiCheckCircle size={10} />
                  <span>Copied!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Decorative elements for AI messages */}
      {!isUser && (
        <div className="absolute left-1/4 -translate-x-1/2 -z-10">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.05, 0.1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-32 h-32 rounded-full bg-gradient-to-r from-[#f3f4ff] to-transparent blur-xl"
          />
        </div>
      )}
    </motion.div>
  );
};

export default MessageBubble;