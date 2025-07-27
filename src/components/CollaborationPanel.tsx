'use client';

import { motion } from 'framer-motion';
import { ChatBubbleLeftIcon, PaperClipIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const mockMessages = [
  {
    id: 1,
    user: 'Dr. Sarah Chen',
    avatar: 'SC',
    message:
      'Just completed the initial analysis of the neural interface data. The signal-to-noise ratio is better than expected.',
    timestamp: '10:30 AM',
  },
  {
    id: 2,
    user: 'Dr. Marcus Rodriguez',
    avatar: 'MR',
    message:
      "Excellent! I'll review the protein folding predictions this afternoon. The new algorithm seems promising.",
    timestamp: '10:32 AM',
  },
];

const mockFiles = [
  {
    name: 'Neural_Interface_Analysis.pdf',
    size: '2.4 MB',
    type: 'PDF',
  },
  {
    name: 'Protein_Folding_Data.xlsx',
    size: '1.8 MB',
    type: 'Excel',
  },
];

export const CollaborationPanel = () => {
  const [newMessage, setNewMessage] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 rounded-xl border border-emerald-500/30 p-6"
    >
      <h2 className="text-2xl font-semibold text-emerald-400 mb-6">Collaboration Nexus</h2>

      <div className="space-y-6">
        <div className="bg-slate-800/30 rounded-lg p-4 border border-emerald-500/10">
          <h3 className="text-lg font-medium text-emerald-300 mb-4">Team Messages</h3>
          <div className="space-y-4">
            {mockMessages.map(msg => (
              <motion.div key={msg.id} whileHover={{ scale: 1.01 }} className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400">
                    {msg.avatar}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-300 font-medium">{msg.user}</span>
                    <span className="text-emerald-200/50 text-sm">{msg.timestamp}</span>
                  </div>
                  <p className="text-emerald-200/70 mt-1">{msg.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-800/50 border border-emerald-500/20 rounded-lg py-2 px-4 text-emerald-50 placeholder-emerald-200/30 focus:outline-none focus:border-emerald-500/40"
            />
            <button className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors">
              <ChatBubbleLeftIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="bg-slate-800/30 rounded-lg p-4 border border-emerald-500/10">
          <h3 className="text-lg font-medium text-emerald-300 mb-4">Shared Files</h3>
          <div className="space-y-3">
            {mockFiles.map(file => (
              <motion.div
                key={file.name}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-emerald-500/10"
              >
                <div className="flex items-center gap-3">
                  <PaperClipIcon className="h-5 w-5 text-emerald-400" />
                  <div>
                    <p className="text-emerald-300">{file.name}</p>
                    <p className="text-emerald-200/50 text-sm">{file.size}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-emerald-900/30 text-emerald-400 text-sm rounded-full">
                  {file.type}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
