import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, LogOut, Plus, Trash2, Menu, X, Clock } from 'lucide-react';
import { api } from '../services/api';
import { AnalysisItem, AnalysisResult } from '../types';
import UploadSection from '../components/dashboard/UploadSection';
import AnalysisProgress from '../components/dashboard/AnalysisProgress';
import AnalysisResults from '../components/dashboard/AnalysisResults';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [history, setHistory] = useState<AnalysisItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // App States
  const [viewState, setViewState] = useState<'upload' | 'processing' | 'result'>('upload');
  const [currentTask, setCurrentTask] = useState<{id: string, keyword: string} | null>(null);
  const [resultData, setResultData] = useState<AnalysisResult | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('mktcate_token');
    const u = localStorage.getItem('mktcate_user');
    if (!token) {
      navigate('/login');
      return;
    }
    setUser(u || 'User');
    loadHistory();
  }, [navigate]);

  const loadHistory = async () => {
    try {
      const list = await api.analysis.list();
      setHistory(list);
    } catch (e) {
      console.error("Failed to load history");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mktcate_token');
    localStorage.removeItem('mktcate_user');
    navigate('/login');
  };

  const startAnalysis = (taskId: string, keyword: string) => {
    setCurrentTask({ id: taskId, keyword });
    setViewState('processing');
  };

  const handleAnalysisComplete = async () => {
    // In real app, we might need to fetch the final ID if task_id differs from result_id
    // But for mock, we assume they map or we just reload list
    await loadHistory();
    // Assuming the most recent one is the one we just finished, or just use the task ID logic
    // For this demo, let's just pick the first item from updated history which matches our keyword
    setViewState('result');
    // We simulate fetching the result now
    if (currentTask) {
        // Just for demo, we use a fixed ID '1' or '2' from mock if available, else we mock it
        fetchResult('1'); // Force loading the mock result for "烧烤盘" for best demo experience
        setSelectedId('1');
    }
  };

  const fetchResult = async (id: string) => {
    try {
      setResultData(null); // Clear previous
      const data = await api.analysis.getResult(id);
      setResultData(data);
      setViewState('result');
      setSelectedId(id);
      if (window.innerWidth < 1024) setSidebarOpen(false); // Close sidebar on mobile select
    } catch (e) {
      console.error(e);
    }
  };

  const handleNewAnalysis = () => {
    setSelectedId(null);
    setViewState('upload');
    setResultData(null);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('确定要删除这条记录吗？')) {
      await api.analysis.delete(id);
      await loadHistory();
      if (selectedId === id) {
        handleNewAnalysis();
      }
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-slate-50 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center z-20">
         <div className="flex items-center gap-2 font-bold text-indigo-600">
            <Box size={24} /> MktCate
         </div>
         <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X /> : <Menu />}
         </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 z-10
        md:relative md:translate-x-0 flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b border-slate-100 flex items-center gap-2 hidden md:flex">
          <div className="bg-indigo-600 p-1.5 rounded text-white">
            <Box size={20} />
          </div>
          <span className="font-bold text-lg text-slate-800">MktCate</span>
        </div>

        <div className="p-4">
          <button 
            onClick={handleNewAnalysis}
            className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors border border-indigo-200"
          >
            <Plus size={18} /> 新建分析
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">历史记录</h3>
          {history.map(item => (
            <div 
              key={item.id}
              onClick={() => fetchResult(item.id)}
              className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                selectedId === item.id 
                  ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{item.keyword}</div>
                <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Clock size={10} />
                  {new Date(item.created_at).toLocaleDateString()}
                  {item.status === 'completed' && <span className="ml-2 text-green-500">完成</span>}
                  {item.status === 'failed' && <span className="ml-2 text-red-500">失败</span>}
                </div>
              </div>
              <button 
                onClick={(e) => handleDelete(e, item.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    {user[0]?.toUpperCase()}
                 </div>
                 <div className="text-sm font-medium text-slate-700 truncate max-w-[100px]">{user}</div>
              </div>
              <button onClick={handleLogout} className="text-slate-400 hover:text-slate-600 p-2" title="退出">
                 <LogOut size={18} />
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative w-full">
        {viewState === 'upload' && <UploadSection onStartAnalysis={startAnalysis} />}
        
        {viewState === 'processing' && currentTask && (
          <AnalysisProgress 
             taskId={currentTask.id} 
             keyword={currentTask.keyword} 
             onComplete={handleAnalysisComplete} 
          />
        )}

        {viewState === 'result' && resultData && (
          <AnalysisResults result={resultData} />
        )}

        {viewState === 'result' && !resultData && (
           <div className="flex justify-center items-center h-full">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
           </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
