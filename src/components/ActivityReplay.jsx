import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  SparklesIcon,
  RocketLaunchIcon,
  TrophyIcon,
  DocumentTextIcon,
  CommandLineIcon,
  CodeBracketIcon,
  FolderIcon,
  CpuChipIcon,
  ArrowPathIcon,
  StarIcon,
  FireIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow, format } from 'date-fns';

const API_URL = "http://localhost:8000/userdata/gethistory";

// Helper function to get task icon based on task type/name
const getTaskIcon = (taskName, className = "w-12 h-12") => {
  const taskLower = taskName.toLowerCase();
  if (taskLower.includes("code") || taskLower.includes("programming")) 
    return <CodeBracketIcon className={`${className} text-blue-400`} />;
  if (taskLower.includes("document") || taskLower.includes("write"))
    return <DocumentTextIcon className={`${className} text-green-400`} />;
  if (taskLower.includes("terminal") || taskLower.includes("command"))
    return <CommandLineIcon className={`${className} text-purple-400`} />;
  if (taskLower.includes("folder") || taskLower.includes("file"))
    return <FolderIcon className={`${className} text-yellow-400`} />;
  if (taskLower.includes("ai") || taskLower.includes("agent"))
    return <CpuChipIcon className={`${className} text-cyan-400`} />;
  return <SparklesIcon className={`${className} text-pink-400`} />;
};

