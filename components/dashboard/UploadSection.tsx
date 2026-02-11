import React, { useRef, useState } from 'react';
import { UploadCloud, FileSpreadsheet, Play, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

interface UploadSectionProps {
  onStartAnalysis: (taskId: string, keyword: string) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onStartAnalysis }) => {
  const [file, setFile] = useState<File | null>(null);
  const [keyword, setKeyword] = useState('');
  const [requirements, setRequirements] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Auto extract keyword from filename
      // Format assumption: "销量TOP0-市场数据分析-烧烤盘_2026-02-11.xlsx"
      const name = selectedFile.name;
      const parts = name.split(/[-_]/);
      // Heuristic: take the part that looks like a keyword (simplified logic)
      if (parts.length > 2) {
        setKeyword(parts[2]); // Taking the 3rd part roughly
      } else {
        setKeyword(name.replace('.xlsx', ''));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
       // Ideally reuse logic, keeping simple for now
       // Only accept xlsx
       if (e.dataTransfer.files[0].name.endsWith('.xlsx')) {
          const fakeEvent = { target: { files: e.dataTransfer.files } } as any;
          handleFileChange(fakeEvent);
       }
    }
  };

  const handleSubmit = async () => {
    if (!file || !keyword) return;
    setIsUploading(true);
    try {
      const res = await api.analysis.upload(file, keyword, requirements);
      onStartAnalysis(res.task_id, keyword);
    } catch (err) {
      console.error(err);
      alert("上传失败，请重试");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">新建市场分析任务</h2>
        
        {/* Dropzone */}
        <div 
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${file ? 'border-indigo-300 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".xlsx"
            onChange={handleFileChange}
          />
          
          {file ? (
            <div className="flex flex-col items-center text-indigo-600">
              <FileSpreadsheet size={48} className="mb-3" />
              <span className="font-medium text-lg">{file.name}</span>
              <span className="text-sm mt-1 text-indigo-400">点击更换文件</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-slate-500">
              <UploadCloud size={48} className="mb-3 text-slate-400" />
              <span className="font-medium text-lg text-slate-700">点击或拖拽上传 Excel 文件</span>
              <span className="text-sm mt-2 text-slate-400">支持 .xlsx 格式，最大 10MB</span>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">分析关键词</label>
            <input 
              type="text" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="例如：烧烤盘"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              特殊要求 <span className="text-slate-400 font-normal">(选填)</span>
            </label>
            <textarea 
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="例如：排除带电产品，或者只分析旗舰店..."
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!file || !keyword || isUploading}
            className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-medium text-white transition-colors ${
              !file || !keyword || isUploading 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                正在上传...
              </>
            ) : (
              <>
                <Play size={20} />
                开始分析
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
