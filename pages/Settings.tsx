import React, { useState, useEffect } from 'react';
import { Save, Bell, Shield, Server } from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

const Settings: React.FC = () => {
    const { addToast } = useSecurity() as any; // Temporary cast
    const [telegramConfig, setTelegramConfig] = useState({
        telegram_bot_token: '',
        telegram_chat_id: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                const data = await res.json();
                if (data.telegram_bot_token) {
                    setTelegramConfig({
                        telegram_bot_token: data.telegram_bot_token,
                        telegram_chat_id: data.telegram_chat_id || ''
                    });
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSaveTelegram = async () => {
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(telegramConfig)
            });
            if (res.ok) {
                // addToast('Saved', 'success');
                alert('Баптаулар сақталды!');
            } else {
                alert('Қате орын алды');
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Жүйе Баптаулары</h1>
                <p className="text-slate-400 text-sm">Хабарламалар және қауіпсіздік параметрлері.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Telegram Notification Settings */}
                <div className="glass-panel border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Bell className="text-cyan-400" size={20} />
                        Telegram Хабарламалар
                    </h3>

                    <div className="space-y-4">
                        <div className="bg-cyan-900/20 border border-cyan-900/50 rounded-lg p-4 mb-4">
                            <p className="text-sm text-cyan-200">
                                Бот токенін алу үшін <a href="https://t.me/BotFather" target="_blank" className="underline font-bold">@BotFather</a>-ға жазыңыз.
                                Chat ID алу үшін <a href="https://t.me/userinfobot" target="_blank" className="underline font-bold">@userinfobot</a> қолданыңыз.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-slate-400 uppercase font-bold">Bot Token</label>
                            <input
                                type="password"
                                value={telegramConfig.telegram_bot_token}
                                onChange={e => setTelegramConfig({ ...telegramConfig, telegram_bot_token: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                                placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400 uppercase font-bold">Chat ID</label>
                            <input
                                type="text"
                                value={telegramConfig.telegram_chat_id}
                                onChange={e => setTelegramConfig({ ...telegramConfig, telegram_chat_id: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                                placeholder="123456789"
                            />
                        </div>

                        <button
                            onClick={handleSaveTelegram}
                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg font-medium mt-4 flex items-center justify-center gap-2"
                        >
                            <Save size={16} />
                            Сақтау
                        </button>
                    </div>
                </div>

                {/* General Security Settings (Placeholder for now) */}
                <div className="glass-panel border border-slate-800 rounded-xl p-6 opacity-75">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Shield className="text-purple-400" size={20} />
                        Жалпы Қауіпсіздік
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                            <span className="text-slate-300 text-sm">Брутфорстан қорғау</span>
                            <div className="w-10 h-5 bg-cyan-600 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                            <span className="text-slate-300 text-sm">GeoIP локация</span>
                            <div className="w-10 h-5 bg-cyan-600 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="p-3 border border-yellow-800/50 bg-yellow-900/10 rounded-lg">
                            <p className="text-xs text-yellow-500 flex items-center gap-2">
                                <Server size={14} />
                                Сервер режимі: <strong>PRODUCTION</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
