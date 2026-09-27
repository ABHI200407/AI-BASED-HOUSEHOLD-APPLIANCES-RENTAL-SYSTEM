import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, Sparkles, ChevronDown, RefreshCw, AlertCircle, 
  Cpu, CheckCircle2, ChevronRight, Zap, Play, Settings2 
} from 'lucide-react';
import axios from 'axios';

const SUGGESTED = [
  'What appliances are best for a 1BHK?',
  'Show refrigerators with free delivery',
  'How does the deposit and rental work?',
  'Do you offer washing machines?',
];

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '10px 4px 6px' }}>
      {[0, 0.2, 0.4].map((delay, i) => (
        <motion.span
          key={i}
          style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1', display: 'block' }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 0.7, delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi there! 👋 I'm your Rentova AI assistant. Ask me anything about appliance rentals, pricing, or recommendations.",
      model: 'rentai-llm',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState('');

  // Ollama local status & model discovery state
  const [ollamaStatus, setOllamaStatus] = useState({
    connected: false,
    checking: true,
    statusText: 'Detecting local models...',
    activeModel: '',
    models: [],
    device: 'CPU (Optimized)',
  });
  const [showModelPicker, setShowModelPicker] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      fetchOllamaStatus();
    }
  }, [isOpen]);

  // Query Ollama status & auto-discover models
  const fetchOllamaStatus = async (autoStart = false) => {
    setOllamaStatus((prev) => ({ ...prev, checking: true, statusText: 'Connecting to Ollama...' }));
    try {
      const url = 'http://localhost:8000/api/chat/status/';
      const response = autoStart 
        ? await axios.post(url, {})
        : await axios.get(url);
      
      const data = response.data;
      setOllamaStatus({
        connected: data.connected,
        checking: false,
        statusText: data.connected ? 'Online' : 'Offline',
        activeModel: data.active_model || 'qwen2.5:0.5b',
        models: data.models || [],
        device: data.device || 'CPU (Optimized)',
      });
    } catch (err) {
      setOllamaStatus((prev) => ({
        ...prev,
        connected: false,
        checking: false,
        statusText: 'Offline',
        error: 'Unable to reach backend / Ollama.',
      }));
    }
  };

  // Switch active local model
  const selectModel = async (modelName) => {
    setShowModelPicker(false);
    setOllamaStatus((prev) => ({ ...prev, activeModel: modelName }));
    try {
      await axios.post('http://localhost:8000/api/chat/status/', { model: modelName });
    } catch {
      // Ignored - backend fallbacks automatically
    }
  };

  const sendMessage = async (text, overrideModel = null) => {
    const userMessage = (text || input).trim();
    if (!userMessage) return;

    setLastUserMessage(userMessage);
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMessage, timestamp: timeNow },
    ]);
    setInput('');
    setIsLoading(true);

    const modelToUse = overrideModel || ollamaStatus.activeModel || 'rentai-llm:latest';
    let assistantText = '';
    let addedAssistant = false;

    try {
      const response = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage, 
          stream: true, 
          model: modelToUse 
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.error) throw new Error(data.error);

              if (data.token) {
                assistantText += data.token;
                if (!addedAssistant) {
                  addedAssistant = true;
                  setIsLoading(false);
                  setMessages((prev) => [
                    ...prev,
                    { 
                      role: 'assistant', 
                      content: assistantText, 
                      model: data.model || modelToUse, 
                      timestamp: timeNow 
                    },
                  ]);
                } else {
                  setMessages((prev) => {
                    const next = [...prev];
                    next[next.length - 1] = { 
                      role: 'assistant', 
                      content: assistantText, 
                      model: data.model || modelToUse, 
                      timestamp: timeNow 
                    };
                    return next;
                  });
                }
              }
              if (data.done) break;
            } catch (parseErr) {
              if (parseErr.message && !parseErr.message.includes('JSON')) {
                throw parseErr;
              }
            }
          }
        }
      }
    } catch (err) {
      if (!addedAssistant) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            isError: true,
            errorTitle: 'Ollama Response / Connection Error',
            errorMsg: err.message || 'Failed to communicate with local Ollama service.',
            model: modelToUse,
            timestamp: timeNow,
          },
        ]);
      }
      fetchOllamaStatus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const showSuggestions = messages.length === 1;

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 9999,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(79, 70, 229, 0.45)',
          color: '#fff',
        }}
        aria-label="Open AI Assistant"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <ChevronDown size={28} />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Sparkles size={26} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chatwindow"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            style={{
              position: 'fixed',
              bottom: 100,
              right: 28,
              zIndex: 9998,
              width: 410,
              maxWidth: 'calc(100vw - 32px)',
              height: 600,
              maxHeight: 'calc(100vh - 120px)',
              borderRadius: 24,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              background: '#ffffff',
              boxShadow: '0 25px 70px -15px rgba(0,0,0,0.22), 0 0 1px rgba(0,0,0,0.15)',
              border: '1px solid #e2e8f0',
              fontFamily: 'Manrope, sans-serif',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px 20px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexShrink: 0,
                color: '#ffffff',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Sparkles size={20} color="#fff" />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                  Rentova AI Assistant
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: ollamaStatus.connected ? '#10b981' : '#f59e0b',
                      display: 'inline-block',
                      boxShadow: ollamaStatus.connected ? '0 0 8px #10b981' : 'none',
                    }}
                  />
                  <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11.5, fontWeight: 500 }}>
                    {ollamaStatus.checking
                      ? 'Detecting Ollama...'
                      : ollamaStatus.connected
                      ? `Online · Local ${ollamaStatus.device}`
                      : 'Ollama Offline · Auto-reconnecting'}
                  </span>
                </div>
              </div>

              {/* Refresh / Re-check Button */}
              <button
                onClick={() => fetchOllamaStatus(true)}
                title="Auto-Detect & Connect Ollama"
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                  transition: 'background 0.2s',
                }}
              >
                <RefreshCw size={15} className={ollamaStatus.checking ? 'animate-spin' : ''} />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                }}
              >
                <X size={17} />
              </button>
            </div>

            {/* Model & Diagnostics Bar */}
            <div
              style={{
                padding: '8px 16px',
                background: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 12,
                color: '#475569',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Cpu size={14} color="#6366f1" />
                <span style={{ fontWeight: 600, color: '#1e293b' }}>Model:</span>
                <span
                  style={{
                    background: '#ede9fe',
                    color: '#6366f1',
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontWeight: 600,
                    fontSize: 11,
                  }}
                >
                  {ollamaStatus.activeModel || 'Auto-Detecting'}
                </span>
              </div>

              {/* Model Switcher Toggle */}
              {ollamaStatus.models.length > 0 && (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowModelPicker((prev) => !prev)}
                    style={{
                      background: 'none',
                      border: '1px solid #cbd5e1',
                      borderRadius: 10,
                      padding: '3px 8px',
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                    }}
                  >
                    <span>Switch</span>
                    <ChevronDown size={12} />
                  </button>

                  {/* Dropdown Menu */}
                  {showModelPicker && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: 4,
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 12,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        zIndex: 100,
                        width: 240,
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#94a3b8', borderBottom: '1px solid #f1f5f9' }}>
                        LOCAL OLLAMA MODELS
                      </div>
                      {ollamaStatus.models.map((m) => (
                        <div
                          key={m.name}
                          onClick={() => selectModel(m.name)}
                          style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: m.name === ollamaStatus.activeModel ? '#f5f3ff' : 'transparent',
                            color: m.name === ollamaStatus.activeModel ? '#6366f1' : '#1e293b',
                            fontSize: 12,
                            fontWeight: m.name === ollamaStatus.activeModel ? 600 : 400,
                          }}
                        >
                          <div>
                            <div>{m.name}</div>
                            <div style={{ fontSize: 10, color: '#94a3b8' }}>
                              {m.size_mb} MB · {m.param_size}
                            </div>
                          </div>
                          {m.name === ollamaStatus.activeModel && <CheckCircle2 size={14} color="#6366f1" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Offline Alert Banner (if disconnected) */}
            {!ollamaStatus.checking && !ollamaStatus.connected && (
              <div
                style={{
                  background: '#fffbeb',
                  borderBottom: '1px solid #fde68a',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#b45309' }}>
                  <AlertCircle size={16} color="#d97706" style={{ flexShrink: 0 }} />
                  <span>Ollama is not running locally.</span>
                </div>
                <button
                  onClick={() => fetchOllamaStatus(true)}
                  style={{
                    background: '#d97706',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Play size={11} fill="#fff" />
                  <span>Auto-Start</span>
                </button>
              </div>
            )}

            {/* Messages Stream */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                background: '#ffffff',
              }}
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      alignItems: 'flex-start',
                      gap: 8,
                      maxWidth: '85%',
                    }}
                  >
                    {msg.role === 'assistant' && (
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        <Sparkles size={14} color="#fff" />
                      </div>
                    )}

                    {/* Standard Message vs Error Card */}
                    {msg.isError ? (
                      <div
                        style={{
                          background: '#fef2f2',
                          border: '1px solid #fecaca',
                          borderRadius: 16,
                          padding: '12px 16px',
                          color: '#991b1b',
                          fontSize: 13,
                          lineHeight: 1.5,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, marginBottom: 4 }}>
                          <AlertCircle size={16} color="#dc2626" />
                          <span>{msg.errorTitle || 'Inference Error'}</span>
                        </div>
                        <div style={{ color: '#7f1d1d', marginBottom: 10 }}>{msg.errorMsg}</div>

                        {/* Interactive Recovery Action Buttons */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                          <button
                            onClick={() => {
                              fetchOllamaStatus(true);
                              if (lastUserMessage) sendMessage(lastUserMessage);
                            }}
                            style={{
                              background: '#dc2626',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 8,
                              padding: '5px 10px',
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <Play size={11} fill="#fff" />
                            <span>Auto-Start & Retry</span>
                          </button>

                          <button
                            onClick={() => {
                              selectModel('qwen2.5:0.5b');
                              if (lastUserMessage) sendMessage(lastUserMessage, 'qwen2.5:0.5b');
                            }}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #f87171',
                              color: '#b91c1c',
                              borderRadius: 8,
                              padding: '5px 10px',
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <Zap size={11} />
                            <span>Switch to Fast Model (qwen2.5)</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          padding: '10px 15px',
                          borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                          background: msg.role === 'user'
                            ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)'
                            : '#f1f5f9',
                          color: msg.role === 'user' ? '#ffffff' : '#0f172a',
                          fontSize: 13.5,
                          lineHeight: 1.55,
                          border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0',
                          wordBreak: 'break-word',
                          boxShadow: msg.role === 'user' ? '0 2px 8px rgba(79, 70, 229, 0.2)' : 'none',
                        }}
                      >
                        {msg.content}
                      </div>
                    )}
                  </div>

                  {/* Model & timestamp footnote */}
                  {msg.role === 'assistant' && !msg.isError && (
                    <div style={{ fontSize: 10, color: '#94a3b8', marginLeft: 36, marginTop: 3 }}>
                      {msg.model ? `${msg.model} · Local CPU` : 'Ollama Local'}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Sparkles size={14} color="#fff" />
                  </div>
                  <div
                    style={{
                      padding: '8px 14px',
                      borderRadius: '18px 18px 18px 4px',
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <TypingDots />
                  </div>
                </div>
              )}

              {/* Quick Questions Suggestions */}
              {showSuggestions && !isLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                  <span style={{ color: '#64748b', fontSize: 11.5, fontWeight: 600, paddingLeft: 2 }}>
                    Suggested queries:
                  </span>
                  {SUGGESTED.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 12,
                        color: '#4f46e5',
                        fontSize: 12.5,
                        fontWeight: 500,
                        padding: '9px 14px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#eef2ff';
                        e.currentTarget.style.borderColor = '#c7d2fe';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      <span>{q}</span>
                      <ChevronRight size={14} color="#a5b4fc" />
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSubmit}
              style={{
                padding: '12px 16px',
                background: '#ffffff',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about appliances, rentals, pricing..."
                style={{
                  flex: 1,
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: 14,
                  padding: '11px 16px',
                  color: '#0f172a',
                  fontSize: 13.5,
                  outline: 'none',
                  fontFamily: 'Manrope, sans-serif',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: input.trim()
                    ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
                    : '#e2e8f0',
                  border: 'none',
                  cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: input.trim() ? '#fff' : '#94a3b8',
                  transition: 'background 0.2s',
                  flexShrink: 0,
                }}
              >
                <Send size={18} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
