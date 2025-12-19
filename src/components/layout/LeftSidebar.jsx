import { useState } from 'react';
import { FiMail, FiCalendar, FiGlobe, FiTrendingUp, FiZap, FiActivity, FiUser, FiSettings } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const actions = [
  { id: 'read_emails', label: 'Read Emails', icon: FiMail, color: '#6264a7', count: 5 },
  { id: 'send_email', label: 'Send Email', icon: FiMail, color: '#505ac9', count: 12 },
  { id: 'add_event', label: 'Add Event', icon: FiCalendar, color: '#6264a7', count: 8 },
  { id: 'get_events', label: 'View Calendar', icon: FiCalendar, color: '#505ac9', count: 15 },
  { id: 'scrape_web', label: 'Web Scraper', icon: FiGlobe, color: '#6264a7', count: 3 },
  { id: 'latest_news', label: 'Latest News', icon: FiTrendingUp, color: '#505ac9', count: 7 },
];

const stats = [
  { label: 'Tasks Completed', value: '248', change: '+12%', icon: FiActivity },
  { label: 'Active Agents', value: '3', change: 'Online', icon: FiZap },
  { label: 'Response Time', value: '0.8s', change: '-0.2s', icon: FiTrendingUp },
];

const LeftSidebar = () => {
  const [activeAgent, setActiveAgent] = useState(null);

  const handleActionClick = (actionId) => {
    setActiveAgent(actionId);
    setTimeout(() => setActiveAgent(null), 2000);
  };

  return (
    <div className="flex flex-col w-full p-6 gap-8 bg-gradient-to-b from-white to-slate-50 border-r border-slate-200">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <motion.div
              animate={{ rotate: activeAgent ? 360 : 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6264a7] to-[#505ac9] 
                            flex items-center justify-center shadow-lg shadow-[#6264a7]/20">
                <FiZap className="text-white text-lg" />
              </div>
              {activeAgent && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white"
                />
              )}
            </motion.div>
            <div>
              <div className="text-xs font-semibold tracking-[0.2em] text-[#6264a7] uppercase">
                Autopilot
              </div>
              <h1 className="text-lg font-bold text-slate-900">
                Control Center
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 max-w-xs">
            Orchestrate email, calendar, and web agents with intelligent automation
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-xl bg-[#f3f4ff] text-[#6264a7] flex items-center justify-center
                     border border-[#e0e2ff] hover:border-[#6264a7]/30"
        >
          <FiSettings size={18} />
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Performance Metrics
          </div>
          <div className="text-xs text-[#6264a7] font-medium bg-[#f3f4ff] px-2 py-1 rounded-md">
            Live
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white p-3 rounded-xl border border-slate-200 hover:border-[#6264a7]/30
                          shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-[#f3f4ff]">
                    <Icon className="text-[#6264a7]" size={16} />
                  </div>
                  <div className={`text-xs font-semibold ${
                    stat.change.includes('+') ? 'text-green-600' : 
                    stat.change.includes('-') ? 'text-red-600' : 'text-[#6264a7]'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-lg font-bold text-slate-900">{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="flex-1"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Agent Actions
          </div>
          <motion.div
            animate={{ x: activeAgent ? [0, 5, 0] : 0 }}
            transition={{ repeat: activeAgent ? Infinity : 0, duration: 0.5 }}
            className="text-xs text-slate-400"
          >
            {activeAgent ? 'Processing...' : 'Ready'}
          </motion.div>
        </div>

        <div className="space-y-2">
          {actions.map((action, index) => {
            const Icon = action.icon;
            const isActive = activeAgent === action.id;
            
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ x: 8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleActionClick(action.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl
                          transition-all duration-200 relative overflow-hidden group
                          ${isActive 
                            ? 'bg-gradient-to-r from-[#6264a7] to-[#505ac9] text-white' 
                            : 'bg-white text-slate-700 hover:bg-[#f3f4ff] border border-slate-200 hover:border-[#6264a7]/30'
                          }`}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}

                <div className="flex items-center gap-3 relative z-10">
                  <motion.span
                    animate={isActive ? { rotate: 360 } : {}}
                    transition={isActive ? { duration: 0.5 } : {}}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg
                              ${isActive 
                                ? 'bg-white/20' 
                                : 'bg-[#f3f4ff] text-[#6264a7]'
                              }`}
                  >
                    <Icon size={16} />
                  </motion.span>
                  <span className="text-sm font-medium">{action.label}</span>
                </div>

                <div className="flex items-center gap-2 relative z-10">
                  {action.count > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`text-xs px-2 py-1 rounded-md ${
                        isActive 
                          ? 'bg-white/20' 
                          : 'bg-[#f3f4ff] text-[#6264a7]'
                      }`}
                    >
                      {action.count}
                    </motion.span>
                  )}
                  <motion.div
                    animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                    transition={isActive ? { repeat: Infinity, duration: 1 } : {}}
                    className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-white' : 'bg-green-500'
                    }`}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="mt-auto"
      >
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
          Agent Status
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="space-y-3">
            {[
              { name: 'Email Agent', status: 'active', color: 'bg-green-500', progress: 85 },
              { name: 'Calendar Agent', status: 'active', color: 'bg-green-500', progress: 72 },
              { name: 'Web Agent', status: 'idle', color: 'bg-slate-400', progress: 30 },
            ].map((agent, index) => (
              <div key={agent.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${agent.color}`} />
                      <span className="text-sm font-medium text-slate-700">{agent.name}</span>
                    </div>
                    <span className="text-xs text-slate-500">{agent.status}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#6264a7]">{agent.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.progress}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                    className={`h-full rounded-full ${
                      agent.status === 'active' 
                        ? 'bg-gradient-to-r from-[#6264a7] to-[#505ac9]' 
                        : 'bg-slate-400'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-500">Total Load</div>
              <div className="text-sm font-semibold text-[#6264a7]">62%</div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '62%' }}
                transition={{ delay: 0.8, duration: 1 }}
                className="h-full bg-gradient-to-r from-[#6264a7] via-[#505ac9] to-[#6264a7] rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="flex items-center justify-between pt-4 border-t border-slate-200"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6264a7] to-[#505ac9] 
                      flex items-center justify-center shadow-md"
          >
            <FiUser className="text-white text-sm" />
          </motion.div>
          <div>
            <div className="text-sm font-medium text-slate-900">Admin User</div>
            <div className="text-xs text-slate-500">Connected</div>
          </div>
        </div>
        <div className="text-xs text-slate-400">
          v2.4.1
        </div>
      </motion.div>
    </div>
  );
};

export default LeftSidebar;