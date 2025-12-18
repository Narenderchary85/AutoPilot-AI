// components/layout/RightSidebar.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiCheckCircle, FiAlertCircle, FiActivity, FiTrendingUp, FiFilter, FiRefreshCw } from 'react-icons/fi';

const mockHistory = [
  { 
    id: 1, 
    title: 'Standup Meeting Added', 
    description: 'Added daily standup to calendar',
    time: '09:02 AM', 
    date: 'Today',
    status: 'completed',
    agent: 'calendar',
    duration: '2s',
    icon: FiCheckCircle
  },
  { 
    id: 2, 
    title: 'Email Digest Generated', 
    description: 'Summarized 5 unread emails from today',
    time: '08:15 AM', 
    date: 'Today',
    status: 'completed',
    agent: 'email',
    duration: '4s',
    icon: FiCheckCircle
  },
  { 
    id: 3, 
    title: 'AI News Digest', 
    description: 'Fetched latest AI news from 3 sources',
    time: 'Yesterday', 
    date: 'Yesterday',
    status: 'completed',
    agent: 'web',
    duration: '6s',
    icon: FiCheckCircle
  },
  { 
    id: 4, 
    title: 'Meeting Invite Sent', 
    description: 'Sent meeting invite to 3 team members',
    time: 'Yesterday', 
    date: 'Yesterday',
    status: 'completed',
    agent: 'email',
    duration: '3s',
    icon: FiCheckCircle
  },
  { 
    id: 5, 
    title: 'Web Research Failed', 
    description: 'Failed to scrape target website',
    time: '2 days ago', 
    date: 'Previous',
    status: 'failed',
    agent: 'web',
    duration: '8s',
    icon: FiAlertCircle
  },
];

const agentColors = {
  email: '#6264a7',
  calendar: '#505ac9',
  web: '#8a8dff',
};

const statusColors = {
  completed: 'bg-green-500',
  processing: 'bg-yellow-500',
  failed: 'bg-red-500',
};

const RightSidebar = () => {
  const [history] = useState(mockHistory);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filters = [
    { id: 'all', label: 'All', count: 5 },
    { id: 'completed', label: 'Completed', count: 4 },
    { id: 'failed', label: 'Failed', count: 1 },
    { id: 'email', label: 'Email', count: 2 },
    { id: 'calendar', label: 'Calendar', count: 1 },
    { id: 'web', label: 'Web', count: 2 },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const filteredHistory = activeFilter === 'all' 
    ? history 
    : history.filter(item => 
        item.status === activeFilter || item.agent === activeFilter
      );

  const stats = {
    total: history.length,
    completed: history.filter(h => h.status === 'completed').length,
    avgTime: '3.2s',
    successRate: '92%',
  };

  return (
    <div className="flex flex-col w-full h-full p-6 gap-6 bg-gradient-to-b from-white to-slate-50 border-l border-slate-200">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="text-xs font-semibold tracking-[0.2em] text-[#6264a7] uppercase mb-1">
            Activity Timeline
          </div>
          <h2 className="text-lg font-bold text-slate-900">Agent History</h2>
          <p className="text-xs text-slate-500 mt-1">Track all automated actions and results</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          animate={{ rotate: isRefreshing ? 360 : 0 }}
          transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
          onClick={handleRefresh}
          className="w-10 h-10 rounded-xl bg-[#f3f4ff] text-[#6264a7] flex items-center justify-center
                     border border-[#e0e2ff] hover:border-[#6264a7]/30"
        >
          <FiRefreshCw size={18} />
        </motion.button>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="grid grid-cols-2 gap-3"
      >
        {[
          { label: 'Total Tasks', value: stats.total, icon: FiActivity, color: '#6264a7' },
          { label: 'Completed', value: stats.completed, icon: FiCheckCircle, color: '#10b981' },
          { label: 'Avg Time', value: stats.avgTime, icon: FiClock, color: '#505ac9' },
          { label: 'Success Rate', value: stats.successRate, icon: FiTrendingUp, color: '#8a8dff' },
        ].map((stat, index) => {
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
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900">{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
            <FiFilter size={14} />
            <span>Filter Activity</span>
          </div>
          <div className="text-xs text-slate-400">
            {filteredHistory.length} items
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeFilter === filter.id
                  ? 'bg-[#6264a7] text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {filter.label}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs ${
                activeFilter === filter.id
                  ? 'bg-white/20'
                  : 'bg-slate-200'
              }`}>
                {filter.count}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="flex-1 overflow-hidden"
      >
        <div className="h-full flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 overflow-y-auto flex-1 pr-2"
            >
              {filteredHistory.map((item, index) => {
                const Icon = item.icon;
                const agentColor = agentColors[item.agent];
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ scale: 1.01, x: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedItem(item.id === selectedItem ? null : item.id)}
                    className={`relative overflow-hidden rounded-xl border transition-all duration-200 cursor-pointer
                              ${selectedItem === item.id 
                                ? 'border-[#6264a7] bg-gradient-to-r from-[#f3f4ff] to-white shadow-md' 
                                : 'border-slate-200 bg-white hover:border-[#6264a7]/30 hover:shadow-sm'
                              }`}
                  >
                    {/* Timeline connector */}
                    {index < filteredHistory.length - 1 && (
                      <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-slate-200 z-0" />
                    )}

                    {/* Status indicator */}
                    <div className="absolute left-5 top-5 -translate-x-1/2 z-10">
                      <div className={`w-2 h-2 rounded-full ${statusColors[item.status]} ring-4 ring-white`} />
                    </div>

                    {/* Content */}
                    <div className="p-4 pl-10">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div 
                              className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs"
                              style={{ backgroundColor: agentColor }}
                            >
                              {item.agent.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                            <Icon className={`ml-auto ${
                              item.status === 'completed' ? 'text-green-500' : 'text-red-500'
                            }`} size={14} />
                          </div>
                          <p className="text-xs text-slate-600 mb-2">{item.description}</p>
                          
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <FiClock size={12} />
                              <span>{item.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1 h-1 rounded-full bg-slate-300" />
                              <span>{item.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1 h-1 rounded-full bg-slate-300" />
                              <span>{item.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {selectedItem === item.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 pt-3 border-t border-slate-100"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500">Agent Type:</span>
                                <span className="font-medium" style={{ color: agentColor }}>
                                  {item.agent.charAt(0).toUpperCase() + item.agent.slice(1)} Agent
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500">Status:</span>
                                <span className={`font-medium px-2 py-0.5 rounded ${
                                  item.status === 'completed' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500">Processing Time:</span>
                                <span className="font-medium text-slate-700">{item.duration}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Summary Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="mt-auto pt-4 border-t border-slate-200"
      >
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-slate-600">Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-slate-600">Failed</span>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            Auto-sync every 5m
          </div>
        </div>
        
        <div className="mt-3 bg-slate-50 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">Today's Efficiency</span>
            <span className="font-bold text-[#6264a7]">↑ 12%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '85%' }}
              transition={{ delay: 0.6, duration: 1 }}
              className="h-full bg-gradient-to-r from-[#6264a7] to-[#8a8dff] rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RightSidebar;