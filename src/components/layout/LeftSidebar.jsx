// import { useState } from 'react';
// import { FiMail, FiCalendar, FiGlobe, FiTrendingUp, FiZap, FiActivity, FiUser, FiSettings } from 'react-icons/fi';
// import { motion, AnimatePresence } from 'framer-motion';

// const actions = [
//   { id: 'read_emails', label: 'Read Emails', icon: FiMail, color: '#6264a7', count: 5 },
//   { id: 'send_email', label: 'Send Email', icon: FiMail, color: '#505ac9', count: 12 },
//   { id: 'add_event', label: 'Add Event', icon: FiCalendar, color: '#6264a7', count: 8 },
//   { id: 'get_events', label: 'View Calendar', icon: FiCalendar, color: '#505ac9', count: 15 },
//   { id: 'scrape_web', label: 'Web Scraper', icon: FiGlobe, color: '#6264a7', count: 3 },
//   { id: 'latest_news', label: 'Latest News', icon: FiTrendingUp, color: '#505ac9', count: 7 },
// ];

// const stats = [
//   { label: 'Tasks Completed', value: '248', change: '+12%', icon: FiActivity },
//   { label: 'Active Agents', value: '3', change: 'Online', icon: FiZap },
//   { label: 'Response Time', value: '0.8s', change: '-0.2s', icon: FiTrendingUp },
// ];

// const LeftSidebar = () => {
//   const [activeAgent, setActiveAgent] = useState(null);

//   const handleActionClick = (actionId) => {
//     setActiveAgent(actionId);
//     setTimeout(() => setActiveAgent(null), 2000);
//   };

//   return (
//     <div className="flex flex-col w-full p-6 gap-8 bg-gradient-to-b from-white to-slate-50 border-r border-slate-200">
//       <motion.div
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.3 }}
//         className="flex items-center justify-between"
//       >
//         <div>
//           <div className="flex items-center gap-2 mb-1">
//             <motion.div
//               animate={{ rotate: activeAgent ? 360 : 0 }}
//               transition={{ duration: 0.5 }}
//               className="relative"
//             >
//               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6264a7] to-[#505ac9] 
//                             flex items-center justify-center shadow-lg shadow-[#6264a7]/20">
//                 <FiZap className="text-white text-lg" />
//               </div>
//               {activeAgent && (
//                 <motion.div
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white"
//                 />
//               )}
//             </motion.div>
//             <div>
//               <div className="text-xs font-semibold tracking-[0.2em] text-[#6264a7] uppercase">
//                 Autopilot
//               </div>
//               <h1 className="text-lg font-bold text-slate-900">
//                 Control Center
//               </h1>
//             </div>
//           </div>
//           <p className="text-xs text-slate-500 mt-2 max-w-xs">
//             Orchestrate email, calendar, and web agents with intelligent automation
//           </p>
//         </div>

//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="w-10 h-10 rounded-xl bg-[#f3f4ff] text-[#6264a7] flex items-center justify-center
//                      border border-[#e0e2ff] hover:border-[#6264a7]/30"
//         >
//           <FiSettings size={18} />
//         </motion.button>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.1, duration: 0.3 }}
//         className="space-y-3"
//       >
//         <div className="flex items-center justify-between">
//           <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
//             Performance Metrics
//           </div>
//           <div className="text-xs text-[#6264a7] font-medium bg-[#f3f4ff] px-2 py-1 rounded-md">
//             Live
//           </div>
//         </div>
        
//         <div className="grid grid-cols-2 gap-3">
//           {stats.map((stat, index) => {
//             const Icon = stat.icon;
//             return (
//               <motion.div
//                 key={stat.label}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 0.1 + index * 0.1 }}
//                 whileHover={{ scale: 1.02, y: -2 }}
//                 className="bg-white p-3 rounded-xl border border-slate-200 hover:border-[#6264a7]/30
//                           shadow-sm hover:shadow-md transition-all duration-200"
//               >
//                 <div className="flex items-start justify-between">
//                   <div className="p-2 rounded-lg bg-[#f3f4ff]">
//                     <Icon className="text-[#6264a7]" size={16} />
//                   </div>
//                   <div className={`text-xs font-semibold ${
//                     stat.change.includes('+') ? 'text-green-600' : 
//                     stat.change.includes('-') ? 'text-red-600' : 'text-[#6264a7]'
//                   }`}>
//                     {stat.change}
//                   </div>
//                 </div>
//                 <div className="mt-3">
//                   <div className="text-lg font-bold text-slate-900">{stat.value}</div>
//                   <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.2, duration: 0.3 }}
//         className="flex-1"
//       >
//         <div className="flex items-center justify-between mb-4">
//           <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
//             Agent Actions
//           </div>
//           <motion.div
//             animate={{ x: activeAgent ? [0, 5, 0] : 0 }}
//             transition={{ repeat: activeAgent ? Infinity : 0, duration: 0.5 }}
//             className="text-xs text-slate-400"
//           >
//             {activeAgent ? 'Processing...' : 'Ready'}
//           </motion.div>
//         </div>

