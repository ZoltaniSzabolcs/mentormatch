import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, Send, Edit3, Video, Info, CheckCheck, Check } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: number;
  from: 'me' | 'them';
  text: string;
  ts: string;
  optimistic?: boolean;
  fresh?: boolean;
}

interface Conversation {
  id: string;
  name: string;
  title: string;
  initials: string;
  online: boolean;
  unread: number;
  lastMsg: string | undefined;
  lastTime: string;
  messages: Message[];
}

type WsStatus = 'connecting' | 'connected' | 'error';

// ─── WebSocket hook ────────────────────────────────────────────────────────────
// Replace WS_URL with your real endpoint. The hook exposes send() and the
// last inbound message. It reconnects automatically on drop.

const WS_URL = 'wss://your-api.example.com/ws/chat';

function useWebSocket(onMessage: (data: { conversationId: string; text: string }) => void) {
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<WsStatus>('connecting');

  const connect = useCallback(() => {
    setStatus('connecting');
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => setStatus('connected');

    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        onMessage(data);
      } catch {
        /* ignore malformed frames */
      }
    };

    ws.onerror = () => setStatus('error');

    ws.onclose = () => {
      setStatus('error');
      // Reconnect after 3 s
      setTimeout(connect, 3000);
    };

    return ws;
  }, [onMessage]);

  useEffect(() => {
    const ws = connect();
    return () => {
      ws.onclose = null; // prevent reconnect loop on unmount
      ws.close();
    };
  }, [connect]);

  const send = useCallback((payload: { conversationId: string; text: string }) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);

  return { status, send };
}

// ─── Seed data ────────────────────────────────────────────────────────────────
// Swap these out for data fetched from your API.

const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    name: 'Dr. Sarah Chen',
    title: 'CTO · Amazon',
    initials: 'SC',
    online: true,
    unread: 2,
    lastMsg: 'See you tomorrow at 2 PM!',
    lastTime: '2m ago',
    messages: [
      {
        id: 1,
        from: 'them',
        text: 'Hi John! Looking forward to our session tomorrow.',
        ts: 'Yesterday 9:41 AM',
      },
      {
        id: 2,
        from: 'them',
        text: "I reviewed your goals — let's focus on stakeholder communication first.",
        ts: 'Yesterday 9:42 AM',
      },
      {
        id: 3,
        from: 'me',
        text: "That sounds perfect, I've been struggling with that.",
        ts: 'Yesterday 9:50 AM',
      },
      {
        id: 4,
        from: 'them',
        text: 'See you tomorrow at 2 PM!',
        ts: 'Today 8:03 AM',
      },
    ],
  },
  {
    id: 'conv2',
    name: 'Marcus Williams',
    title: 'VP Product · Stripe',
    initials: 'MW',
    online: false,
    unread: 0,
    lastMsg: "Great, I'll send over the framework.",
    lastTime: 'Fri',
    messages: [
      {
        id: 1,
        from: 'me',
        text: 'Marcus, would you be able to share the product strategy framework you mentioned?',
        ts: 'Fri 3:12 PM',
      },
      {
        id: 2,
        from: 'them',
        text: 'Of course! Let me pull it up.',
        ts: 'Fri 3:45 PM',
      },
      {
        id: 3,
        from: 'them',
        text: "Great, I'll send over the framework.",
        ts: 'Fri 3:46 PM',
      },
    ],
  },
  {
    id: 'conv3',
    name: 'Angela Rodriguez',
    title: 'VP Product · Meta',
    initials: 'AR',
    online: true,
    unread: 1,
    lastMsg: 'Can we reschedule to next week?',
    lastTime: 'Thu',
    messages: [
      {
        id: 1,
        from: 'them',
        text: 'Hey! Quick question — are you free for a 30-min check-in?',
        ts: 'Thu 11:20 AM',
      },
      {
        id: 2,
        from: 'me',
        text: 'Hi Angela! Let me check my calendar…',
        ts: 'Thu 11:35 AM',
      },
      {
        id: 3,
        from: 'them',
        text: 'Can we reschedule to next week?',
        ts: 'Thu 11:40 AM',
      },
    ],
  },
];

// ─── Subcomponents ────────────────────────────────────────────────────────────

function ConnectionBanner({ status }: { status: WsStatus }) {
  if (status === 'connected') return null;
  return (
    <div className="flex items-center gap-2 px-4 py-1.5 text-xs bg-amber-50 border-b border-amber-100 text-amber-700">
      <span
        className={`w-1.5 h-1.5 rounded-full ${status === 'connecting' ? 'bg-amber-400 animate-pulse' : 'bg-red-400'}`}
      />
      {status === 'connecting' ? 'Connecting…' : 'Reconnecting…'}
    </div>
  );
}

function InitialsAvatar({ initials, size = 'md' }: { initials: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
  };
  return (
    <div
      className={`${sizes[size]} rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium shrink-0`}
    >
      {initials}
    </div>
  );
}

