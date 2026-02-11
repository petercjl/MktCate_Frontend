import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Will use HashRouter in App
import { api } from '../services/api';
import { Box, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || password.length < 6) {
      alert("请输入有效的用户名和至少6位密码");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      alert("两次密码输入不一致");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { token } = await api.auth.login(username, password);
        localStorage.setItem('mktcate_token', token);
        localStorage.setItem('mktcate_user', username);
        navigate('/dashboard');
      } else {
        await api.auth.register(username, password);
        setIsLogin(true);
        alert("注册成功，请登录");
      }
    } catch (error) {
      alert("操作失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8 bg-indigo-600 text-center">
           <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white/20 mb-4 backdrop-blur-sm text-white">
              <Box size={28} />
           </div>
           <h1 className="text-2xl font-bold text-white mb-1">MktCate</h1>
           <p className="text-indigo-200 text-sm">淘宝关键词市场商品分类分析工具</p>
        </div>

        <div className="p-8">
           <div className="flex mb-8 bg-slate-100 p-1 rounded-lg">
             <button 
               className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               onClick={() => setIsLogin(true)}
             >
               登录
             </button>
             <button 
               className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               onClick={() => setIsLogin(false)}
             >
               注册
             </button>
           </div>

           <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                 <User className="absolute left-3 top-3 text-slate-400" size={20} />
                 <input 
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="用户名"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                 />
              </div>
              <div className="relative">
                 <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                 <input 
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="密码 (至少6位)"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                 />
              </div>
              {!isLogin && (
                <div className="relative animate-in slide-in-from-top-2 duration-300">
                   <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                   <input 
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="确认密码"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                   />
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all mt-6 shadow-lg shadow-indigo-200"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    {isLogin ? '立即登录' : '创建账号'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
           </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