//         <div className="space-y-2">
//           {actions.map((action, index) => {
//             const Icon = action.icon;
//             const isActive = activeAgent === action.id;
            
//             return (
//               <motion.button
//                 key={action.id}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3 + index * 0.05 }}
//                 whileHover={{ x: 8, scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => handleActionClick(action.id)}
//                 className={`w-full flex items-center justify-between p-3 rounded-xl
//                           transition-all duration-200 relative overflow-hidden group
//                           ${isActive 
//                             ? 'bg-gradient-to-r from-[#6264a7] to-[#505ac9] text-white' 
//                             : 'bg-white text-slate-700 hover:bg-[#f3f4ff] border border-slate-200 hover:border-[#6264a7]/30'
//                           }`}
//               >
//                 {isActive && (
//                   <motion.div
//                     className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
//                     initial={{ x: '-100%' }}
//                     animate={{ x: '100%' }}
//                     transition={{ duration: 1, repeat: Infinity }}
//                   />
//                 )}

//                 <div className="flex items-center gap-3 relative z-10">
//                   <motion.span
//                     animate={isActive ? { rotate: 360 } : {}}
//                     transition={isActive ? { duration: 0.5 } : {}}
//                     className={`flex h-8 w-8 items-center justify-center rounded-lg
//                               ${isActive 
//                                 ? 'bg-white/20' 
//                                 : 'bg-[#f3f4ff] text-[#6264a7]'
//                               }`}
//                   >
//                     <Icon size={16} />
//                   </motion.span>
//                   <span className="text-sm font-medium">{action.label}</span>
//                 </div>

//                 <div className="flex items-center gap-2 relative z-10">
//                   {action.count > 0 && (
//                     <motion.span
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       className={`text-xs px-2 py-1 rounded-md ${
//                         isActive 
//                           ? 'bg-white/20' 
//                           : 'bg-[#f3f4ff] text-[#6264a7]'
//                       }`}
//                     >
//                       {action.count}
//                     </motion.span>
//                   )}
//                   <motion.div
//                     animate={isActive ? { scale: [1, 1.2, 1] } : {}}
//                     transition={isActive ? { repeat: Infinity, duration: 1 } : {}}
//                     className={`w-2 h-2 rounded-full ${
//                       isActive ? 'bg-white' : 'bg-green-500'
//                     }`}
//                   />
//                 </div>
//               </motion.button>
//             );
//           })}
//         </div>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.4, duration: 0.3 }}
//         className="mt-auto"
//       >
//         <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
//           Agent Status
//         </div>
        
