import React, { useState, useEffect } from 'react';
import { User, Plus, Trash2, Shield, Key } from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', password: '' });
    const [userToDelete, setUserToDelete] = useState<any>(null);
    const { addToast } = useSecurity() as any;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleAddUser = async () => {
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            if (res.ok) {
                setShowAddModal(false);
                setNewUser({ username: '', password: '' });
                fetchUsers();
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to add user');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDeleteClick = (user: any) => {
        setUserToDelete(user);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await fetch(`/api/users/${userToDelete.id}`, { method: 'DELETE' });
            fetchUsers();
            setUserToDelete(null);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Пайдаланушыларды Басқару</h1>
                    <p className="text-slate-400 text-sm">Жүйеге кіру құқығы бар негізгі қолданушылар.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-cyan-900/20"
                >
                    <Plus size={16} />
                    Қосу
                </button>
            </div>

            {/* User List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map(user => (
                    <div key={user.id} className="glass-panel border border-slate-700 p-5 rounded-xl flex items-center justify-between group hover:border-cyan-500/50 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:border-cyan-500/50 group-hover:bg-cyan-900/20 transition-colors">
                                <User className="text-slate-400 group-hover:text-cyan-400" size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-medium">{user.username}</h3>
                                <p className="text-xs text-slate-500">ID: {user.id}</p>
                            </div>
                        </div>
                        {user.username !== 'admin' && (
                            <button
                                onClick={() => handleDeleteClick(user)}
                                className="text-slate-600 hover:text-red-400 p-2 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold text-white mb-6">Жаңа Пайдаланушы</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Логин</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input
                                        type="text"
                                        value={newUser.username}
                                        onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-white focus:outline-none focus:border-cyan-500"
                                        placeholder="username"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Құпиясөз</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input
                                        type="password"
                                        value={newUser.password}
                                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-white focus:outline-none focus:border-cyan-500"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Болдырмау
                            </button>
                            <button
                                onClick={handleAddUser}
                                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-cyan-900/20"
                            >
                                Сақтау
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {userToDelete && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-red-900/50 rounded-xl w-full max-w-sm p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 mb-4 text-red-400">
                            <Shield size={24} />
                            <h2 className="text-xl font-bold text-white">Жоюды растау</h2>
                        </div>

                        <p className="text-slate-300 mb-6">
                            <strong>{userToDelete.username}</strong> пайдаланушысын шынымен жойғыңыз келе ме? Бұл әрекетті қайтару мүмкін емес.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setUserToDelete(null)}
                                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Жоқ, қалдыру
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-red-900/20"
                            >
                                Иә, жою
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
