import React, { useState, useRef, useEffect } from 'react';
import { Send, Search, Bookmark, Plus, Infinity, Zap, Mic, Settings, X, Copy, User, MoreVertical, Edit, Share, Cloud, Link, Command, Moon, Sun, FileText, Sparkles, Pin, PinOff, LogOut, UserCircle, PanelLeftClose, PanelLeftOpen, Mail, Github, Container, Globe, BarChart3, Code2, Calendar, Save, Wallet, DollarSign, CreditCard, Trash2, Upload } from 'lucide-react';
import FileUploadZone from './FileUploadZone';

export default function TelosChat() {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTools, setActiveTools] = useState({ research: false });
  const [openDropdown, setOpenDropdown] = useState(null);
  const [renamingChat, setRenamingChat] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showProvidersDialog, setShowProvidersDialog] = useState(false);
  const [showConfigDropdown, setShowConfigDropdown] = useState(false);
  const [connectedProviders, setConnectedProviders] = useState([]);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [pinnedChats, setPinnedChats] = useState([]);
  const [showDashboard, setShowDashboard] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAddCreditsDialog, setShowAddCreditsDialog] = useState(false);
  const [creditAmount, setCreditAmount] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [configActiveSection, setConfigActiveSection] = useState('providers');
  const [showAgentsPage, setShowAgentsPage] = useState(false);
  const [showCreateAgentModal, setShowCreateAgentModal] = useState(false);
  const [showTasksPage, setShowTasksPage] = useState(false);
  const [agents, setAgents] = useState([]);
  const [currentAgentId, setCurrentAgentId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newAgent, setNewAgent] = useState({
    name: '',
    description: '',
    personality: '',
    model: 'gpt-4',
    tools: [],
    memoryEnabled: true
  });
  
  // Research Tools in Input
  const [showResearchToolsMenu, setShowResearchToolsMenu] = useState(false);
  const [activeResearchTool, setActiveResearchTool] = useState(null);
  
  // File Upload
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  // Memory & Context System (placeholder for future implementation)
  // const [userMemory, setUserMemory] = useState({
  //   preferences: {},
  //   pastDecisions: [],
  //   uploadedDocuments: [],
  //   conversationHistory: []
  // });
  
  const messagesEndRef = useRef(null);
  // const quickUploadRef = useRef(null); // Commented out - placeholder for future implementation

  // User profile data
  const [userProfile, setUserProfile] = useState({
    name: "Alex Chen",
    email: "alex@telos.ai",
    github: "alexchen-dev",
    wallet: "0x742d35Cc6634C0532925a3b8D404fddF4f780EAD",
    credits: 2847.50,
    avatar: null, // Will use initials fallback
    initials: "AC",
    memberSince: new Date('2024-01-15')
  });

  // Temporary profile data for editing
  const [tempProfile, setTempProfile] = useState({});

  // Default agents
  const defaultAgents = React.useMemo(() => [
    {
      id: 'research-analyst',
      name: 'Research Analyst',
      description: 'Finds and summarizes key insights from web and uploaded documents.',
      avatar: '🧠',
      model: 'gpt-4-turbo',
      personality: 'You are a precise, data-driven researcher who excels at finding and synthesizing information from multiple sources. You provide thorough analysis with clear citations and actionable insights.',
      tools: ['web_search', 'file_reader', 'data_analysis'],
      memoryEnabled: true,
      createdAt: new Date('2024-01-15'),
      isDefault: true
    },
    {
      id: 'technical-expert',
      name: 'Technical Expert',
      description: 'Specialized in software development, architecture, and technical problem-solving.',
      avatar: '⚙️',
      model: 'gpt-4',
      personality: 'You are a senior software engineer with deep expertise in system design, coding best practices, and technical architecture. You provide practical, implementable solutions with clear explanations.',
      tools: ['code_executor', 'system_design', 'debugging'],
      memoryEnabled: true,
      createdAt: new Date('2024-01-20'),
      isDefault: true
    },
    {
      id: 'strategy-advisor',
      name: 'Strategy Advisor',
      description: 'Business strategy, market analysis, and strategic planning expertise.',
      avatar: '💼',
      model: 'claude-3',
      personality: 'You are a strategic business consultant with expertise in market analysis, competitive intelligence, and long-term planning. You think systematically about business challenges and opportunities.',
      tools: ['market_research', 'competitive_analysis', 'financial_modeling'],
      memoryEnabled: true,
      createdAt: new Date('2024-01-25'),
      isDefault: true
    }
  ], []);

  // Initialize agents with defaults if empty
  React.useEffect(() => {
    if (agents.length === 0) {
      setAgents(defaultAgents);
    }
  }, [agents.length, defaultAgents]);

  // Default tasks
  const defaultTasks = React.useMemo(() => [
    {
      id: 'task-1',
      title: 'Analyze Q4 Revenue Data',
      description: 'Review quarterly revenue trends and identify growth opportunities',
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
      assignedAgent: 'research-analyst',
      createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
      tags: ['analysis', 'revenue', 'quarterly']
    },
    {
      id: 'task-2',
      title: 'System Architecture Review',
      description: 'Evaluate current system architecture and propose improvements',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date(Date.now() + 86400000 * 7), // 1 week from now
      assignedAgent: 'technical-expert',
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      tags: ['architecture', 'technical', 'review']
    },
    {
      id: 'task-3',
      title: 'Market Expansion Strategy',
      description: 'Develop strategy for entering new geographic markets',
      status: 'completed',
      priority: 'high',
      dueDate: new Date(Date.now() - 86400000), // Yesterday
      assignedAgent: 'strategy-advisor',
      createdAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
      tags: ['strategy', 'expansion', 'market']
    },
    {
      id: 'task-4',
      title: 'Customer Feedback Analysis',
      description: 'Analyze recent customer feedback and identify improvement areas',
      status: 'in-progress',
      priority: 'medium',
      dueDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
      assignedAgent: 'research-analyst',
      createdAt: new Date(),
      tags: ['feedback', 'customer', 'analysis']
    }
  ], []);

  // Initialize tasks with defaults if empty
  React.useEffect(() => {
    if (tasks.length === 0) {
      setTasks(defaultTasks);
    }
  }, [tasks.length, defaultTasks]);

  // Tasks functions
  const handleTasksClick = () => {
    setShowTasksPage(true);
    setShowAgentsPage(false); // Ensure only one page is active
  };

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600';
      case 'in-progress':
        return darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600';
      case 'pending':
        return darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-600';
      default:
        return darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600';
      case 'medium':
        return darkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-600';
      case 'low':
        return darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600';
      default:
        return darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600';
    }
  };

  // Available tools for agents
  const availableTools = [
    { id: 'web_search', name: 'Web Search', description: 'Search the internet for information' },
    { id: 'file_reader', name: 'File Reader', description: 'Read and analyze uploaded documents' },
    { id: 'data_analysis', name: 'Data Analysis', description: 'Analyze datasets and generate insights' },
    { id: 'code_executor', name: 'Code Executor', description: 'Run and test code snippets' },
    { id: 'system_design', name: 'System Design', description: 'Create technical architecture diagrams' },
    { id: 'debugging', name: 'Debugging', description: 'Debug and troubleshoot code issues' },
    { id: 'market_research', name: 'Market Research', description: 'Research market trends and opportunities' },
    { id: 'competitive_analysis', name: 'Competitive Analysis', description: 'Analyze competitors and market position' },
    { id: 'financial_modeling', name: 'Financial Modeling', description: 'Create financial projections and models' }
  ];

  // Available models
  const availableModels = [
    { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model for complex reasoning' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Faster GPT-4 with recent knowledge' },
    { id: 'claude-3', name: 'Claude 3', description: 'Excellent for analysis and writing' },
    { id: 'mistral', name: 'Mistral', description: 'Fast and efficient for most tasks' }
  ];

  // Get current chat messages
  const currentChat = chats.find(chat => chat.id === currentChatId);
  const messages = React.useMemo(() => {
    return currentChat ? currentChat.messages : [];
  }, [currentChat]);

  // Filter chats based on search and bookmark view
  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBookmark = showBookmarks ? chat.bookmarked : true;
    return matchesSearch && matchesBookmark;
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
      setShowConfigDropdown(false);
      setShowProfileDropdown(false);
      setShowResearchToolsMenu(false);
    };

    if (openDropdown || showConfigDropdown || showProfileDropdown || showResearchToolsMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown, showConfigDropdown, showProfileDropdown, showResearchToolsMenu]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Command Palette (Cmd+K or Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      // Close Command Palette (Escape)
      if (e.key === 'Escape' && showCommandPalette) {
        setShowCommandPalette(false);
        setCommandQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showCommandPalette]);

  // Create a new empty chat
  const createNewChat = () => {
    const newChatId = Date.now();
    const newChat = {
      id: newChatId,
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date()
    };
    
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    setCurrentAgentId(null); // Clear current agent
    setShowAgentsPage(false); // Return to chat view
    setShowTasksPage(false); // Return to chat view
    setActiveTools({ research: false });
  };

  // Switch to a different chat
  const switchToChat = (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    setCurrentChatId(chatId);
    setCurrentAgentId(chat?.agentId || null); // Set agent if chat has one
    setShowAgentsPage(false); // Return to chat view
    setShowTasksPage(false); // Return to chat view
    setActiveTools({ research: false });
  };

  // Update chat title based on first message
  const updateChatTitle = (chatId, firstMessage) => {
    const title = firstMessage.length > 30 
      ? firstMessage.substring(0, 30) + '...' 
      : firstMessage;
    
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, title }
        : chat
    ));
  };

  // Handle dropdown menu actions
  const handleDropdownClick = (e, chatId) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === chatId ? null : chatId);
  };

  const startRename = (chatId, currentTitle) => {
    setRenamingChat(chatId);
    setRenameValue(currentTitle);
    setOpenDropdown(null);
  };

  const handleRename = (chatId) => {
    if (renameValue.trim()) {
      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, title: renameValue.trim() }
          : chat
      ));
    }
    setRenamingChat(null);
    setRenameValue('');
  };

  const handleBookmark = (chatId) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, bookmarked: !chat.bookmarked }
        : chat
    ));
    setOpenDropdown(null);
  };

  const handleShare = (chatId) => {
    // Simulate share functionality
    navigator.clipboard?.writeText(`Chat shared: ${chats.find(c => c.id === chatId)?.title}`);
    setOpenDropdown(null);
  };

  const handleDeleteChat = (chatId) => {
    // Remove chat from chats array
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    
    // Remove from pinned chats if it was pinned
    setPinnedChats(prev => prev.filter(p => p.id !== chatId));
    
    // If this was the current chat, switch to another chat or clear current
    if (currentChatId === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      if (remainingChats.length > 0) {
        setCurrentChatId(remainingChats[0].id);
      } else {
        setCurrentChatId(null);
      }
    }
    
    setOpenDropdown(null);
  };

  const agentResponses = [
    'I have analyzed your request comprehensively. Based on the available context, here are my findings and recommendations for moving forward.',
    'Processing your query with enterprise-grade reasoning. The analysis reveals several key insights that should guide your decision-making.',
    'Excellent question. I am leveraging both research capabilities and extended reasoning to provide you with a thorough analysis.',
    'I am evaluating this systematically across multiple dimensions. Here is what the data indicates...'
  ];

  const simulateAgentResponse = async () => {
    if (!currentChatId) return;
    await simulateAgentResponseForChat(currentChatId);
  };

  const simulateAgentResponseForChat = async (chatId) => {
    if (!chatId) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    const currentChat = chats.find(chat => chat.id === chatId);
    const agent = currentChat?.agentId ? agents.find(a => a.id === currentChat.agentId) : null;
    
    let responseContent;
    
    if (agent) {
      // Agent-specific responses based on their role
      const agentResponses = {
        'research-analyst': [
          'Based on my analysis of available data sources, I\'ve identified several key insights that warrant your attention.',
          'I\'ve conducted a comprehensive research review and synthesized the findings into actionable recommendations.',
          'My research indicates significant patterns in the data that could inform your strategic decisions.',
          'After analyzing multiple sources, I\'ve compiled a detailed assessment with supporting evidence.'
        ],
        'technical-expert': [
          'I\'ve reviewed the technical architecture and identified several optimization opportunities.',
          'From a systems perspective, here\'s my analysis of the current implementation and recommended improvements.',
          'Based on engineering best practices, I\'ve outlined a solution that addresses scalability and maintainability.',
          'My technical assessment reveals both immediate fixes and long-term architectural considerations.'
        ],
        'strategy-advisor': [
          'From a strategic standpoint, I\'ve evaluated the market dynamics and competitive landscape.',
          'My business analysis reveals key opportunities for growth and risk mitigation strategies.',
          'Based on market intelligence, I\'ve developed a framework for strategic decision-making.',
          'I\'ve assessed the competitive positioning and identified strategic advantages to leverage.'
        ]
      };
      
      const responses = agentResponses[agent.id] || agentResponses['research-analyst'];
      responseContent = responses[Math.floor(Math.random() * responses.length)];
    } else {
      // Default Telos responses
      responseContent = agentResponses[Math.floor(Math.random() * agentResponses.length)];
    }
    
    const newMessage = {
      id: Date.now() + Math.random(),
      type: 'agent',
      content: responseContent,
      timestamp: new Date(),
      tools: { ...activeTools },
      agentId: agent?.id
    };
    
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { 
            ...chat, 
            messages: [...chat.messages, newMessage],
            lastActivity: new Date()
          }
        : chat
    ));
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Create new chat if none exists
    if (!currentChatId) {
      const newChatId = Date.now();
      const userMessage = {
        id: Date.now() + Math.random(),
        type: 'user',
        content: input,
        timestamp: new Date(),
        tools: { ...activeTools }
      };

      const newChat = {
        id: newChatId,
        title: input.length > 30 ? input.substring(0, 30) + '...' : input,
        messages: [userMessage],
        createdAt: new Date(),
        lastActivity: new Date()
      };
      
      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(newChatId);
      setCurrentAgentId(null);
      setShowAgentsPage(false);
      setShowTasksPage(false);
      setActiveTools({ research: false });
      setInput('');
      
      // Simulate agent response for the new chat
      await simulateAgentResponseForChat(newChatId);
      return;
    }

    handleSendToCurrentChat(input);
  };

  const handleSendToCurrentChat = async (messageContent, messageType = 'user') => {
    const message = {
      id: Date.now() + Math.random(),
      type: messageType,
      content: messageContent,
      timestamp: new Date(),
      tools: messageType === 'user' ? { ...activeTools } : undefined
    };

    setChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { 
            ...chat, 
            messages: [...chat.messages, message],
            lastActivity: new Date()
          }
        : chat
    ));

    // Update chat title if this is the first message
    const currentChatMessages = chats.find(chat => chat.id === currentChatId)?.messages || [];
    if (currentChatMessages.length === 0) {
      updateChatTitle(currentChatId, messageContent);
    }

    if (messageType === 'user') {
      setInput('');
      await simulateAgentResponse();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    setInputFocused(false);
  };

  // Handle file uploads
  const handleFilesUploaded = (files) => {
    setUploadedFiles(files);
    
    // Create a summary message about the uploaded files
    if (files.length > 0) {
      const filesSummary = files.map(file => 
        `${file.name} (${file.totalRows} rows, ${file.totalColumns} columns)`
      ).join(', ');
      
      const dataQualityInfo = files.map(file => {
        const quality = [];
        if (file.dataQuality.missingPercent > 0) {
          quality.push(`${file.dataQuality.missingPercent}% missing values`);
        }
        if (file.dataQuality.outliers > 0) {
          quality.push(`${file.dataQuality.outliers} outliers detected`);
        }
        return quality.length > 0 ? `${file.name}: ${quality.join(', ')}` : null;
      }).filter(Boolean);
      
      let summaryMessage = `📊 I've successfully uploaded and analyzed ${files.length} file(s): ${filesSummary}.`;
      
      if (dataQualityInfo.length > 0) {
        summaryMessage += `\n\n🔍 Data Quality Summary:\n${dataQualityInfo.join('\n')}`;
      }
      
      summaryMessage += `\n\n💡 You can now ask me questions about this data, such as:\n• "What are the main trends in this dataset?"\n• "Show me summary statistics"\n• "Are there any correlations between columns?"\n• "What insights can you find?"`;
      
      // If no current chat, create one
      if (!currentChatId) {
        const newChatId = Date.now();
        const newChat = {
          id: newChatId,
          title: `Data Analysis - ${files[0].name}`,
          messages: [{
            id: Date.now() + Math.random(),
            type: 'assistant',
            content: summaryMessage,
            timestamp: new Date()
          }],
          createdAt: new Date(),
          lastActivity: new Date(),
          bookmarked: false
        };
        
        setChats(prev => [newChat, ...prev]);
        setCurrentChatId(newChatId);
      } else {
        // Add to existing chat
        handleSendToCurrentChat(summaryMessage, 'assistant');
      }
      
      // Hide file upload zone after successful upload
      setShowFileUpload(false);
    }
  };

  const toggleTool = (tool) => {
    if (tool === 'research') {
      setActiveTools(prev => ({
        ...prev,
        research: !prev.research
      }));
    }
  };

  // Providers data
  const providers = [
    { id: 'vast', name: 'Vast AI', icon: '🚀', color: 'bg-purple-500' },
    { id: 'lambda', name: 'Lambda AI', icon: '⚡', color: 'bg-yellow-500' },
    { id: 'coreweave', name: 'CoreWeave', icon: '🌊', color: 'bg-blue-500' },
    { id: 'runpod', name: 'RunPod', icon: '🏃', color: 'bg-green-500' },
    { id: 'aws', name: 'AWS', icon: '☁️', color: 'bg-orange-500' },
    { id: 'azure', name: 'Azure', icon: '🔷', color: 'bg-blue-600' },
    { id: 'gcp', name: 'Google Cloud', icon: '🌈', color: 'bg-red-500' }
  ];

  const handleConnectProvider = (providerId) => {
    const provider = providers.find(p => p.id === providerId);
    if (provider && !connectedProviders.find(cp => cp.id === providerId)) {
      setConnectedProviders(prev => [...prev, {
        ...provider,
        connectedAt: new Date(),
        status: 'connected'
      }]);
    }
    setShowProvidersDialog(false);
  };

  const handleDisconnectProvider = (providerId) => {
    setConnectedProviders(prev => prev.filter(cp => cp.id !== providerId));
  };

  const handleConfigClick = () => {
    setConfigActiveSection('providers'); // Ensure providers is selected when opening
    setShowConfigDialog(true);
  };

  const handleProfileDropdown = (e) => {
    e.stopPropagation();
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleLogout = () => {
    // Simulate logout functionality
    console.log('Logging out...');
    setShowProfileDropdown(false);
    // In a real app, you would clear auth tokens and redirect
  };

  // Profile Dialog Functions
  const handleEditProfile = () => {
    setTempProfile({ ...userProfile });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    setUserProfile({ ...tempProfile });
    setIsEditingProfile(false);
    setTempProfile({});
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setTempProfile({});
  };

  const handleProfileInputChange = (field, value) => {
    setTempProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Utility function for relative time formatting
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    // For older messages, show exact time
    return timestamp.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Credit Functions
  const handleAddCredits = () => {
    const amount = parseFloat(creditAmount);
    if (amount && amount > 0) {
      setUserProfile(prev => ({
        ...prev,
        credits: prev.credits + amount
      }));
      setCreditAmount('');
      setShowAddCreditsDialog(false);
    }
  };

  const handleCancelAddCredits = () => {
    setCreditAmount('');
    setShowAddCreditsDialog(false);
  };

  // Agent management functions
  const handleAgentsClick = () => {
    setShowAgentsPage(true);
    setShowTasksPage(false); // Ensure only one page is active
  };

  const handleCreateAgent = () => {
    if (!newAgent.name.trim()) return;
    
    const agent = {
      id: `agent_${Date.now()}`,
      name: newAgent.name,
      description: newAgent.description,
      avatar: '🤖', // Default avatar, could be customizable
      model: newAgent.model,
      personality: newAgent.personality,
      tools: newAgent.tools,
      memoryEnabled: newAgent.memoryEnabled,
      createdAt: new Date(),
      isDefault: false
    };
    
    setAgents(prev => [...prev, agent]);
    setNewAgent({
      name: '',
      description: '',
      personality: '',
      model: 'gpt-4',
      tools: [],
      memoryEnabled: true
    });
    setShowCreateAgentModal(false);
  };

  const handleAgentChat = (agentId) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    // Create a new chat with agent context
    const newChatId = Date.now();
    const newChat = {
      id: newChatId,
      title: `Chat with ${agent.name}`,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
      agentId: agentId,
      agentContext: {
        name: agent.name,
        personality: agent.personality,
        tools: agent.tools
      }
    };
    
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    setCurrentAgentId(agentId);
    setShowAgentsPage(false);
    setActiveTools({ research: false });
  };

  const deleteAgent = (agentId) => {
    if (agents.find(a => a.id === agentId)?.isDefault) return; // Can't delete default agents
    setAgents(prev => prev.filter(a => a.id !== agentId));
  };

  // Research Tools Functions
  const handleResearchToolSelect = (tool) => {
    setActiveResearchTool(tool);
    setShowResearchToolsMenu(false);
  };

  const clearResearchTool = () => {
    setActiveResearchTool(null);
  };

  const getResearchToolIcon = (tool) => {
    switch (tool) {
      case 'web-search':
        return Globe;
      case 'data-analysis':
        return BarChart3;
      case 'prompt-studio':
        return Code2;
      default:
        return Search;
    }
  };

  const getResearchToolColor = (tool) => {
    switch (tool) {
      case 'web-search':
        return darkMode ? 'text-blue-400 bg-blue-900/20' : 'text-blue-600 bg-blue-50';
      case 'data-analysis':
        return darkMode ? 'text-green-400 bg-green-900/20' : 'text-green-600 bg-green-50';
      case 'prompt-studio':
        return darkMode ? 'text-purple-400 bg-purple-900/20' : 'text-purple-600 bg-purple-50';
      default:
        return darkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-600 bg-gray-100';
    }
  };

  // Memory & Context Functions (placeholder for future implementation)
  // const updateUserMemory = (type, data) => {
  //   setUserMemory(prev => ({
  //     ...prev,
  //     [type]: Array.isArray(prev[type]) 
  //       ? [...prev[type], { ...data, timestamp: new Date() }]
  //       : { ...prev[type], ...data }
  //   }));
  // };

  // Quick upload function for input area (placeholder for future implementation)
  // const handleQuickUpload = (event) => {
  //   const files = Array.from(event.target.files);
  //   if (files.length === 0) return;

  //   // Add files to knowledge base
  //   files.forEach(file => {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const newFile = {
  //         id: Date.now() + Math.random(),
  //         name: file.name,
  //         type: file.type,
  //         size: file.size,
  //         content: e.target.result,
  //         uploadedAt: new Date(),
  //         summary: `Quick upload: ${file.name} - Ready for analysis and context-aware reasoning.`,
  //         keyPoints: [
  //           'File uploaded and indexed',
  //           'Available for contextual queries',
  //           'Integrated with chat memory'
  //         ]
  //       };
        
  //       setKnowledgeFiles(prev => [...prev, newFile]);
  //       updateUserMemory('uploadedDocuments', newFile);
  //     };
  //     reader.readAsText(file);
  //   });

  //   // Show feedback
  //   setInput(prev => prev + (prev ? ' ' : '') + `[Uploaded: ${files.map(f => f.name).join(', ')}] `);
    
  //   // Clear the input
  //   event.target.value = '';
  // };



  // Command Palette data
  const commands = [
    // Chat actions
    { id: 'new-chat', title: 'New Chat', description: 'Start a new conversation', icon: Plus, action: () => createNewChat() },
    { id: 'search-chats', title: 'Search Chats', description: 'Search through your chat history', icon: Search, action: () => setShowBookmarks(false) },
    { id: 'bookmarks', title: 'View Bookmarks', description: 'Show bookmarked chats', icon: Bookmark, action: () => setShowBookmarks(true) },
    
    // AI actions
    { id: 'summarize', title: 'Summarize', description: 'Generate a summary of the current chat', icon: FileText, action: () => console.log('Summarize') },
    { id: 'generate-report', title: 'Generate Report', description: 'Create a detailed report', icon: Sparkles, action: () => console.log('Generate Report') },
    
    // Settings
    { id: 'providers', title: 'Manage Providers', description: 'Connect cloud providers', icon: Cloud, action: () => setShowProvidersDialog(true) },
    { id: 'toggle-theme', title: darkMode ? 'Light Mode' : 'Dark Mode', description: `Switch to ${darkMode ? 'light' : 'dark'} theme`, icon: darkMode ? Sun : Moon, action: () => setDarkMode(!darkMode) },
    
    // Agents
    { id: 'agents', title: 'View Agents', description: 'Manage AI agents', icon: Zap, action: () => handleAgentsClick() },
    
    // Tasks
    { id: 'tasks', title: 'View Tasks', description: 'Manage and track tasks', icon: FileText, action: () => handleTasksClick() },
  ];

  // Filter commands based on search query
  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(commandQuery.toLowerCase()) ||
    command.description.toLowerCase().includes(commandQuery.toLowerCase())
  );

  const executeCommand = (command) => {
    command.action();
    setShowCommandPalette(false);
    setCommandQuery('');
  };

  // Pin/Unpin chat functionality
  const togglePinChat = (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    setPinnedChats(prev => {
      const isAlreadyPinned = prev.find(p => p.id === chatId);
      if (isAlreadyPinned) {
        return prev.filter(p => p.id !== chatId);
      } else {
        return [...prev, { ...chat, pinnedAt: new Date() }];
      }
    });
  };

  // Generate insights from current chat
  const getCurrentChatInsights = () => {
    if (!currentChat || currentChat.messages.length === 0) return [];
    
    const insights = [];
    const messageCount = currentChat.messages.length;
    const userMessages = currentChat.messages.filter(m => m.type === 'user');
    
    // Sample insights based on chat content
    if (messageCount > 0) {
      insights.push(`${messageCount} messages exchanged`);
    }
    
    if (userMessages.some(m => m.tools.research)) {
      insights.push('Research mode was used');
    }
    
    if (userMessages.some(m => m.tools.research)) {
      insights.push('Deep research mode activated');
    }
    
    if (messageCount > 5) {
      insights.push('Extended conversation');
    }
    
    // Add some sample actionable insights
    insights.push('Key topics discussed');
    insights.push('Action items identified');
    
    return insights;
  };

  const currentChatInsights = getCurrentChatInsights();

 
 return (
    <>
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
      
      <div className={`flex h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-white'}`} style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      {/* LEFT SIDEBAR */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 flex flex-col overflow-hidden ${
        darkMode 
          ? 'bg-gray-800 border-r border-gray-700' 
          : 'bg-white border-r border-gray-200'
      }`}>
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Telos</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`p-2 rounded-full transition ${
                darkMode 
                  ? 'hover:bg-gray-800 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Close sidebar"
            >
              <PanelLeftClose size={20} />
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative mb-4">
            <Search size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-colors ${
                darkMode 
                  ? 'bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:bg-gray-600' 
                  : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:bg-white'
              }`}
            />
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setShowBookmarks(false)}
              className={`p-2 rounded transition ${
                !showBookmarks 
                  ? 'bg-orange-100 text-orange-600' 
                  : darkMode 
                    ? 'hover:bg-gray-700 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Search size={18} />
            </button>
            <button 
              onClick={() => setShowBookmarks(true)}
              className={`p-2 rounded transition ${
                showBookmarks 
                  ? 'bg-orange-100 text-orange-600' 
                  : darkMode 
                    ? 'hover:bg-gray-700 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Bookmark size={18} />
            </button>
          </div>
        </div>

        <div className={`p-4 space-y-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button 
            onClick={createNewChat}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded transition font-medium text-sm ${
              darkMode 
                ? 'text-gray-300 hover:bg-orange-900/20 hover:text-orange-400' 
                : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
            }`}
          >
            <Plus size={18} />
            New Chat
          </button>
          <button 
            onClick={handleAgentsClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded transition text-sm ${
              showAgentsPage
                ? darkMode 
                  ? 'bg-orange-900/20 text-orange-400' 
                  : 'bg-orange-50 text-orange-600'
                : darkMode 
                  ? 'hover:bg-orange-900/20 hover:text-orange-400 text-gray-300' 
                  : 'hover:bg-orange-50 hover:text-orange-600 text-gray-700'
            }`}
          >
            <Zap size={18} />
            Agents
          </button>
          <button 
            onClick={handleTasksClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded transition text-sm ${
              showTasksPage
                ? darkMode 
                  ? 'bg-orange-900/20 text-orange-400' 
                  : 'bg-orange-50 text-orange-600'
                : darkMode 
                  ? 'hover:bg-orange-900/20 hover:text-orange-400 text-gray-300' 
                  : 'hover:bg-orange-50 hover:text-orange-600 text-gray-700'
            }`}
          >
            <FileText size={18} />
            Tasks
          </button>

        </div>


        {/* Mini Dashboard */}
        {showDashboard && currentChatInsights.length > 0 && (
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <p className={`text-xs font-semibold tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                SESSION INSIGHTS
              </p>
              <button
                onClick={() => setShowDashboard(false)}
                className={`p-1 rounded transition ${
                  darkMode ? 'hover:bg-gray-700 text-gray-500' : 'hover:bg-gray-100 text-gray-400'
                }`}
              >
                <X size={12} />
              </button>
            </div>
            <div className="space-y-2">
              {currentChatInsights.slice(0, 4).map((insight, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                    darkMode ? 'bg-orange-400' : 'bg-orange-500'
                  }`} />
                  <p className={`text-xs leading-relaxed ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pinned Threads */}
        {pinnedChats.length > 0 && (
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-xs font-semibold tracking-wide mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              PINNED THREADS
            </p>
            <div className="space-y-1">
              {pinnedChats.slice(0, 3).map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => switchToChat(chat.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition cursor-pointer group ${
                    currentChatId === chat.id
                      ? darkMode 
                        ? 'bg-orange-900/20 text-orange-400 border border-orange-800/30' 
                        : 'bg-orange-50 text-orange-600 border border-orange-200'
                      : darkMode 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Pin size={12} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                    <span className="font-medium truncate">{chat.title}</span>
                  </div>
                </button>
              ))}
              {pinnedChats.length > 3 && (
                <p className={`text-xs px-3 py-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  +{pinnedChats.length - 3} more pinned
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 p-4 overflow-y-auto">
          <p className={`text-xs font-semibold tracking-wide mb-3 px-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {showBookmarks ? 'BOOKMARKED CHATS' : 'CHAT HISTORY'}
          </p>
          {filteredChats.length === 0 ? (
            <div className={`text-xs px-3 py-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {showBookmarks ? 'No bookmarked chats' : searchQuery ? 'No chats found' : 'No chats yet'}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredChats.map((chat) => (
                <div key={chat.id} className="relative">
                  <div
                    onClick={() => switchToChat(chat.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition cursor-pointer group ${
                      currentChatId === chat.id
                        ? 'bg-yellow-100 text-orange-600'
                        : darkMode 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        {renamingChat === chat.id ? (
                          <input
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onBlur={() => handleRename(chat.id)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleRename(chat.id);
                              }
                              if (e.key === 'Escape') {
                                setRenamingChat(null);
                                setRenameValue('');
                              }
                            }}
                            className={`w-full rounded px-2 py-1 text-sm focus:outline-none focus:border-orange-500 ${
                              darkMode 
                                ? 'bg-gray-700 border border-gray-600 text-gray-100' 
                                : 'bg-white border border-gray-300 text-gray-900'
                            }`}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <div className="font-medium truncate flex items-center gap-2">
                            {pinnedChats.find(p => p.id === chat.id) && <Pin size={12} className={darkMode ? 'text-orange-400' : 'text-orange-500'} />}
                            {chat.bookmarked && <Bookmark size={12} className="text-yellow-500 fill-current" />}
                            {chat.title}
                          </div>
                        )}
                      </div>
                      
                      {renamingChat !== chat.id && (
                        <button
                          onClick={(e) => handleDropdownClick(e, chat.id)}
                          className={`opacity-0 group-hover:opacity-100 p-1 rounded transition ${
                            darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                          }`}
                        >
                          <MoreVertical size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  {openDropdown === chat.id && (
                    <div className={`absolute right-2 top-8 rounded-lg shadow-lg py-1 z-10 min-w-[120px] ${
                      darkMode 
                        ? 'bg-gray-700 border border-gray-600' 
                        : 'bg-white border border-gray-200'
                    }`}>
                      <button
                        onClick={() => startRename(chat.id, chat.title)}
                        className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition ${
                          darkMode 
                            ? 'text-gray-300 hover:bg-gray-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Edit size={14} />
                        Rename
                      </button>
                      <button
                        onClick={() => togglePinChat(chat.id)}
                        className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition ${
                          darkMode 
                            ? 'text-gray-300 hover:bg-gray-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pinnedChats.find(p => p.id === chat.id) ? <PinOff size={14} /> : <Pin size={14} />}
                        {pinnedChats.find(p => p.id === chat.id) ? 'Unpin' : 'Pin'}
                      </button>
                      <button
                        onClick={() => handleShare(chat.id)}
                        className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition ${
                          darkMode 
                            ? 'text-gray-300 hover:bg-gray-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Share size={14} />
                        Share
                      </button>
                      <div className={`border-t my-1 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`} />
                      <button
                        onClick={() => handleDeleteChat(chat.id)}
                        className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition ${
                          darkMode 
                            ? 'text-red-400 hover:bg-gray-600' 
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`p-4 border-t space-y-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button 
            onClick={handleConfigClick}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded transition text-sm font-medium ${
              darkMode 
                ? 'text-gray-300 hover:bg-gray-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Settings size={16} />
            Configuration
          </button>
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className={`flex-1 flex flex-col overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Header */}
        <div className={`h-16 border-b flex items-center justify-between px-6 transition-colors ${
          darkMode 
            ? 'border-gray-700 bg-gray-900' 
            : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className={`p-2 rounded-full transition ${
                  darkMode 
                    ? 'hover:bg-gray-800 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <PanelLeftOpen size={20} />
              </button>
            )}
            
            {/* Current Agent Indicator */}
            {currentAgentId && !showAgentsPage && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {agents.find(a => a.id === currentAgentId)?.avatar || '🤖'}
                </span>
                <div>
                  <p className={`font-medium text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {agents.find(a => a.id === currentAgentId)?.name || 'Agent'}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    AI Agent
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Command Palette Trigger */}
          <button
            onClick={() => setShowCommandPalette(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition ${
              darkMode
                ? 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Command size={16} />
            <span className="text-sm">Search</span>
            <kbd className={`px-1.5 py-0.5 text-xs rounded ${
              darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
            }`}>
              ⌘K
            </kbd>
          </button>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition ${
                darkMode 
                  ? 'hover:bg-gray-800 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Wallet Widget */}
            <div className="relative">
              <button
                onClick={() => setShowAddCreditsDialog(true)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                  darkMode 
                    ? 'hover:bg-gray-800 text-gray-300 border border-gray-700' 
                    : 'hover:bg-gray-100 text-gray-600 border border-gray-200'
                }`}
                title="Wallet - Click to add credits"
              >
                <Wallet size={16} className={darkMode ? 'text-orange-400' : 'text-orange-500'} />
                <span className={`text-sm font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  ${userProfile.credits.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
                <Plus size={12} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              </button>
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={handleProfileDropdown}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition border-2 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' 
                    : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                }`}
                title="User Profile"
              >
                {userProfile.avatar ? (
                  <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span>{userProfile.initials}</span>
                )}
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className={`absolute right-0 top-10 w-56 rounded-lg shadow-lg py-2 z-50 ${
                  darkMode 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-200'
                }`}>
                  {/* User Info */}
                  <div className={`px-4 py-3 border-b ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <p className={`font-medium text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {userProfile.name}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {userProfile.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileDialog(true);
                        setShowProfileDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 transition ${
                        darkMode 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <UserCircle size={16} />
                      View Profile
                    </button>
                    




                    <div className={`border-t my-1 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                    
                    <button
                      onClick={handleLogout}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 transition ${
                        darkMode 
                          ? 'text-red-400 hover:bg-gray-700' 
                          : 'text-red-600 hover:bg-gray-50'
                      }`}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>


          </div>
        </div>

        {/* Chat Content, Agents Page, or Tasks Page */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {showTasksPage ? (
            /* Tasks Management Page */
            <div className="max-w-6xl mx-auto w-full">
              {/* Tasks Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setShowTasksPage(false);
                      setShowAgentsPage(false); // Ensure clean state
                    }}
                    className={`p-2 rounded-lg transition ${
                      darkMode 
                        ? 'hover:bg-gray-700 text-gray-400' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                    title="Back to chat"
                  >
                    <X size={20} />
                  </button>
                  <div>
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      Tasks
                    </h1>
                    <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Manage and track your AI-assisted tasks and projects
                    </p>
                  </div>
                </div>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition font-medium"
                >
                  <Plus size={18} />
                  New Task
                </button>
              </div>

              {/* Task Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className={`p-4 rounded-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <FileText size={20} className="text-white" />
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {tasks.length}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Total Tasks
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <Zap size={20} className="text-white" />
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {tasks.filter(t => t.status === 'in-progress').length}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        In Progress
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Sparkles size={20} className="text-white" />
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {tasks.filter(t => t.status === 'completed').length}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Completed
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <Pin size={20} className="text-white" />
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {tasks.filter(t => t.priority === 'high').length}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        High Priority
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-4">
                {tasks.map((task) => {
                  const assignedAgent = agents.find(a => a.id === task.assignedAgent);
                  return (
                    <div
                      key={task.id}
                      className={`p-6 rounded-lg border transition hover:shadow-md ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                              {task.title}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTaskStatusColor(task.status)}`}>
                              {task.status.replace('-', ' ')}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                              {task.priority} priority
                            </span>
                          </div>
                          <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {task.description}
                          </p>
                          
                          {/* Task Details */}
                          <div className="flex items-center gap-6 text-sm">
                            {assignedAgent && (
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{assignedAgent.avatar}</span>
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                                  {assignedAgent.name}
                                </span>
                              </div>
                            )}
                            <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              <span>Due:</span>
                              <span>{task.dueDate.toLocaleDateString()}</span>
                            </div>
                            <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              <span>Created:</span>
                              <span>{task.createdAt.toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Tags */}
                          {task.tags.length > 0 && (
                            <div className="flex gap-2 mt-3">
                              {task.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className={`px-2 py-1 text-xs rounded ${
                                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Task Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            className={`p-2 rounded transition ${
                              darkMode 
                                ? 'hover:bg-gray-700 text-gray-400' 
                                : 'hover:bg-gray-100 text-gray-500'
                            }`}
                            title="Edit task"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className={`p-2 rounded transition ${
                              darkMode 
                                ? 'hover:bg-gray-700 text-gray-400' 
                                : 'hover:bg-gray-100 text-gray-500'
                            }`}
                            title="Delete task"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Empty State */}
              {tasks.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    No tasks yet
                  </h3>
                  <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Create your first task to get started
                  </p>
                  <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition font-medium">
                    Create Task
                  </button>
                </div>
              )}
            </div>
          ) : showAgentsPage ? (
            /* Agents Management Page */
            <div className="max-w-6xl mx-auto w-full">
              {/* Agents Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setShowAgentsPage(false);
                      setShowTasksPage(false); // Ensure clean state
                    }}
                    className={`p-2 rounded-lg transition ${
                      darkMode 
                        ? 'hover:bg-gray-700 text-gray-400' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                    title="Back to chat"
                  >
                    <X size={20} />
                  </button>
                  <div>
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      AI Agents
                    </h1>
                    <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Specialized AI workers with unique roles, personalities, and capabilities
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateAgentModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition font-medium"
                >
                  <Plus size={18} />
                  New Agent
                </button>
              </div>

              {/* Agents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className={`p-6 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition border ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleAgentChat(agent.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{agent.avatar}</div>
                        <div className="flex-1">
                          <h3 className={`font-semibold text-lg ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            {agent.name}
                          </h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {agent.description}
                          </p>
                        </div>
                      </div>
                      {!agent.isDefault && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAgent(agent.id);
                          }}
                          className={`p-1 rounded transition ${
                            darkMode 
                              ? 'hover:bg-gray-700 text-gray-500' 
                              : 'hover:bg-gray-100 text-gray-400'
                          }`}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    {/* Agent Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          MODEL:
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {availableModels.find(m => m.id === agent.model)?.name || agent.model}
                        </span>
                      </div>

                      {agent.tools.length > 0 && (
                        <div>
                          <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            TOOLS:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {agent.tools.slice(0, 3).map((toolId) => {
                              const tool = availableTools.find(t => t.id === toolId);
                              return (
                                <span
                                  key={toolId}
                                  className={`text-xs px-2 py-1 rounded ${
                                    darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                                  }`}
                                >
                                  {tool?.name || toolId}
                                </span>
                              );
                            })}
                            {agent.tools.length > 3 && (
                              <span className={`text-xs px-2 py-1 rounded ${
                                darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                              }`}>
                                +{agent.tools.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          {agent.memoryEnabled && (
                            <span className={`text-xs px-2 py-1 rounded ${
                              darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'
                            }`}>
                              Memory
                            </span>
                          )}
                          {agent.isDefault && (
                            <span className={`text-xs px-2 py-1 rounded ${
                              darkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-600'
                            }`}>
                              Default
                            </span>
                          )}
                        </div>
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {agent.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {agents.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤖</div>
                  <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    No agents yet
                  </h3>
                  <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Create your first AI agent to get started
                  </p>
                  <button
                    onClick={() => setShowCreateAgentModal(true)}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition font-medium"
                  >
                    Create Agent
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Chat Messages Area */
            <div className="flex-1 p-8">
              {messages.length === 0 ? (
                /* Empty State with Centered Input */
                <div className="flex flex-col items-center justify-center h-full">
                  {/* Mascot */}
                  <div className="mb-8 text-6xl">🦊</div>
                  
                  {/* Main Prompt Text */}
                  <p className={`text-lg mb-8 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Ask Telos anything</p>
                  
                  {/* Centered Input */}
                  <div className="w-full max-w-3xl">
                    <div className={`flex flex-col gap-0 rounded-lg shadow-lg focus-within:shadow-xl transition ${
                      darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                      
                      {/* Top Row - Controls */}
                      <div className="flex items-center gap-3 px-4 py-3">
                        {/* Upload Button - First */}
                        <div className="relative">
                          <button 
                            onClick={() => setShowFileUpload(!showFileUpload)}
                            className={`p-2 rounded-full transition ${
                              showFileUpload
                                ? 'bg-orange-500 text-white'
                                : uploadedFiles.length > 0
                                  ? 'bg-green-500 text-white'
                                  : darkMode 
                                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                            title={uploadedFiles.length > 0 ? `${uploadedFiles.length} files uploaded` : "Upload CSV/JSON files for analysis"}
                          >
                            <Upload size={18} />
                          </button>
                          {uploadedFiles.length > 0 && (
                            <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {uploadedFiles.length}
                            </div>
                          )}
                        </div>

                        {/* Research Tools Dropdown */}
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowResearchToolsMenu(!showResearchToolsMenu);
                            }}
                            className={`flex items-center gap-2 px-3 py-1 rounded transition text-sm font-medium ${
                              activeResearchTool
                                ? getResearchToolColor(activeResearchTool)
                                : darkMode 
                                  ? 'text-gray-400 hover:bg-gray-700' 
                                  : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {activeResearchTool ? (
                              <>
                                {React.createElement(getResearchToolIcon(activeResearchTool), { size: 16 })}
                                {activeResearchTool === 'web-search' && 'Web Search'}
                                {activeResearchTool === 'data-analysis' && 'Data Analysis'}
                                {activeResearchTool === 'prompt-studio' && 'Prompt Studio'}
                                <X size={14} onClick={(e) => { e.stopPropagation(); clearResearchTool(); }} />
                              </>
                            ) : (
                              <>
                                <Search size={16} />
                                Tools
                              </>
                            )}
                          </button>

                          {/* Research Tools Menu */}
                          {showResearchToolsMenu && (
                            <div className={`absolute top-full left-0 mt-2 w-64 rounded-lg shadow-lg border z-10 ${
                              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                            }`}>
                              <div className="p-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleResearchToolSelect('web-search');
                                  }}
                                  className={`w-full flex items-center gap-3 px-3 py-2 rounded transition text-left ${
                                    darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                                  }`}
                                >
                                  <Globe size={18} className="text-blue-500" />
                                  <div>
                                    <div className="font-medium">Web Research</div>
                                    <div className="text-xs opacity-75">Real-time web search & news</div>
                                  </div>
                                </button>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleResearchToolSelect('data-analysis');
                                  }}
                                  className={`w-full flex items-center gap-3 px-3 py-2 rounded transition text-left ${
                                    darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                                  }`}
                                >
                                  <BarChart3 size={18} className="text-green-500" />
                                  <div>
                                    <div className="font-medium">Data Analysis</div>
                                    <div className="text-xs opacity-75">Upload CSV/Excel for insights</div>
                                  </div>
                                </button>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleResearchToolSelect('prompt-studio');
                                  }}
                                  className={`w-full flex items-center gap-3 px-3 py-2 rounded transition text-left ${
                                    darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                                  }`}
                                >
                                  <Code2 size={18} className="text-purple-500" />
                                  <div>
                                    <div className="font-medium">Prompt Studio</div>
                                    <div className="text-xs opacity-75">Custom reasoning templates</div>
                                  </div>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Traditional Tools */}
                        <button 
                          onClick={() => toggleTool('research')}
                          className={`flex items-center gap-1 px-3 py-1 rounded transition text-sm font-medium ${
                            activeTools.research
                              ? 'text-blue-600 bg-blue-50 border border-blue-200'
                              : darkMode 
                                ? 'text-gray-400 hover:bg-gray-700' 
                                : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Infinity size={16} />
                          Deep Research
                        </button>

                        {/* Spacer */}
                        <div className="flex-1"></div>
                      </div>

                      {/* Enhanced Input Area */}
                      <div className={`relative ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                      } rounded-b-lg`}>
                        {/* Input Field Container */}
                        <div className="px-4 py-3">
                          {/* Expandable Text Input */}
                          <div className="relative">
                            <textarea
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              onKeyPress={handleKeyPress}
                              onFocus={handleInputFocus}
                              onBlur={handleInputBlur}
                              placeholder="Ask about your ML workload..."
                              rows={inputFocused || input.length > 50 ? 3 : 1}
                              className={`w-full resize-none focus:outline-none focus:ring-0 focus:border-transparent border-0 outline-none transition-all duration-200 ${
                                darkMode 
                                  ? 'text-gray-100 placeholder-gray-500 bg-gray-800' 
                                  : 'text-gray-900 placeholder-gray-400 bg-white'
                              }`}
                              disabled={isLoading}
                              style={{ 
                                minHeight: inputFocused || input.length > 50 ? '72px' : '24px',
                                maxHeight: '120px',
                                boxShadow: 'none'
                              }}
                            />
                          </div>
                          
                          {/* Bottom Row - Character Counter, Keyboard Shortcut, and Action Buttons */}
                          {inputFocused && (
                            <div className="flex items-center justify-between mt-2">
                              {/* Left Side - Keyboard Shortcut */}
                              <div className={`text-xs ${
                                darkMode ? 'text-gray-500' : 'text-gray-400'
                              }`}>
                                Press <kbd className={`px-1 py-0.5 rounded text-xs ${
                                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                                }`}>Ctrl+Enter</kbd> to send
                              </div>
                              
                              {/* Right Side - Character Counter and Action Buttons */}
                              <div className="flex items-center gap-3">
                                {/* Character Counter */}
                                {input.length > 100 && (
                                  <div className={`text-xs ${
                                    input.length > 500 
                                      ? 'text-red-500' 
                                      : darkMode ? 'text-gray-500' : 'text-gray-400'
                                  }`}>
                                    {input.length}/1000
                                  </div>
                                )}
                                
                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                  {/* Send Button */}
                                  <button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    className={`p-2 rounded-full transition ${
                                      isLoading || !input.trim()
                                        ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                                    }`}
                                    title="Send message"
                                  >
                                    {isLoading ? (
                                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                      <Send size={18} />
                                    )}
                                  </button>

                                  {/* Mic Button */}
                                  <button 
                                    className={`p-2 rounded-full transition ${
                                      darkMode 
                                        ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                    }`} 
                                    title="Voice input"
                                  >
                                    <Mic size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* File Upload Zone */}
                  {showFileUpload && (
                    <div className="mt-8">
                      <FileUploadZone 
                        onFilesUploaded={handleFilesUploaded}
                        maxFiles={3}
                      />
                    </div>
                  )}
                </div>
              ) : (
                /* Messages List */
                <div>
              {messages.map((msg, index) => {
                // Determine active modes for this message
                const activeModes = [];
                if (msg.tools.research) activeModes.push('Deep Research');
                if (activeModes.length === 0) activeModes.push('Chat');
                
                return (
                  <div 
                    key={msg.id} 
                    className={`group flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} mb-6 opacity-0 animate-fade-in`}
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    <div className={`flex max-w-2xl ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Message Bubble */}
                      <div className="flex-1 min-w-0">
                        <div className={`px-4 py-3 rounded-2xl transition-all duration-200 ${
                          msg.type === 'user' 
                            ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white' 
                            : darkMode 
                              ? 'bg-gray-800 text-gray-100' 
                              : 'bg-white text-gray-900'
                        }`}>
                          <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                        </div>
                        
                        {/* Mode indicator - only show for research */}
                        {msg.tools.research && (
                          <div className={`mt-2 px-4 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              <Infinity size={10} />
                              Deep Research
                            </span>
                          </div>
                        )}
                        
                        {/* Timestamp - only show for bot messages */}
                        {msg.type === 'agent' && (
                          <div className="mt-2 text-left px-4">
                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {getRelativeTime(msg.timestamp)}
                            </span>
                          </div>
                        )}
                        
                        {/* Message Actions */}
                        <div className={`flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity px-4 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <button 
                            className={`p-1 rounded transition ${
                              darkMode 
                                ? 'hover:bg-gray-700 text-gray-500 hover:text-gray-300' 
                                : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                            }`}
                            title="Save message"
                          >
                            <Bookmark size={12} />
                          </button>
                          <button 
                            className={`p-1 rounded transition ${
                              darkMode 
                                ? 'hover:bg-gray-700 text-gray-500 hover:text-gray-300' 
                                : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                            }`}
                            title="Copy message"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start mb-6 animate-fade-in">
                  <div className="flex max-w-2xl">
                    {/* Typing Indicator */}
                    <div className="flex-1 min-w-0">
                      <div className={`px-4 py-3 rounded-2xl transition-all duration-200 ${
                        darkMode 
                          ? 'bg-gray-800 text-gray-100' 
                          : 'bg-white text-gray-900'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Telos is typing
                          </span>
                          <div className="flex gap-1">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${
                              darkMode ? 'bg-orange-400' : 'bg-orange-500'
                            }`} style={{ animationDelay: '0s' }}></div>
                            <div className={`w-2 h-2 rounded-full animate-pulse ${
                              darkMode ? 'bg-orange-400' : 'bg-orange-500'
                            }`} style={{ animationDelay: '0.2s' }}></div>
                            <div className={`w-2 h-2 rounded-full animate-pulse ${
                              darkMode ? 'bg-orange-400' : 'bg-orange-500'
                            }`} style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Mode indicator for loading - only show for research */}
                      {activeTools.research && (
                        <div className="mt-2 px-2 text-left">
                          <div className="flex gap-1 flex-wrap">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              <Infinity size={10} />
                              Deep Research
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        )}
        </div>

        {/* Input Section - Only show when there are messages and not on special pages */}
        {!showAgentsPage && !showTasksPage && messages.length > 0 && (
        <div className={`p-8 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="max-w-3xl mx-auto">
            {/* Input Area with Controls - All in One */}
            <div className={`flex flex-col gap-0 rounded-lg shadow-lg focus-within:shadow-xl transition ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              
              {/* Top Row - Controls */}
              <div className="flex items-center gap-3 px-4 py-3">
                {/* Upload Button - First */}
                <div className="relative">
                  <button 
                    onClick={() => setShowFileUpload(!showFileUpload)}
                    className={`p-2 rounded-full transition ${
                      showFileUpload
                        ? 'bg-orange-500 text-white'
                        : uploadedFiles.length > 0
                          ? 'bg-green-500 text-white'
                          : darkMode 
                            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                    title={uploadedFiles.length > 0 ? `${uploadedFiles.length} files uploaded` : "Upload CSV/JSON files for analysis"}
                  >
                    <Upload size={18} />
                  </button>
                  {uploadedFiles.length > 0 && (
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {uploadedFiles.length}
                    </div>
                  )}
                </div>

                {/* Research Tools Dropdown */}
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowResearchToolsMenu(!showResearchToolsMenu);
                    }}
                    className={`flex items-center gap-2 px-3 py-1 rounded transition text-sm font-medium ${
                      activeResearchTool
                        ? getResearchToolColor(activeResearchTool)
                        : darkMode 
                          ? 'text-gray-400 hover:bg-gray-700' 
                          : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {activeResearchTool ? (
                      <>
                        {React.createElement(getResearchToolIcon(activeResearchTool), { size: 16 })}
                        {activeResearchTool === 'web-search' && 'Web Search'}
                        {activeResearchTool === 'data-analysis' && 'Data Analysis'}
                        {activeResearchTool === 'prompt-studio' && 'Prompt Studio'}
                        <X size={14} onClick={(e) => { e.stopPropagation(); clearResearchTool(); }} />
                      </>
                    ) : (
                      <>
                        <Search size={16} />
                        Tools
                      </>
                    )}
                  </button>

                  {/* Research Tools Menu */}
                  {showResearchToolsMenu && (
                    <div className={`absolute top-full left-0 mt-2 w-64 rounded-lg shadow-lg border z-10 ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <div className="p-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResearchToolSelect('web-search');
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded transition text-left ${
                            darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <Globe size={18} className="text-blue-500" />
                          <div>
                            <div className="font-medium">Web Research</div>
                            <div className="text-xs opacity-75">Real-time web search & news</div>
                          </div>
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResearchToolSelect('data-analysis');
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded transition text-left ${
                            darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <BarChart3 size={18} className="text-green-500" />
                          <div>
                            <div className="font-medium">Data Analysis</div>
                            <div className="text-xs opacity-75">Upload CSV/Excel for insights</div>
                          </div>
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResearchToolSelect('prompt-studio');
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded transition text-left ${
                            darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <Code2 size={18} className="text-purple-500" />
                          <div>
                            <div className="font-medium">Prompt Studio</div>
                            <div className="text-xs opacity-75">Custom reasoning templates</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Traditional Tools */}
                <button 
                  onClick={() => toggleTool('research')}
                  className={`flex items-center gap-1 px-3 py-1 rounded transition text-sm font-medium ${
                    activeTools.research
                      ? 'text-blue-600 bg-blue-50 border border-blue-200'
                      : darkMode 
                        ? 'text-gray-400 hover:bg-gray-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Infinity size={16} />
                  Deep Research
                </button>

                {/* Spacer */}
                <div className="flex-1"></div>
              </div>

              {/* Enhanced Input Area */}
              <div className={`relative ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } rounded-b-lg`}>
                {/* Input Field Container */}
                <div className="px-4 py-3">
                  {/* Expandable Text Input */}
                  <div className="relative">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder="Ask about your ML workload..."
                      rows={inputFocused || input.length > 50 ? 3 : 1}
                      className={`w-full resize-none focus:outline-none focus:ring-0 focus:border-transparent border-0 outline-none transition-all duration-200 ${
                        darkMode 
                          ? 'text-gray-100 placeholder-gray-500 bg-gray-800' 
                          : 'text-gray-900 placeholder-gray-400 bg-white'
                      }`}
                      disabled={isLoading}
                      style={{ 
                        minHeight: inputFocused || input.length > 50 ? '72px' : '24px',
                        maxHeight: '120px',
                        boxShadow: 'none'
                      }}
                    />
                  </div>
                  
                  {/* Bottom Row - Character Counter, Keyboard Shortcut, and Action Buttons */}
                  {inputFocused && (
                    <div className="flex items-center justify-between mt-2">
                      {/* Left Side - Keyboard Shortcut */}
                      <div className={`text-xs ${
                        darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Press <kbd className={`px-1 py-0.5 rounded text-xs ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}>Ctrl+Enter</kbd> to send
                      </div>
                      
                      {/* Right Side - Character Counter and Action Buttons */}
                      <div className="flex items-center gap-3">
                        {/* Character Counter */}
                        {input.length > 100 && (
                          <div className={`text-xs ${
                            input.length > 500 
                              ? 'text-red-500' 
                              : darkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {input.length}/1000
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {/* Send Button */}
                          <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className={`p-2 rounded-full transition ${
                              isLoading || !input.trim()
                                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                : 'bg-orange-500 hover:bg-orange-600 text-white'
                            }`}
                            title="Send message"
                          >
                            {isLoading ? (
                              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Send size={18} />
                            )}
                          </button>

                          {/* Mic Button */}
                          <button 
                            className={`p-2 rounded-full transition ${
                              darkMode 
                                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`} 
                            title="Voice input"
                          >
                            <Mic size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* File Upload Zone for Regular Chat */}
            {showFileUpload && (
              <div className="mt-6">
                <FileUploadZone 
                  onFilesUploaded={handleFilesUploaded}
                  maxFiles={3}
                />
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* Providers Dialog */}
      {showProvidersDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            {/* Dialog Header */}
            <div className={`flex items-center justify-between p-6 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Connect Provider</h2>
              <button
                onClick={() => setShowProvidersDialog(false)}
                className={`p-2 rounded-full transition ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="p-6">
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Choose a cloud provider to connect your AI infrastructure:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providers.map((provider) => {
                  const isConnected = connectedProviders.find(cp => cp.id === provider.id);
                  
                  return (
                    <div
                      key={provider.id}
                      className={`border rounded-lg p-4 transition ${
                        isConnected 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 ${provider.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                          {provider.icon}
                        </div>
                        <div>
                          <h3 className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{provider.name}</h3>
                          <p className={`text-sm ${
                            isConnected 
                              ? 'text-green-600' 
                              : darkMode 
                                ? 'text-gray-400' 
                                : 'text-gray-500'
                          }`}>
                            {isConnected ? 'Connected' : 'Cloud Infrastructure'}
                          </p>
                        </div>
                      </div>
                      
                      {isConnected ? (
                        <button
                          onClick={() => handleDisconnectProvider(provider.id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-medium text-sm"
                        >
                          <X size={16} />
                          Disconnect
                        </button>
                      ) : (
                        <button
                          onClick={() => handleConnectProvider(provider.id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition font-medium text-sm"
                        >
                          <Link size={16} />
                          Connect
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dialog Footer */}
            <div className={`flex justify-end gap-3 p-6 border-t ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <button
                onClick={() => setShowProvidersDialog(false)}
                className={`px-4 py-2 rounded-lg transition font-medium ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Command Palette */}
      {showCommandPalette && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
          <div className={`w-full max-w-lg mx-4 rounded-lg shadow-xl transition-colors ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            {/* Search Input */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder="Search chats, agents, or trigger actions..."
                  value={commandQuery}
                  onChange={(e) => setCommandQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-0 focus:outline-none transition-colors ${
                    darkMode 
                      ? 'bg-gray-800 text-gray-100 placeholder-gray-400' 
                      : 'bg-white text-gray-900 placeholder-gray-500'
                  }`}
                  autoFocus
                />
              </div>
            </div>

            {/* Commands List */}
            <div className="max-h-80 overflow-y-auto">
              {filteredCommands.length === 0 ? (
                <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No commands found
                </div>
              ) : (
                <div className="py-2">
                  {filteredCommands.map((command) => {
                    const IconComponent = command.icon;
                    return (
                      <button
                        key={command.id}
                        onClick={() => executeCommand(command)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          darkMode
                            ? 'hover:bg-gray-700 text-gray-100'
                            : 'hover:bg-gray-50 text-gray-900'
                        }`}
                      >
                        <IconComponent size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                        <div className="flex-1">
                          <div className="font-medium">{command.title}</div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {command.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`px-4 py-3 border-t text-xs flex items-center justify-between ${
              darkMode 
                ? 'border-gray-700 text-gray-400 bg-gray-800' 
                : 'border-gray-200 text-gray-500 bg-gray-50'
            }`}>
              <span>Press ↵ to select, ↑↓ to navigate</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Dialog */}
      {showConfigDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            {/* Dialog Header */}
            <div className={`flex items-center justify-between p-6 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Configuration</h2>
              <button
                onClick={() => {
                  setShowConfigDialog(false);
                  setConfigActiveSection('providers'); // Reset to default when closing
                }}
                className={`p-2 rounded-full transition ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Dialog Content with Sidebar */}
            <div className="flex h-[500px]">
              {/* Left Sidebar */}
              <div className={`w-64 border-r ${
                darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="p-4">
                  <nav className="space-y-2">
                    <button
                      onClick={() => setConfigActiveSection('providers')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition ${
                        configActiveSection === 'providers'
                          ? darkMode
                            ? 'bg-orange-900/20 text-orange-400'
                            : 'bg-orange-50 text-orange-600'
                          : darkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Cloud size={18} />
                      Providers
                    </button>
                    
                    <button
                      onClick={() => setConfigActiveSection('integrations')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition ${
                        configActiveSection === 'integrations'
                          ? darkMode
                            ? 'bg-orange-900/20 text-orange-400'
                            : 'bg-orange-50 text-orange-600'
                          : darkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Link size={18} />
                      Integrations
                    </button>
                    
                    <button
                      onClick={() => setConfigActiveSection('deployments')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition ${
                        configActiveSection === 'deployments'
                          ? darkMode
                            ? 'bg-orange-900/20 text-orange-400'
                            : 'bg-orange-50 text-orange-600'
                          : darkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Container size={18} />
                      Deployments
                    </button>
                  </nav>
                </div>
              </div>

              {/* Right Content Area */}
              <div className="flex-1 p-6 overflow-y-auto">
                {configActiveSection === 'providers' && (
                  <div>
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      Cloud Providers
                    </h1>
                    <p className={`mt-2 mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Connect and manage your cloud infrastructure providers
                    </p>
                    
                    <div className="space-y-4">
                      {providers.map((provider) => {
                        const isConnected = connectedProviders.find(cp => cp.id === provider.id);
                        return (
                          <div
                            key={provider.id}
                            className={`flex items-center justify-between p-6 rounded-2xl shadow-sm hover:shadow-md transition border ${
                              darkMode 
                                ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 ${provider.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                                {provider.icon}
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                  {provider.name}
                                </span>
                                {isConnected && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'
                                  }`}>
                                    Connected
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {isConnected ? (
                              <button
                                onClick={() => handleDisconnectProvider(provider.id)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition"
                              >
                                Disconnect
                              </button>
                            ) : (
                              <button
                                onClick={() => handleConnectProvider(provider.id)}
                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition"
                              >
                                Connect
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {configActiveSection === 'integrations' && (
                  <div>
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      Integrations
                    </h1>
                    <p className={`mt-2 mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Connect external services and tools to enhance your workflow
                    </p>
                    
                    <div className="space-y-4">
                      <div className={`p-6 rounded-2xl shadow-sm hover:shadow-md transition border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                              <Mail size={20} className="text-white" />
                            </div>
                            <div>
                              <h4 className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                Gmail Integration
                              </h4>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Connect your Gmail account for email analysis
                              </p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition text-sm font-medium">
                            Connect
                          </button>
                        </div>
                      </div>

                      <div className={`p-6 rounded-2xl shadow-sm hover:shadow-md transition border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                              <Github size={20} className="text-white" />
                            </div>
                            <div>
                              <h4 className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                GitHub Integration
                              </h4>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Connect repositories for code analysis
                              </p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition text-sm font-medium">
                            Connect
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {configActiveSection === 'deployments' && (
                  <div>
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      Deployments
                    </h1>
                    <p className={`mt-2 mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Configure deployment platforms and container orchestration
                    </p>
                    
                    <div className="space-y-4">
                      <div className={`p-6 rounded-2xl shadow-sm hover:shadow-md transition border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                              <Container size={20} className="text-white" />
                            </div>
                            <div>
                              <h4 className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                Kubernetes
                              </h4>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Container orchestration platform
                              </p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition text-sm font-medium">
                            Configure
                          </button>
                        </div>
                      </div>

                      <div className={`p-6 rounded-2xl shadow-sm hover:shadow-md transition border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                              <Cloud size={20} className="text-white" />
                            </div>
                            <div>
                              <h4 className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                Docker
                              </h4>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Container platform and runtime
                              </p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition text-sm font-medium">
                            Configure
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>


          </div>
        </div>
      )}

      {/* Create Agent Modal */}
      {showCreateAgentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between p-6 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                Create New Agent
              </h2>
              <button
                onClick={() => setShowCreateAgentModal(false)}
                className={`p-2 rounded-full transition ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Agent Name */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Agent Name
                </label>
                <input
                  type="text"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Data Scientist, Marketing Guru"
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-orange-500 transition ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Description
                </label>
                <input
                  type="text"
                  value={newAgent.description}
                  onChange={(e) => setNewAgent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of what this agent does"
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-orange-500 transition ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              {/* Personality/Role */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Personality & Role
                </label>
                <textarea
                  value={newAgent.personality}
                  onChange={(e) => setNewAgent(prev => ({ ...prev, personality: e.target.value }))}
                  placeholder="Describe the agent's personality, expertise, and how it should behave..."
                  rows={4}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-orange-500 transition resize-none ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              {/* Model Selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Default Model
                </label>
                <select
                  value={newAgent.model}
                  onChange={(e) => setNewAgent(prev => ({ ...prev, model: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-orange-500 transition ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {availableModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} - {model.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tools Selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Available Tools
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableTools.map((tool) => (
                    <label
                      key={tool.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                        newAgent.tools.includes(tool.id)
                          ? darkMode
                            ? 'border-orange-500 bg-orange-900/20'
                            : 'border-orange-500 bg-orange-50'
                          : darkMode
                            ? 'border-gray-600 hover:border-gray-500'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={newAgent.tools.includes(tool.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewAgent(prev => ({ 
                              ...prev, 
                              tools: [...prev.tools, tool.id] 
                            }));
                          } else {
                            setNewAgent(prev => ({ 
                              ...prev, 
                              tools: prev.tools.filter(t => t !== tool.id) 
                            }));
                          }
                        }}
                        className="mt-0.5"
                      />
                      <div>
                        <div className={`font-medium text-sm ${
                          darkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                          {tool.name}
                        </div>
                        <div className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {tool.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Memory Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className={`block text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Memory
                  </label>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Enable conversation memory for this agent
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAgent.memoryEnabled}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, memoryEnabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`flex justify-end gap-3 p-6 border-t ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <button
                onClick={() => setShowCreateAgentModal(false)}
                className={`px-4 py-2 rounded-lg transition font-medium ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAgent}
                disabled={!newAgent.name.trim()}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition font-medium"
              >
                Create Agent
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Profile Dialog */}
      {showProfileDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`flex items-center justify-between p-6 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {isEditingProfile ? 'Edit Profile' : 'Profile'}
              </h2>
              <button
                onClick={() => {
                  setShowProfileDialog(false);
                  setIsEditingProfile(false);
                  setTempProfile({});
                }}
                className={`p-2 rounded-full transition ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {!isEditingProfile ? (
                // View Mode
                <div className="space-y-6">
                  {/* Avatar and Basic Info */}
                  <div className="text-center">
                    <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold ${
                      darkMode ? 'bg-orange-600' : 'bg-orange-500'
                    } text-white`}>
                      {userProfile.avatar ? (
                        <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span>{userProfile.initials}</span>
                      )}
                    </div>
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {userProfile.name}
                    </h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {userProfile.email}
                    </p>
                  </div>

                  {/* Profile Details */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Mail size={16} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Email
                        </span>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} ml-6`}>
                        {userProfile.email}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Github size={16} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          GitHub
                        </span>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} ml-6`}>
                        @{userProfile.github}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Wallet size={16} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Wallet
                        </span>
                      </div>
                      <p className={`text-sm font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'} ml-6`}>
                        {userProfile.wallet.slice(0, 6)}...{userProfile.wallet.slice(-4)}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign size={16} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Available Credits
                        </span>
                      </div>
                      <p className={`text-sm font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'} ml-6`}>
                        ${userProfile.credits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={16} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Member Since
                        </span>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} ml-6`}>
                        {userProfile.memberSince.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <div className="pt-4">
                    <button
                      onClick={handleEditProfile}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition font-medium flex items-center justify-center gap-2"
                    >
                      <Edit size={16} />
                      Edit Profile
                    </button>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <div className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Name
                    </label>
                    <input
                      type="text"
                      value={tempProfile.name || ''}
                      onChange={(e) => handleProfileInputChange('name', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-orange-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
                      }`}
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={tempProfile.email || ''}
                      onChange={(e) => handleProfileInputChange('email', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-orange-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* GitHub Field */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      GitHub Username
                    </label>
                    <input
                      type="text"
                      value={tempProfile.github || ''}
                      onChange={(e) => handleProfileInputChange('github', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-orange-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
                      }`}
                      placeholder="Enter your GitHub username"
                    />
                  </div>

                  {/* Wallet Field */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      value={tempProfile.wallet || ''}
                      onChange={(e) => handleProfileInputChange('wallet', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-orange-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
                      }`}
                      placeholder="0x..."
                    />
                  </div>

                  {/* Credits Field */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Available Credits ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={tempProfile.credits || ''}
                      onChange={(e) => handleProfileInputChange('credits', parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-orange-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
                      }`}
                      placeholder="0.00"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition font-medium flex items-center justify-center gap-2"
                    >
                      <Save size={16} />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className={`flex-1 py-2 px-4 rounded-lg transition font-medium border ${
                        darkMode 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Credits Dialog */}
      {showAddCreditsDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-xl max-w-md w-full mx-4 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`flex items-center justify-between p-6 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                Add Credits
              </h2>
              <button
                onClick={handleCancelAddCredits}
                className={`p-2 rounded-full transition ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {/* Current Balance */}
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Current Balance
                    </span>
                    <span className={`text-lg font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                      ${userProfile.credits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Amount to Add ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-orange-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
                    }`}
                    placeholder="0.00"
                    autoFocus
                  />
                </div>

                {/* Quick Amount Buttons */}
                <div>
                  <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Quick Add
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[10, 25, 50, 100, 250, 500].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setCreditAmount(amount.toString())}
                        className={`py-2 px-3 rounded-lg border transition text-sm font-medium ${
                          creditAmount === amount.toString()
                            ? 'bg-orange-500 border-orange-500 text-white'
                            : darkMode 
                              ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        Credit Card
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        •••• •••• •••• 4242
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddCredits}
                    disabled={!creditAmount || parseFloat(creditAmount) <= 0}
                    className={`flex-1 py-2 px-4 rounded-lg transition font-medium flex items-center justify-center gap-2 ${
                      !creditAmount || parseFloat(creditAmount) <= 0
                        ? darkMode 
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}
                  >
                    <Plus size={16} />
                    Add ${creditAmount || '0.00'}
                  </button>
                  <button
                    onClick={handleCancelAddCredits}
                    className={`flex-1 py-2 px-4 rounded-lg transition font-medium border ${
                      darkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>
    </>
  );
}