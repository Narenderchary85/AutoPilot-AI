import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiPaperclip, FiZap, FiMail, FiCalendar, FiGlobe } from 'react-icons/fi';

import LoadingTimeline from '../chat/LoadingTimeline';
import MessageBubble from './MessageBubble';

const API_URL = 'http://localhost:8000/chat';

const CenterPanel = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await axios.post(API_URL,{ message: userMsg.text }, { // Third argument: Config object (includes headers)
        headers: { 
          "Authorization": `Bearer ${localStorage.getItem('token')}` 
        }
      });
      const reply = data?.reply;
      const status = reply?.status;
      const details = reply?.details;

      const agentText = details?.message || JSON.stringify(reply, null, 2);
      const agentMsg = {
        role: 'agent',
        text: agentText,
        meta: { status, details },
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, agentMsg]);
        setLoading(false);
      }, 800); 
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          text: 'Something went wrong talking to AutoPilot backend.',
        },
      ]);
      setLoading(false);
    }
  };
  

  const suggestions = [
    { text: "Read my unread emails from today", icon: FiMail },
    { text: "Add standup tomorrow at 10am", icon: FiCalendar },
    { text: "Summarize latest AI news", icon: FiGlobe },
    { text: "Send email to team about meeting", icon: FiMail },
  ];

  return (
    <div className="flex-1 flex flex-col items-center bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full max-w-3xl flex-1 flex flex-col px-4 py-6 gap-4">
        <AnimatePresence>
          {messages.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#f3f4ff] to-white border border-[#e0e2ff] mb-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="p-1 rounded-full bg-[#6264a7]"
                >
                  <FiZap className="text-white text-xs" />
                </motion.div>
                <span className="text-xs font-semibold tracking-[0.25em] text-[#6264a7] uppercase">
                  Autopilot AI Assistant
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-4xl md:text-5xl font-bold mt-4 bg-gradient-to-r from-slate-900 via-[#6264a7] to-slate-900 bg-clip-text text-transparent"
              >
                Your Intelligent Task Manager
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-sm text-slate-600 mt-4 max-w-2xl mx-auto leading-relaxed"
              >
                Automate email, calendar, and web tasks with natural language commands.
                Autopilot intelligently routes requests to specialized sub‑agents in real‑time.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="flex justify-center gap-8 mt-8"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#6264a7]">3</div>
                  <div className="text-xs text-slate-500">Specialized Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#6264a7]">24/7</div>
                  <div className="text-xs text-slate-500">Active Monitoring</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#6264a7]">99%</div>
                  <div className="text-xs text-slate-500">Task Accuracy</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mt-10"
              >
                <p className="text-xs font-medium text-slate-500 mb-3">TRY SAYING:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {suggestions.map((suggestion, index) => {
                    const Icon = suggestion.icon;
                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setInput(suggestion.text)}
                        className="group flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium
                                 bg-white border border-slate-200 hover:border-[#6264a7]/30 
                                 hover:bg-gradient-to-r hover:from-[#f3f4ff] hover:to-white
                                 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Icon className="text-[#6264a7] group-hover:scale-110 transition-transform" />
                        <span className="text-slate-700 group-hover:text-slate-900">
                          {suggestion.text}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          <AnimatePresence mode="wait">
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} message={msg} index={idx} />
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <LoadingTimeline />
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-4"
        >
          <motion.div
            whileHover={{ scale: 1.005 }}
            className="relative bg-white border border-slate-200 rounded-2xl
                      shadow-lg flex items-center gap-2 px-4 py-3"
          >

            <motion.button
              type="button"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl
                         text-slate-500 hover:text-[#6264a7] hover:bg-[#f3f4ff]
                         border border-slate-200 hover:border-[#6264a7]/30"
            >
              <FiPaperclip size={18} />
            </motion.button>

            <motion.div
              className="flex-1"
              whileFocus={{ scale: 1.01 }}
            >
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Autopilot to manage email, calendar, or web tasks…"
                className="w-full resize-none border-none bg-transparent outline-none 
                           text-sm placeholder:text-slate-400 focus:placeholder:text-slate-300
                           min-h-[40px] max-h-[120px] py-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            </motion.div>
             <motion.button
              type="submit"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(98, 100, 167, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden group flex items-center gap-2 px-5 py-2.5 
                         rounded-xl text-sm font-semibold bg-gradient-to-r from-[#6264a7] to-[#505ac9] 
                         text-white disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={!input.trim() || loading}
            >
              <motion.span
                animate={loading ? { x: [-10, 10, -10] } : { x: 0 }}
                transition={loading ? { repeat: Infinity, duration: 1 } : {}}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                style={{ translateX: '-100%' }}
              />
              <span className="relative z-10">
                {loading ? 'Processing...' : 'Send'}
              </span>
              <motion.div
                animate={loading ? { rotate: 360 } : {}}
                transition={loading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                className="relative z-10"
              >
                <FiSend size={16} />
              </motion.div>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 mt-3"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
            <p className="text-[11px] text-slate-400">
              Autopilot is ready • Agents: <span className="text-[#6264a7] font-medium">Email</span>, 
              <span className="text-[#6264a7] font-medium ml-1">Calendar</span>, 
              <span className="text-[#6264a7] font-medium ml-1">Web</span>
            </p>
          </motion.div>
        </motion.form>
      </div>

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-[#f3f4ff] to-transparent rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-[#f3f4ff] to-transparent rounded-full blur-3xl opacity-20"
        />
      </div>
    </div>
  );
};

export default CenterPanel;