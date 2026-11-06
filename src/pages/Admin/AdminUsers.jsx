import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`"${name}" ko delete karna hai? Ye wapas nahi aayega.`)) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Delete nahi hua');
    }
  };

  const filteredUsers = users
    .filter((u) => {
      if (filter === 'admin') return u.role === 'admin';
      if (filter === 'customer') return u.role === 'customer';
      if (filter === 'verified') return u.isEmailVerified;
      if (filter === 'unverified') return !u.isEmailVerified;
      return true;
    })
    .filter((u) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.includes(q)
      );
    });

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === 'admin').length,
    customers: users.filter((u) => u.role === 'customer').length,
    verified: users.filter((u) => u.isEmailVerified).length,
  };

  return (
    <AdminLayout title="Users">
      {/* ===== Stats Row ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total Users', value: stats.total, color: 'text-brand-black', bg: 'bg-white' },
          { label: 'Admins', value: stats.admins, color: 'text-brand-gold', bg: 'bg-brand-cream' },
          { label: 'Customers', value: stats.customers, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Verified', value: stats.verified, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border border-gray-200 p-4`}>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-grey mb-1">
              {s.label}
            </p>
            <p className={`font-heading text-2xl ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ===== Header ===== */}
      <div className="bg-white border border-gray-200 p-4 md:p-5 mb-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex items-center gap-4 flex-1">
          <p className="text-sm text-brand-grey whitespace-nowrap">
            <span className="font-semibold text-brand-black">
              {filteredUsers.length}
            </span>{' '}
            users
          </p>

          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition"
            />
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-grey"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
          </div>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none cursor-pointer bg-white"
        >
          <option value="all">All Users</option>
          <option value="customer">Customers Only</option>
          <option value="admin">Admins Only</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      {/* ===== Table ===== */}
      {loading ? (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-brand-grey">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white border border-gray-200 p-16 text-center">
          <div className="inline-flex w-16 h-16 border border-gray-200 rounded-full items-center justify-center mb-4">
            <svg className="w-7 h-7 text-brand-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="font-heading text-lg mb-2">Koi user nahi mila</p>
          <p className="text-sm text-brand-grey">Filter change karein</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-cream border-b border-gray-200">
                <tr className="text-left text-[10px] uppercase tracking-widest text-brand-grey">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Contact</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Verified</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Joined</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-brand-cream/50 transition">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 flex items-center justify-center font-heading font-bold rounded-full flex-shrink-0 ${
                            user.role === 'admin'
                              ? 'bg-brand-gold text-white'
                              : 'bg-brand-black text-white'
                          }`}
                        >
                          {user.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate max-w-[180px]">
                            {user.name}
                          </p>
                          <p className="text-xs text-brand-grey truncate max-w-[180px]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 hidden md:table-cell">
                      <p className="text-sm">
                        {user.phone || (
                          <span className="text-brand-grey">—</span>
                        )}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`text-[10px] uppercase tracking-widest font-medium px-2 py-1 border ${
                          user.role === 'admin'
                            ? 'bg-brand-gold text-white border-brand-gold'
                            : 'bg-white text-brand-grey border-gray-300'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-4 py-4 hidden md:table-cell">
                      {user.isEmailVerified ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-green-600">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-brand-grey">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          No
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4 hidden lg:table-cell text-xs text-brand-grey">
                      {new Date(user.createdAt).toLocaleDateString('en-PK', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="px-4 py-4 text-right">
                      {user.role !== 'admin' ? (
                        <button
                          onClick={() => handleDelete(user._id, user.name)}
                          className="w-8 h-8 border border-gray-200 inline-flex items-center justify-center hover:border-red-500 hover:text-red-500 transition"
                          aria-label="Delete"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
                            />
                          </svg>
                        </button>
                      ) : (
                        <span className="text-[10px] text-brand-grey">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;