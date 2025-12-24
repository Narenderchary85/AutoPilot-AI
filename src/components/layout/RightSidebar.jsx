import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiCheckCircle, FiAlertCircle, FiActivity, FiTrendingUp, FiFilter, FiRefreshCw, FiMail, FiCalendar, FiGlobe } from 'react-icons/fi';
import axios from 'axios';

const API_URL = 'http://localhost:8000/userdata/gethistory';

const agentColors = {
  email: '#6264a7',
  calendar: '#505ac9',
  web: '#8a8dff',
  email_sending_agent: '#6264a7',
  calendar_management: '#505ac9',
};

const statusColors = {
  completed: 'bg-green-500',
  processing: 'bg-yellow-500',
  failed: 'bg-red-500',
};

// Map backend agent types to frontend display names
const agentTypeMapping = {
  email: 'Email',
  calendar_management: 'Calendar',
  email_sending_agent: 'Email',
  web: 'Web',
};

// Get appropriate icon based on agent type
const getAgentIcon = (agentType) => {
  switch (agentType) {
    case 'email':
    case 'email_sending_agent':
      return FiMail;
    case 'calendar_management':
      return FiCalendar;
    case 'web':
      return FiGlobe;
    default:
      return FiActivity;
  }
};

// Format execution time to readable format
const formatExecutionTime = (ms) => {
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

// Format date to relative time
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  if (diffHours < 24) {
    return 'Today';
  } else if (diffDays < 2) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${Math.floor(diffDays)} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

// Format time to AM/PM
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const RightSidebar = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'completed', label: 'Completed' },
    { id: 'failed', label: 'Failed' },
    { id: 'email', label: 'Email' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'web', label: 'Web' },
  ];

  // Fetch history from backend
  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      
      if (response.data && response.data.data) {
        setHistory(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to load activity history');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchHistory();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Calculate stats from real data
  const calculateStats = () => {
    if (!history.length) {
      return {
        total: 0,
        completed: 0,
        avgTime: '0s',
        successRate: '0%',
      };
    }

    const completed = history.filter(item => item.status === 'completed').length;
    const avgTime = history.reduce((sum, item) => sum + (item.execution_time || 0), 0) / history.length;
    const successRate = (completed / history.length * 100).toFixed(0);

    return {
      total: history.length,
      completed,
      avgTime: formatExecutionTime(avgTime),
      successRate: `${successRate}%`,
    };
  };

  const stats = calculateStats();

  // Filter history based on active filter
  const filteredHistory = activeFilter === 'all' 
    ? history 
    : history.filter(item => {
        if (activeFilter === 'completed' || activeFilter === 'failed') {
          return item.status === activeFilter;
        }
        // Handle agent type filtering
        const mappedAgent = agentTypeMapping[item.agent_type]?.toLowerCase();
        return mappedAgent === activeFilter;
      });

  // Update filter counts based on actual data
  const updatedFilters = filters.map(filter => {
    if (filter.id === 'all') {
      return { ...filter, count: history.length };
    }
    
    if (filter.id === 'completed' || filter.id === 'failed') {
      const count = history.filter(item => item.status === filter.id).length;
      return { ...filter, count };
    }
    
    // Count by agent type
    const count = history.filter(item => {
      const mappedAgent = agentTypeMapping[item.agent_type]?.toLowerCase();
      return mappedAgent === filter.id;
    }).length;
    
    return { ...filter, count };
  });

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

      {/* Stats Cards */}
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

      {/* Filter Section */}
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
          {updatedFilters.map((filter) => (
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
              disabled={filter.count === 0 && filter.id !== 'all'}
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

      {/* History List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="flex-1 overflow-hidden"
      >
        <div className="h-full flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-[#6264a7] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-500">Loading history...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-4">
                <FiAlertCircle className="text-red-500 text-2xl mx-auto mb-3" />
                <p className="text-sm text-slate-700">{error}</p>
                <button
                  onClick={fetchHistory}
                  className="mt-3 px-4 py-2 text-xs bg-[#6264a7] text-white rounded-lg hover:bg-[#505ac9]"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-4">
                <FiActivity className="text-slate-400 text-2xl mx-auto mb-3" />
                <p className="text-sm text-slate-500">No activity history found</p>
                <p className="text-xs text-slate-400 mt-1">Try using AutoPilot to generate some activity</p>
              </div>
            </div>
          ) : (
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
                  const AgentIcon = getAgentIcon(item.agent_type);
                  const agentDisplayName = agentTypeMapping[item.agent_type] || item.agent_type;
                  const agentColor = agentColors[item.agent_type] || '#8a8dff';
                  const statusIcon = item.status === 'completed' ? FiCheckCircle : FiAlertCircle;
                  
                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      whileHover={{ scale: 1.01, x: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedItem(item._id === selectedItem ? null : item._id)}
                      className={`relative overflow-hidden rounded-xl border transition-all duration-200 cursor-pointer
                                ${selectedItem === item._id 
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
                        <div className={`w-2 h-2 rounded-full ${statusColors[item.status] || 'bg-slate-400'} ring-4 ring-white`} />
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
                                <AgentIcon size={12} />
                              </div>
                              <h3 className="text-sm font-semibold text-slate-900">{item.task_name}</h3>
                              {statusIcon && (
                                <statusIcon className={`ml-auto ${
                                  item.status === 'completed' ? 'text-green-500' : 'text-red-500'
                                }`} size={14} />
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mb-2 line-clamp-2">
                              {item.task_description || item.result_summary}
                            </p>
                            
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <div className="flex items-center gap-1">
                                <FiClock size={12} />
                                <span>{formatTime(item.created_at)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-1 h-1 rounded-full bg-slate-300" />
                                <span>{formatRelativeTime(item.created_at)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-1 h-1 rounded-full bg-slate-300" />
                                <span>{formatExecutionTime(item.execution_time)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        <AnimatePresence>
                          {selectedItem === item._id && (
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
                                    {agentDisplayName} Agent
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
                                  <span className="font-medium text-slate-700">
                                    {formatExecutionTime(item.execution_time)}
                                  </span>
                                </div>
                                {item.result_summary && (
                                  <div className="text-xs">
                                    <div className="text-slate-500 mb-1">Result:</div>
                                    <p className="text-slate-700 bg-slate-50 p-2 rounded">
                                      {item.result_summary}
                                    </p>
                                  </div>
                                )}
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
          )}
        </div>
      </motion.div>

      {/* Footer Summary */}
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
        
        {history.length > 0 && (
          <div className="mt-3 bg-slate-50 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Today's Efficiency</span>
              <span className="font-bold text-[#6264a7]">↑ {stats.successRate}</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${parseInt(stats.successRate)}%` }}
                transition={{ delay: 0.6, duration: 1 }}
                className="h-full bg-gradient-to-r from-[#6264a7] to-[#8a8dff] rounded-full"
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RightSidebar;