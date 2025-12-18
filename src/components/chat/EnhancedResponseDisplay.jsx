// components/emails/EmailDisplay.jsx
import { motion } from 'framer-motion';
import { FiMail, FiUser, FiCalendar, FiTag, FiExternalLink, FiChevronRight, FiBookmark, FiArchive } from 'react-icons/fi';
import { format, formatDistanceToNow, parseISO } from 'date-fns';

const EmailDisplay = ({ emailData }) => {
  // Parse the email data
  const emails = emailData?.emails || [];
  const status = emailData?.status || 'no_emails';

  // Format date
  const formatEmailDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      const now = new Date();
      const diffInDays = (now - date) / (1000 * 60 * 60 * 24);
      
      if (diffInDays < 1) {
        return format(date, 'h:mm a');
      } else if (diffInDays < 7) {
        return format(date, 'EEE');
      } else {
        return format(date, 'MMM d');
      }
    } catch (error) {
      return dateString;
    }
  };

  const formatFullDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM d, yyyy • h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  // Extract name from email
  const extractName = (fromString) => {
    const match = fromString.match(/(.*?)\s*<(.+?)>/);
    if (match) {
      return match[1].trim();
    }
    return fromString.split('@')[0];
  };

  // Extract email address
  const extractEmail = (fromString) => {
    const match = fromString.match(/<(.+?)>/);
    if (match) {
      return match[1];
    }
    return fromString;
  };

  // Get status message
  const getStatusMessage = () => {
    switch(status) {
      case 'emails_fetched':
        return `Fetched ${emails.length} unread email${emails.length !== 1 ? 's' : ''}`;
      case 'no_emails':
        return 'No unread emails found';
      case 'error':
        return 'Error fetching emails';
      default:
        return 'Email status';
    }
  };

  if (!emails.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 p-6"
      >
        <div className="flex flex-col items-center justify-center text-center py-8">
          <div className="w-16 h-16 rounded-full bg-[#f3f4ff] flex items-center justify-center mb-4">
            <FiMail className="text-[#6264a7]" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Unread Emails</h3>
          <p className="text-sm text-slate-600 max-w-md">
            Your inbox is clean! No unread emails found from today.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 bg-gradient-to-r from-[#f3f4ff] to-white rounded-2xl border border-[#e0e2ff]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6264a7] to-[#505ac9] flex items-center justify-center">
            <FiMail className="text-white" size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Email Digest</h3>
            <p className="text-xs text-slate-600">{getStatusMessage()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 font-medium">
            {emails.length} new
          </span>
        </div>
      </motion.div>

      {/* Email List */}
      <div className="space-y-3">
        {emails.map((email, index) => (
          <motion.div
            key={email.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.005, y: -2 }}
            className="group bg-white rounded-xl border border-slate-200 hover:border-[#6264a7]/30 
                      shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            <div className="p-4">
              {/* Email Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3 flex-1">
                  {/* Sender Avatar */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6264a7] to-[#8a8dff] 
                                  flex items-center justify-center text-white font-semibold text-sm">
                      {extractName(email.from).charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border-2 border-white">
                      <FiMail className="text-[#6264a7] text-xs" />
                    </div>
                  </div>

                  {/* Sender Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900 truncate">
                          {extractName(email.from)}
                        </h4>
                        <p className="text-xs text-slate-500 truncate">
                          {extractEmail(email.from)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                          {formatEmailDate(email.date)}
                        </span>
                        <FiChevronRight className="text-slate-400 group-hover:text-[#6264a7] transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <h3 className="text-sm font-semibold text-slate-900 mb-2 line-clamp-2">
                {email.subject}
              </h3>

              {/* Snippet */}
              <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                {email.snippet || "No preview available"}
              </p>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-1 rounded bg-[#f3f4ff] text-[#6264a7] font-medium">
                    Newsletter
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <FiCalendar size={12} />
                    <span>{formatFullDate(email.date)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                    <FiBookmark size={14} />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                    <FiArchive size={14} />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                    <FiExternalLink size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Unread indicator */}
            <div className="h-1 bg-gradient-to-r from-[#6264a7] via-[#505ac9] to-[#8a8dff]" />
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: emails.length * 0.05 + 0.1 }}
        className="grid grid-cols-3 gap-3 p-4 bg-gradient-to-r from-white to-slate-50 rounded-2xl border border-slate-200"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-[#6264a7]">{emails.length}</div>
          <div className="text-xs text-slate-600">Total Emails</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#6264a7]">
            {emails.filter(e => e.subject.toLowerCase().includes('newsletter')).length}
          </div>
          <div className="text-xs text-slate-600">Newsletters</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#6264a7]">
            {new Set(emails.map(e => extractEmail(e.from))).size}
          </div>
          <div className="text-xs text-slate-600">Unique Senders</div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: emails.length * 0.05 + 0.2 }}
        className="flex items-center justify-between p-4 bg-gradient-to-r from-[#f3f4ff]/20 to-white rounded-2xl border border-slate-200"
      >
        <div className="text-sm text-slate-600">
          Need to take action on these emails?
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg 
                           hover:border-[#6264a7] hover:text-[#6264a7] transition-colors">
            Mark as Read
          </button>
          <button className="px-3 py-1.5 text-xs font-medium bg-[#6264a7] text-white rounded-lg 
                           hover:bg-[#505ac9] transition-colors">
            Open in Gmail
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Helper component to parse and display different types of responses
const EnhancedResponseDisplay = ({ reply }) => {
    console.log(reply)
  if (!reply) return null;

  // Check if it's email data
  if (reply.status && reply.status.includes('emails') && Array.isArray(reply.emails)) {
    return <EmailDisplay emailData={reply} />;
  }

  // Check if it's calendar data
  if (reply.status && reply.status.includes('calendar') && Array.isArray(reply.events)) {
    // You can create a similar CalendarDisplay component
    return (
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6264a7] to-[#505ac9] flex items-center justify-center">
            <FiCalendar className="text-white" size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Calendar Events</h3>
            <p className="text-xs text-slate-600">{reply.status.replace('_', ' ')}</p>
          </div>
        </div>
        <pre className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg overflow-x-auto">
          {JSON.stringify(reply, null, 2)}
        </pre>
      </div>
    );
  }

  // Check if it's web data
  if (reply.status && reply.status.includes('web') && reply.data) {
    return (
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6264a7] to-[#505ac9] flex items-center justify-center">
            <FiGlobe className="text-white" size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Web Results</h3>
            <p className="text-xs text-slate-600">{reply.status.replace('_', ' ')}</p>
          </div>
        </div>
        <pre className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg overflow-x-auto">
          {JSON.stringify(reply, null, 2)}
        </pre>
      </div>
    );
  }

  // Default JSON display for other responses
  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6264a7] to-[#505ac9] flex items-center justify-center">
          <FiCpu className="text-white" size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">AutoPilot Response</h3>
          <p className="text-xs text-slate-600">{reply.status || 'Response received'}</p>
        </div>
      </div>
      <pre className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg overflow-x-auto">
        {JSON.stringify(reply, null, 2)}
      </pre>
    </div>
  );
};

export default EnhancedResponseDisplay;