const ActivityReplay = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState('today'); // 'today' or 'week'
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showModeSelector, setShowModeSelector] = useState(true);

  // Slide data structure
  const [slides, setSlides] = useState([]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.data) {
        setHistory(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchHistory();
  }, [isOpen]);

  // Prepare slides based on current mode
  useEffect(() => {
    if (history.length > 0) {
      prepareSlides();
    }
  }, [history, currentMode]);

  const prepareSlides = () => {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const todayTasks = history.filter(
      (item) => new Date(item.created_at) >= startOfToday
    ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const weekTasks = history.filter(
      (item) => new Date(item.created_at) >= startOfWeek
    ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const currentTasks = currentMode === 'today' ? todayTasks : weekTasks;
    const completedTasks = currentTasks.filter(t => t.status === 'completed');
    const failedTasks = currentTasks.filter(t => t.status === 'failed');
    const successRate = currentTasks.length 
      ? Math.round((completedTasks.length / currentTasks.length) * 100) 
      : 0;

    const newSlides = [];

    // Slide 0: Intro
    newSlides.push({
      type: 'intro',
      title: currentMode === 'today' ? "Today's Journey" : "This Week's Journey",
      subtitle: "Let's see what you accomplished",
      icon: <RocketLaunchIcon className="w-24 h-24 text-purple-400" />
    });

    // Slide 1: Total Stats
    newSlides.push({
      type: 'stats',
      title: "Total Tasks",
      value: currentTasks.length,
      unit: "tasks",
      icon: <DocumentTextIcon className="w-16 h-16 text-blue-400" />,
      description: "You worked on these many tasks"
    });

    // Slide 2: Completion Rate
    newSlides.push({
      type: 'stats',
      title: "Success Rate",
      value: successRate,
      unit: "%",
      icon: <TrophyIcon className="w-16 h-16 text-yellow-400" />,
      description: "Tasks completed successfully"
    });

    // Slide 3: Completed vs Failed
    newSlides.push({
      type: 'comparison',
      completed: completedTasks.length,
      failed: failedTasks.length,
      icon: <CheckCircleIcon className="w-16 h-16 text-green-400" />
    });

    // Individual task slides
    currentTasks.forEach((task, index) => {
      newSlides.push({
        type: 'task',
        task: task,
        index: index,
        total: currentTasks.length,
        icon: getTaskIcon(task.task_name, "w-20 h-20")
      });
    });

    // Final motivational slide
    newSlides.push({
      type: 'outro',
      title: "Keep Going!",
      message: "Every task brings you closer to your goals",
      icon: <StarIcon className="w-24 h-24 text-yellow-400" />
    });

    setSlides(newSlides);
    setCurrentSlide(0);
  };

  // Auto-play slides
  useEffect(() => {
    if (!isPlaying || slides.length === 0) return;

    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else {
        // Reached the end, show mode selector
        setIsPlaying(false);
        setShowModeSelector(true);
      }
    }, 4000); // 4 seconds per slide

    return () => clearTimeout(timer);
  }, [currentSlide, isPlaying, slides]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setIsPlaying(false);
    } else {
      setIsPlaying(false);
      setShowModeSelector(true);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setIsPlaying(false);
    }
  };

  const handleModeSelect = (mode) => {
    setCurrentMode(mode);
    setShowModeSelector(false);
    setIsPlaying(true);
    setCurrentSlide(0);
  };

  const resetAndClose = () => {
    setShowModeSelector(true);
    setCurrentSlide(0);
    setIsPlaying(false);
    onClose();
  };

  if (!isOpen) return null;

  const currentSlideData = slides[currentSlide];

  // Render different slide types
  const renderSlide = () => {
    if (!currentSlideData) return null;

    switch (currentSlideData.type) {
      case 'intro':
        return (
          <motion.div
            key="intro"
            initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="flex flex-col items-center justify-center h-full text-center px-4"
          >
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {currentSlideData.icon}
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mt-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {currentSlideData.title}
            </motion.h1>
            <motion.p 
              className="text-xl text-slate-300 mt-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {currentSlideData.subtitle}
            </motion.p>
          </motion.div>
        );

      case 'stats':
        return (
          <motion.div
            key="stats"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex flex-col items-center justify-center h-full text-center px-4"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 0.8 }}
            >
              {currentSlideData.icon}
            </motion.div>
            <motion.div 
              className="text-7xl md:text-9xl font-bold mt-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <CountUp end={currentSlideData.value} duration={2} />
              {currentSlideData.unit}
            </motion.div>
            <motion.p 
              className="text-2xl text-slate-300 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {currentSlideData.title}
            </motion.p>
            <motion.p 
              className="text-lg text-slate-400 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {currentSlideData.description}
            </motion.p>
          </motion.div>
        );

      case 'comparison':
        return (
          <motion.div
            key="comparison"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="flex flex-col items-center justify-center h-full px-4"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              {currentSlideData.icon}
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mt-8 mb-8">Task Results</h2>
            <div className="flex gap-8 md:gap-16">
              <motion.div 
                className="text-center"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto" />
                <div className="text-4xl md:text-6xl font-bold text-green-400 mt-4">
                  <CountUp end={currentSlideData.completed} duration={2} />
                </div>
                <p className="text-lg text-slate-300 mt-2">Completed</p>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <XCircleIcon className="w-16 h-16 text-red-400 mx-auto" />
                <div className="text-4xl md:text-6xl font-bold text-red-400 mt-4">
                  <CountUp end={currentSlideData.failed} duration={2} />
                </div>
                <p className="text-lg text-slate-300 mt-2">Failed</p>
              </motion.div>
            </div>
          </motion.div>
        );

      case 'task':
        const task = currentSlideData.task;
        const taskDate = new Date(task.created_at);
        return (
          <motion.div
            key={`task-${task._id}`}
            initial={{ x: 300, opacity: 0, rotateY: 90 }}
            animate={{ x: 0, opacity: 1, rotateY: 0 }}
            exit={{ x: -300, opacity: 0, rotateY: -90 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-full px-4"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{ duration: 0.6 }}
            >
              {currentSlideData.icon}
            </motion.div>
            
            <div className="mt-8 text-center max-w-2xl">
              <motion.div 
                className="text-sm text-white mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Task {currentSlideData.index + 1} of {currentSlideData.total}
              </motion.div>
              
              <motion.h2 
                className="text-3xl md:text-5xl font-bold mb-4 text-white"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {task.task_name}
              </motion.h2>
              
              <motion.div 
                className="flex items-center justify-center gap-2 mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                {task.status === 'completed' ? (
                  <>
                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                    <span className="text-white">Completed Successfully</span>
                  </>
                ) : task.status === 'failed' ? (
                  <>
                    <XCircleIcon className="w-6 h-6 text-red-400" />
                    <span className="text-red-400">Failed</span>
                  </>
                ) : (
                  <>
                    <ClockIcon className="w-6 h-6 text-yellow-400" />
                    <span className="text-yellow-400">In Progress</span>
                  </>
                )}
              </motion.div>
              
              {task.result && (
                <motion.p 
                  className="text-lg text-slate-300 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  {typeof task.result === 'string' 
                    ? task.result.slice(0, 200)
                    : JSON.stringify(task.result).slice(0, 200)}
                  {(task.result && (task.result.length > 200 || typeof task.result === 'object')) && "..."}
                </motion.p>
              )}
              
              <motion.div 
                className="flex items-center justify-center gap-2 text-sm text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <ClockIcon className="w-4 h-4" />
                <span>{formatDistanceToNow(taskDate, { addSuffix: true })}</span>
                <span>•</span>
                <span>{format(taskDate, 'hh:mm a')}</span>
              </motion.div>
              
              {task.error && (
                <motion.div 
                  className="mt-4 p-3 bg-red-500/20 rounded-lg text-red-300 text-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  {task.error}
                </motion.div>
              )}
            </div>
          </motion.div>
        );

      case 'outro':
        return (
          <motion.div
            key="outro"
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 180 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="flex flex-col items-center justify-center h-full text-center px-4"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {currentSlideData.icon}
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mt-8 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {currentSlideData.title}
            </motion.h1>
            <motion.p 
              className="text-xl text-slate-300 mt-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {currentSlideData.message}
            </motion.p>
            <motion.button
              onClick={resetAndClose}
              className="mt-8 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Close Story
            </motion.button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Mode Selection Screen
  if (showModeSelector) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 z-50 flex items-center justify-center"
      >
        <div className="text-center px-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <SparklesIcon className="w-24 h-24 text-purple-400 mx-auto mb-8" />
          </motion.div>
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Your Activity Story
          </motion.h1>
          <motion.p 
            className="text-xl text-slate-300 mb-12"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Choose your story timeline
          </motion.p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <motion.button
              onClick={() => handleModeSelect('today')}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-semibold text-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <CalendarIcon className="w-6 h-6 inline-block mr-2" />
              Today's Story
            </motion.button>
            <motion.button
              onClick={() => handleModeSelect('week')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl font-semibold text-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <FireIcon className="w-6 h-6 inline-block mr-2" />
              This Week's Story
            </motion.button>
          </div>
          
          <motion.button
            onClick={onClose}
            className="mt-8 text-slate-400 hover:text-white transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Main Story View
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 overflow-hidden"
    >
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 flex gap-1 p-2 z-20">
        {slides.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ 
                width: currentSlide > index ? "100%" : 
                       currentSlide === index && isPlaying ? "100%" : "0%"
              }}
              transition={{ duration: currentSlide === index && isPlaying ? 4 : 0 }}
            />
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="fixed top-1/2 left-4 transform -translate-y-1/2 z-20">
        <motion.button
          onClick={prevSlide}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-all"
          disabled={currentSlide === 0}
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </motion.button>
      </div>
      
      <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-20">
        <motion.button
          onClick={nextSlide}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-all"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Play/Pause Button */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <motion.button
          onClick={() => setIsPlaying(!isPlaying)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all"
        >
          {isPlaying ? (
            <PauseIcon className="w-5 h-5" />
          ) : (
            <PlayIcon className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      {/* Close Button */}
      <button
        onClick={resetAndClose}
        className="fixed top-4 right-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-all z-20"
      >
        Close
      </button>

      {/* Slide Content */}
      <div className="h-full w-full">
        <AnimatePresence mode="wait">
          {renderSlide()}
        </AnimatePresence>
      </div>

    </motion.div>
  );
};

export default ActivityReplay;