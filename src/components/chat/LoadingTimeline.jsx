// components/chat/LoadingTimeline.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiCalendar, FiGlobe, FiCpu, FiZap, FiRefreshCw, FiCheck, FiActivity } from 'react-icons/fi';

const LoadingTimeline = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing AutoPilot...');

  const steps = [
    { 
      icon: FiCpu, 
      label: 'Manager Agent Parsing Request',
      color: '#6264a7',
      description: 'Analyzing your query for intent and context',
      duration: 1200
    },
    { 
      icon: FiMail, 
      label: 'Email Agent Processing',
      color: '#505ac9',
      description: 'Checking unread emails and notifications',
      duration: 1800
    },
    { 
      icon: FiCalendar, 
      label: 'Calendar Agent Syncing',
      color: '#8a8dff',
      description: 'Fetching and updating calendar events',
      duration: 1600
    },
    { 
      icon: FiGlobe, 
      label: 'Web Agent Querying',
      color: '#a5a8ff',
      description: 'Searching web sources and news feeds',
      duration: 2000
    },
    { 
      icon: FiZap, 
      label: 'Orchestrating Response',
      color: '#6264a7',
      description: 'Compiling results from all agents',
      duration: 1400
    }
  ];

  useEffect(() => {
    if (currentStep >= steps.length) {
      setStatusText('Finalizing response...');
      return;
    }

    const step = steps[currentStep];
    setStatusText(`${step.label}...`);

    const timer = setTimeout(() => {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
      setProgress(((currentStep + 1) / steps.length) * 100);
    }, step.duration);

    return () => clearTimeout(timer);
  }, [currentStep]);

  const resetSimulation = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setProgress(0);
    setStatusText('Initializing AutoPilot...');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto mt-4"
    >
      <div className="relative rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-lg overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              x: ['0%', '100%'],
            }}
            transition={{
              x: {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }
            }}
            className="absolute top-0 left-0 w-64 h-full bg-gradient-to-r from-transparent via-[#f3f4ff]/20 to-transparent"
          />
        </div>

        <div className="relative z-10 p-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6264a7] to-[#505ac9] 
                          flex items-center justify-center shadow-lg shadow-[#6264a7]/20"
              >
                <FiActivity className="text-white" size={18} />
              </motion.div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">AutoPilot Processing</h3>
                <motion.p 
                  key={statusText}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-slate-600 mt-0.5"
                >
                  {statusText}
                </motion.p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetSimulation}
              className="p-2 rounded-lg bg-[#f3f4ff] text-[#6264a7] hover:bg-[#e0e2ff]"
            >
              <FiRefreshCw size={14} />
            </motion.button>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-700">Overall Progress</span>
              <motion.span 
                key={progress}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="font-bold text-[#6264a7]"
              >
                {Math.round(progress)}%
              </motion.span>
            </div>
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-[#6264a7] via-[#505ac9] to-[#8a8dff] rounded-full relative"
              >
                <motion.div
                  animate={{ x: ['0%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="relative z-10 p-5">
          <div className="space-y-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === currentStep;
              const isCompleted = completedSteps.includes(idx);
              const isPending = idx > currentStep;

              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  className="relative"
                >
                  {idx < steps.length - 1 && (
                    <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-slate-200 z-0">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: isCompleted ? '100%' : '0%' }}
                        transition={{ duration: 0.5 }}
                        className="w-full bg-gradient-to-b from-[#6264a7] to-[#8a8dff]"
                      />
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className="relative z-10">
                      <motion.div
                        animate={isActive ? {
                          scale: [1, 1.2, 1],
                          boxShadow: [
                            `0 0 0 0 rgba(${parseInt(step.color.slice(1, 3), 16)}, ${parseInt(step.color.slice(3, 5), 16)}, ${parseInt(step.color.slice(5, 7), 16)}, 0.4)`,
                            `0 0 0 10px rgba(${parseInt(step.color.slice(1, 3), 16)}, ${parseInt(step.color.slice(3, 5), 16)}, ${parseInt(step.color.slice(5, 7), 16)}, 0)`,
                            `0 0 0 0 rgba(${parseInt(step.color.slice(1, 3), 16)}, ${parseInt(step.color.slice(3, 5), 16)}, ${parseInt(step.color.slice(5, 7), 16)}, 0.4)`,
                          ]
                        } : {}}
                        transition={isActive ? {
                          scale: { duration: 1.5, repeat: Infinity },
                          boxShadow: { duration: 1.5, repeat: Infinity }
                        } : {}}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center
                                  ${isCompleted 
                                    ? 'bg-gradient-to-br from-green-100 to-green-50 border border-green-200' 
                                    : isActive
                                    ? 'bg-gradient-to-br from-white to-slate-50 border-2 shadow-lg'
                                    : isPending
                                    ? 'bg-slate-100 border border-slate-200'
                                    : ''
                                  }`}
                        style={isActive ? { borderColor: step.color } : {}}
                      >
                        <motion.div
                          animate={isActive ? { rotate: [0, 10, -10, 0] } : {}}
                          transition={isActive ? { duration: 2, repeat: Infinity } : {}}
                        >
                          <Icon 
                            size={18} 
                            className={
                              isCompleted 
                                ? 'text-green-600' 
                                : isActive
                                ? 'text-[#6264a7]'
                                : 'text-slate-400'
                            }
                          />
                        </motion.div>

                        <AnimatePresence>
                          {isCompleted && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 
                                        flex items-center justify-center border-2 border-white"
                            >
                              <FiCheck className="text-white text-xs" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>

                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-semibold ${
                          isCompleted ? 'text-slate-900' : 
                          isActive ? 'text-slate-900' : 
                          'text-slate-600'
                        }`}>
                          {step.label}
                        </h4>
                        <div className="flex items-center gap-2">
                          {isActive && (
                            <>
                              <motion.div
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="w-1.5 h-1.5 rounded-full bg-[#6264a7]"
                              />
                              <span className="text-xs text-[#6264a7] font-medium">Processing</span>
                            </>
                          )}
                          {isCompleted && (
                            <span className="text-xs text-green-600 font-medium">Completed</span>
                          )}
                          {isPending && (
                            <span className="text-xs text-slate-400 font-medium">Pending</span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{step.description}</p>
 
                      {isActive && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: step.duration / 1000, ease: "linear" }}
                          className="h-1 bg-gradient-to-r from-[#f3f4ff] to-[#e0e2ff] rounded-full overflow-hidden mt-2"
                        >
                          <div className="h-full bg-gradient-to-r from-[#6264a7] to-[#505ac9] rounded-full" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>


      </div>

      {/* Decorative background elements */}
      <div className="absolute -inset-4 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-r from-[#f3f4ff] to-transparent rounded-full blur-3xl opacity-30"
        />
      </div>
    </motion.div>
  );
};

export default LoadingTimeline;