function MessageBubble({ msg, isLast }: { msg: Message; isLast: boolean }) {
  const sent = msg.from === 'me';
  return (
    <motion.div
      initial={msg.fresh ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: msg.optimistic ? 0.6 : 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`max-w-[72%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed break-words
        ${
          sent
            ? 'bg-blue-600 text-white rounded-br-sm self-end'
            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm self-start'
        }`}
    >
      {msg.text}
      {isLast && (
        <div
          className={`flex items-center gap-1 mt-0.5 text-[10px] ${sent ? 'justify-end text-blue-200' : 'text-slate-400'}`}
        >
          {sent && (msg.optimistic ? <Check className="w-3 h-3" /> : <CheckCheck className="w-3 h-3" />)}
          {msg.optimistic ? 'Sending…' : msg.ts}
        </div>
      )}
    </motion.div>
  );
}

function TypingIndicator({ initials }: { initials: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className="flex items-end gap-2"
    >
      <InitialsAvatar initials={initials} size="sm" />
      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-3.5 py-3 flex gap-1">
        {[0, 0.2, 0.4].map((delay, i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-slate-400"
            animate={{ y: [0, -5, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1.1,
              delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Conversation list ─────────────────────────────────────────────────────────

function ConversationList({
  conversations,
  onSelect,
}: {
  conversations: Conversation[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
        >
          <div className="relative">
            <InitialsAvatar initials={conv.initials} size="lg" />
            {conv.online && (
              <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-900 truncate">{conv.name}</div>
            <div className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMsg}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[11px] text-slate-400">{conv.lastTime}</div>
            {conv.unread > 0 && (
              <span className="mt-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-blue-600 text-white text-[10px] font-medium rounded-full">
                {conv.unread}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Chat view ─────────────────────────────────────────────────────────────────

function ChatView({
  conv,
  wsStatus,
  onSend,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onBack,
  typing,
}: {
  conv: Conversation;
  wsStatus: WsStatus;
  onSend: (text: string) => void;
  onBack: () => void;
  typing: boolean;
}) {
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conv.messages, typing]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [conv.id]);

  function handleSend() {
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Group consecutive messages by sender
  const groups: Message[][] = [];
  conv.messages.forEach((msg) => {
    const last = groups[groups.length - 1];
    const lastFirst = last?.[0];
    if (lastFirst && lastFirst.from === msg.from) last.push(msg);
    else groups.push([msg]);
  });

  return (
    <>
      <ConnectionBanner status={wsStatus} />
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-slate-50 flex flex-col gap-3">
        <div className="chat-date-separator text-center text-[11px] text-slate-400 py-1">Today</div>

        {groups.map((group) => {
          const sent = group[0]?.from === 'me';
          return (
            <div key={group[0]?.id} className={`flex items-end gap-2 ${sent ? 'flex-row-reverse' : ''}`}>
              {!sent && <InitialsAvatar initials={conv.initials} size="sm" />}
              <div className={`flex flex-col gap-1 ${sent ? 'items-end' : 'items-start'}`}>
                {group.map((msg, i) => (
                  <MessageBubble key={msg.id} msg={msg} isLast={i === group.length - 1} />
                ))}
              </div>
            </div>
          );
        })}

        <AnimatePresence>{typing && <TypingIndicator initials={conv.initials} />}</AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 bg-white border-t border-slate-100 flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
          }}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${conv.name.split(' ')[0]}…`}
          rows={1}
          className="flex-1 resize-none rounded-2xl bg-slate-100 border border-transparent focus:border-blue-400 focus:bg-white outline-none px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors leading-relaxed"
          style={{ maxHeight: 120 }}
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={!draft.trim()}
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors
            ${draft.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-default'}`}
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </>
  );
}

// ─── Main ChatPanel ────────────────────────────────────────────────────────────

interface ChatPanelProps {
  /** Pass a conversationId to jump straight into a thread (e.g. from "Send Message"). */
  initialConversationId?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

let msgCounter = 1000;

export function ChatPanel({ initialConversationId, isOpen, onClose }: ChatPanelProps) {
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    SEED_CONVERSATIONS.map((c) => ({
      ...c,
      messages: c.messages.map((m) => ({ ...m })),
    })),
  );
  const [view, setView] = useState<'list' | 'chat'>(initialConversationId ? 'chat' : 'list');
  const [activeId, setActiveId] = useState<string | null>(initialConversationId ?? null);

  const [typing, setTyping] = useState(false);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync with prop changes (e.g. clicking "Send Message" on a different mentor)
  useEffect(() => {
    if (isOpen) {
      if (initialConversationId) {
        setView('chat');
        setActiveId(initialConversationId);
        markRead(initialConversationId);
      } else {
        setView('list');
        setActiveId(null);
      }
    }
  }, [isOpen, initialConversationId]);

  const activeConv = conversations.find((c) => c.id === activeId) ?? null;

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  function markRead(id: string) {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }

  function handleSelectConv(id: string) {
    setView('chat');
    setActiveId(id);
    markRead(id);
    // Simulate the other party typing on first open
    const conv = conversations.find((c) => c.id === id);
    if (conv?.online && Math.random() > 0.5) {
      setTimeout(() => {
        setTyping(true);
        if (typingTimer.current) clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => setTyping(false), 2500);
      }, 900);
    }
  }

  // WebSocket integration
  const handleIncoming = useCallback((data: { conversationId: string; text: string }) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== data.conversationId) return c;
        const newMsg: Message = {
          id: ++msgCounter,
          from: 'them',
          text: data.text,
          ts: 'Just now',
          fresh: true,
        };
        return {
          ...c,
          messages: [...c.messages, newMsg],
          lastMsg: data.text,
        };
      }),
    );
  }, []);

  const { status: wsStatus, send: wsSend } = useWebSocket(handleIncoming);

  function handleSend(text: string) {
    if (!activeId) return;
    const optimisticId = ++msgCounter;
    const optimistic: Message = {
      id: optimisticId,
      from: 'me',
      text,
      ts: 'Just now',
      optimistic: true,
      fresh: true,
    };

    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, messages: [...c.messages, optimistic], lastMsg: text } : c)),
    );

    // Send over WebSocket
    wsSend({ conversationId: activeId, text });

    // Optimistic → confirmed after ~1 s
    setTimeout(
      () => {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== activeId) return c;
            return {
              ...c,
              messages: c.messages.map((m) => (m.id === optimisticId ? { ...m, optimistic: false, fresh: false } : m)),
            };
          }),
        );

        // Simulate reply (remove this block when real WebSocket is connected)
        const conv = conversations.find((c) => c.id === activeId);
        if (conv?.online && Math.random() > 0.3) {
          setTimeout(() => {
            setTyping(true);
            if (typingTimer.current) clearTimeout(typingTimer.current);
            typingTimer.current = setTimeout(
              () => {
                setTyping(false);
                const replies = [
                  'Thanks for sharing that!',
                  "That's a great point. Let me think…",
                  'Absolutely, we can cover that in our next session.',
                  "I'll prepare some materials on that topic.",
                  'Looking forward to diving deeper into this!',
                ];
                const replyText = replies[Math.floor(Math.random() * replies.length)] || '';
                setConversations((prev) =>
                  prev.map((c) =>
                    c.id === activeId
                      ? {
                          ...c,
                          messages: [
                            ...c.messages,
                            {
                              id: ++msgCounter,
                              from: 'them',
                              text: replyText,
                              ts: 'Just now',
                              fresh: true,
                            },
                          ],
                          lastMsg: replyText,
                        }
                      : c,
                  ),
                );
              },
              1800 + Math.random() * 1200,
            );
          }, 600);
        }
      },
      900 + Math.random() * 400,
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="chat-panel"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="fixed bottom-5 right-5 z-50 w-[380px] h-[560px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          role="dialog"
          aria-label="Chat"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-white shrink-0">
            {view === 'chat' && activeConv ? (
              <>
                <button
                  onClick={() => {
                    setView('list');
                    setActiveId(null);
                    setTyping(false);
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="relative">
                  <InitialsAvatar initials={activeConv.initials} size="md" />
                  {activeConv.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 truncate">{activeConv.name}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    {activeConv.online ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Active now
                      </>
                    ) : (
                      'Offline'
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                    aria-label="Video call"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                    aria-label="Info"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900">Messages</div>
                  {totalUnread > 0 && <div className="text-xs text-slate-500">{totalUnread} unread</div>}
                </div>
                <button
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                  aria-label="Compose"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          {view === 'list' ? (
            <>
              <ConnectionBanner status={wsStatus} />
              <ConversationList conversations={conversations} onSelect={handleSelectConv} />
            </>
          ) : activeConv ? (
            <ChatView
              conv={activeConv}
              wsStatus={wsStatus}
              onSend={handleSend}
              onBack={() => {
                setView('list');
                setActiveId(null);
                setTyping(false);
              }}
              typing={typing}
            />
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Hook: useChatPanel ────────────────────────────────────────────────────────
// Use this in any component that needs to open the chat panel.
//
// Example:
//   const { openChat, unreadCount, ChatPortal } = useChatPanel();
//   <button onClick={() => openChat("conv1")}>Send Message</button>
//   <ChatPortal />

export function useChatPanel() {
  const [open, setOpen] = useState(false);
  const [convId, setConvId] = useState<string | null>(null);
  const [conversations] = useState(SEED_CONVERSATIONS);

  const unreadCount = conversations.reduce((s, c) => s + c.unread, 0);

  function openChat(id?: string) {
    setConvId(id ?? null);
    setOpen(true);
  }

  function closeChat() {
    setOpen(false);
  }

  function ChatPortal() {
    return <ChatPanel isOpen={open} initialConversationId={convId} onClose={closeChat} />;
  }

  return { openChat, closeChat, unreadCount, ChatPortal };
}