//         <div className="bg-white rounded-xl border border-slate-200 p-4">
//           <div className="space-y-3">
//             {[
//               { name: 'Email Agent', status: 'active', color: 'bg-green-500', progress: 85 },
//               { name: 'Calendar Agent', status: 'active', color: 'bg-green-500', progress: 72 },
//               { name: 'Web Agent', status: 'idle', color: 'bg-slate-400', progress: 30 },
//             ].map((agent, index) => (
//               <div key={agent.name} className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <div className="flex items-center gap-2">
//                       <div className={`w-2 h-2 rounded-full ${agent.color}`} />
//                       <span className="text-sm font-medium text-slate-700">{agent.name}</span>
//                     </div>
//                     <span className="text-xs text-slate-500">{agent.status}</span>
//                   </div>
//                   <span className="text-sm font-semibold text-[#6264a7]">{agent.progress}%</span>
//                 </div>
//                 <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                   <motion.div
//                     initial={{ width: 0 }}
//                     animate={{ width: `${agent.progress}%` }}
//                     transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
//                     className={`h-full rounded-full ${
//                       agent.status === 'active' 
//                         ? 'bg-gradient-to-r from-[#6264a7] to-[#505ac9]' 
//                         : 'bg-slate-400'
//                     }`}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           <div className="mt-4 pt-4 border-t border-slate-100">
//             <div className="flex items-center justify-between">
//               <div className="text-xs text-slate-500">Total Load</div>
//               <div className="text-sm font-semibold text-[#6264a7]">62%</div>
//             </div>
//             <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
//               <motion.div
//                 initial={{ width: 0 }}
//                 animate={{ width: '62%' }}
//                 transition={{ delay: 0.8, duration: 1 }}
//                 className="h-full bg-gradient-to-r from-[#6264a7] via-[#505ac9] to-[#6264a7] rounded-full"
//               />
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.5, duration: 0.3 }}
//         className="flex items-center justify-between pt-4 border-t border-slate-200"
//       >
//         <div className="flex items-center gap-3">
//           <motion.div
//             whileHover={{ scale: 1.1 }}
//             className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6264a7] to-[#505ac9] 
//                       flex items-center justify-center shadow-md"
//           >
//             <FiUser className="text-white text-sm" />
//           </motion.div>
//           <div>
//             <div className="text-sm font-medium text-slate-900">Admin User</div>
//             <div className="text-xs text-slate-500">Connected</div>
//           </div>
//         </div>
//         <div className="text-xs text-slate-400">
//           v2.4.1
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default LeftSidebar;

import { useState, useEffect } from 'react';
import { FiZap, FiActivity, FiUser, FiSettings, FiTrendingUp, FiRefreshCw, FiBarChart, FiClock, FiTarget } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URLS = {
  userInsights: 'http://localhost:8000/userdata/insights',
  workflowStats: 'http://localhost:8000/userdata/workflow-stats',
  agentMetrics: 'http://localhost:8000/userdata/metrics',
};

const LeftSidebar = ({ onExecuteWorkflow, onApplyTemplate }) => {
  const [activeAction, setActiveAction] = useState(null);
  const [insights, setInsights] = useState(null);
  const [workflowStats, setWorkflowStats] = useState(null);
  const [agentMetrics, setAgentMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchInsightsData();
    const interval = setInterval(fetchInsightsData, 45000); // 45 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchInsightsData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const [insightsRes, workflowRes, metricsRes] = await Promise.all([
        axios.get(API_URLS.userInsights, { 
          headers: { Authorization: `Bearer ${token}` } 
        }).catch(() => ({ data: null })),
        axios.get(API_URLS.workflowStats, { 
          headers: { Authorization: `Bearer ${token}` } 
        }).catch(() => ({ data: null })),
        axios.get(API_URLS.agentMetrics, { 
          headers: { Authorization: `Bearer ${token}` } 
        }).catch(() => ({ data: null }))
      ]);

      setInsights(insightsRes?.data);
      setWorkflowStats(workflowRes?.data);
      setAgentMetrics(metricsRes?.data);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInsightsData();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleExecuteWorkflow = (workflow) => {
    setActiveAction(workflow.id);
    if (onExecuteWorkflow) {
      onExecuteWorkflow(workflow);
    }
    setTimeout(() => setActiveAction(null), 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col w-full p-6 gap-8 bg-gradient-to-b from-white to-slate-50 border-r border-slate-200">
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-slate-200 rounded-xl"></div>
          <div className="h-32 bg-slate-200 rounded-xl"></div>
          <div className="h-64 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full p-6 gap-8 bg-gradient-to-b from-white to-slate-50 border-r border-slate-200">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <motion.div
              animate={{ rotate: activeAction ? 360 : 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6264a7] to-[#505ac9] 
                            flex items-center justify-center shadow-lg shadow-[#6264a7]/20">
                <FiZap className="text-white text-lg" />
              </div>
              {activeAction && (
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
                Insights Hub
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 max-w-xs">
            AI-powered insights and smart workflows
          </p>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            animate={{ rotate: refreshing ? 360 : 0 }}
            transition={{ duration: refreshing ? 0.5 : 0 }}
            className="w-10 h-10 rounded-xl bg-[#f3f4ff] text-[#6264a7] flex items-center justify-center
                       border border-[#e0e2ff] hover:border-[#6264a7]/30"
          >
            <FiRefreshCw size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-[#f3f4ff] text-[#6264a7] flex items-center justify-center
                       border border-[#e0e2ff] hover:border-[#6264a7]/30"
          >
            <FiSettings size={18} />
          </motion.button>
        </div>
      </motion.div>

      {/* Smart Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <FiActivity size={12} />
            Smart Metrics
          </div>
          <div className="text-xs text-[#6264a7] font-medium bg-[#f3f4ff] px-2 py-1 rounded-md">
            AI Analyzed
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {[
            { 
              label: 'Productivity Score', 
              value: insights?.productivity_score ? `${insights.productivity_score}/100` : '82/100', 
              trend: insights?.productivity_trend || '↑ 12%', 
              icon: FiTrendingUp,
              color: 'from-green-500 to-emerald-600'
            },
            { 
              label: 'Time Saved', 
              value: insights?.time_saved ? `${insights.time_saved}h` : '48h', 
              trend: '≈ $2400 value', 
              icon: FiClock,
              color: 'from-blue-500 to-cyan-600'
            },
            { 
              label: 'Auto Tasks', 
              value: workflowStats?.automated_tasks || '12', 
              trend: 'This week', 
              icon: FiZap,
              color: 'from-purple-500 to-pink-600'
            },
            { 
              label: 'AI Accuracy', 
              value: agentMetrics?.overall_accuracy ? `${agentMetrics.overall_accuracy}%` : '94%', 
              trend: '+2.1%', 
              icon: FiTarget,
              color: 'from-orange-500 to-amber-600'
            },
          ].map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white rounded-xl border border-slate-200 hover:border-[#6264a7]/30
                          shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
               
                <div className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-slate-50 to-white shadow-sm">
                      <Icon className="text-[#6264a7]" size={16} />
                    </div>
                    <div className={`text-xs font-semibold ${
                      metric.trend.includes('↑') || metric.trend.includes('+') ? 'text-green-600' : 
                      metric.trend.includes('↓') || metric.trend.includes('-') ? 'text-red-600' : 
                      'text-slate-600'
                    }`}>
                      {metric.trend}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-lg font-bold text-slate-900">{metric.value}</div>
                    <div className="text-xs text-slate-500 mt-1">{metric.label}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* AI Insights Panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            
            AI Insights
          </div>
          <motion.div
            animate={{ x: activeAction ? [0, 5, 0] : 0 }}
            transition={{ repeat: activeAction ? Infinity : 0, duration: 0.5 }}
            className="text-xs text-slate-400"
          >
            {insights?.insights_count || '0'} patterns
          </motion.div>
        </div>

        <div className="space-y-3">
          {/* Peak Performance Times */}
          {insights?.peak_performance && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-blue-50/50 to-indigo-50/30 rounded-xl border border-blue-100 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div className="text-xs font-semibold text-blue-700">Peak Performance</div>
              </div>
              <p className="text-sm text-slate-800">
                You're most productive on <span className="font-semibold">{insights.peak_performance.day}</span> 
                around <span className="font-semibold">{insights.peak_performance.time}</span>
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-slate-500">
                  Based on {insights.peak_performance.task_count} completed tasks
                </span>
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  Optimize schedule →
                </button>
              </div>
            </motion.div>
          )}

          {/* Task Patterns */}
          {insights?.common_patterns && insights.common_patterns.length > 0 && (
            <div className="space-y-2">
              {insights.common_patterns.slice(0, 2).map((pattern, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-slate-200 p-3 hover:border-[#6264a7]/30 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${
                          pattern.type === 'routine' ? 'bg-green-500' :
                          pattern.type === 'preference' ? 'bg-blue-500' :
                          'bg-purple-500'
                        }`} />
                        <span className="text-xs font-medium text-slate-700 capitalize">{pattern.type}</span>
                        <span className="text-xs text-slate-400 ml-auto">
                          {pattern.confidence}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-slate-800">{pattern.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <FiClock size={10} />
                          {pattern.frequency}
                        </span>
                        {pattern.suggested_automation && (
                          <button className="text-xs text-[#6264a7] hover:text-[#505ac9] font-medium">
                            Auto-suggested
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Quick Workflows */}
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiZap size={12} />
              Smart Workflows
            </div>
            <div className="space-y-2">
              {[
                {
                  id: 'morning_briefing',
                  name: 'Morning Briefing',
                  description: 'Emails + Calendar + News',
                  time: '2m',
                  icon: '🌅',
                  steps: 3,
                  automated: true
                },
                {
                  id: 'meeting_prep',
                  name: 'Meeting Prep',
                  description: 'Research + Docs + Summaries',
                  time: '3m',
                  icon: '📅',
                  steps: 4,
                  automated: false
                },
                {
                  id: 'weekly_review',
                  name: 'Weekly Review',
                  description: 'Analytics + Planning',
                  time: '5m',
                  icon: '📊',
                  steps: 5,
                  automated: true
                }
              ].map((workflow, index) => (
                <motion.button
                  key={workflow.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  whileHover={{ x: 4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleExecuteWorkflow(workflow)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 relative overflow-hidden group
                            ${activeAction === workflow.id 
                              ? 'border-[#6264a7] bg-gradient-to-r from-[#f3f4ff] to-white shadow-md' 
                              : 'border-slate-200 bg-white hover:border-[#6264a7]/30 hover:shadow-sm'
                            }`}
                >
                  {activeAction === workflow.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}

                  <div className="flex items-center gap-3 relative z-10">
                    <div className="text-2xl">{workflow.icon}</div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-slate-900">{workflow.name}</div>
                      <div className="text-xs text-slate-500">{workflow.description}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 relative z-10">
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-slate-500">{workflow.time}</span>
                      <span className="text-xs text-slate-400">{workflow.steps} steps</span>
                    </div>
                    {workflow.automated && (
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Agent Intelligence */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-auto"
      >
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <FiBarChart size={12} />
          Agent Intelligence
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          {agentMetrics?.agents ? (
            <div className="space-y-3">
              {agentMetrics.agents.map((agent, index) => (
                <div key={agent.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        agent.accuracy >= 90 ? 'bg-green-500' :
                        agent.accuracy >= 80 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                      <span className="text-sm font-medium text-slate-700">{agent.name}</span>
                      <span className="text-xs text-slate-500">({agent.task_count} tasks)</span>
                    </div>
                    <span className="text-sm font-semibold text-[#6264a7]">{agent.accuracy}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.accuracy}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      className={`h-full rounded-full ${
                        agent.accuracy >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                        agent.accuracy >= 80 ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
                        'bg-gradient-to-r from-red-500 to-pink-600'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { name: 'Email Agent', accuracy: 94, task_count: 45 },
                { name: 'Calendar Agent', accuracy: 88, task_count: 23 },
                { name: 'Web Agent', accuracy: 82, task_count: 12 },
              ].map((agent, index) => (
                <div key={agent.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        agent.accuracy >= 90 ? 'bg-green-500' :
                        agent.accuracy >= 80 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                      <span className="text-sm font-medium text-slate-700">{agent.name}</span>
                      <span className="text-xs text-slate-500">({agent.task_count} tasks)</span>
                    </div>
                    <span className="text-sm font-semibold text-[#6264a7]">{agent.accuracy}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.accuracy}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      className={`h-full rounded-full ${
                        agent.accuracy >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                        agent.accuracy >= 80 ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
                        'bg-gradient-to-r from-red-500 to-pink-600'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-sm">
              <div className="text-slate-600">Learning Progress</div>
              <div className="font-semibold text-[#6264a7]">
                {insights?.learning_progress || '68%'}
              </div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: insights?.learning_progress || '68%' }}
                transition={{ delay: 0.8, duration: 1 }}
                className="h-full bg-gradient-to-r from-[#6264a7] via-[#505ac9] to-[#8a8dff] rounded-full"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              AI is learning your preferences and optimizing tasks
            </p>
          </div>
        </div>
      </motion.div>

      {/* User Profile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
            <div className="text-sm font-medium text-slate-900">
              {insights?.user_name || 'AutoPilot User'}
            </div>
            <div className="text-xs text-slate-500">
              {insights?.automation_level ? `Level ${insights.automation_level}` : 'Pro Automation'}
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-400">
          v2.5.0
        </div>
      </motion.div>
    </div>
  );
};

export default LeftSidebar;