import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Plus, Trash2, Copy, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Students = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  
  const [newStudentCreds, setNewStudentCreds] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data: any = await apiClient.get('/students');
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch students', error);
      alert('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'KINDERGARTEN_ADMIN') {
      fetchStudents();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await apiClient.post('/students/register', { fullName });
      setNewStudentCreds(data);
      setFullName('');
      fetchStudents();
    } catch (error: any) {
       console.error('Failed to create student', error);
       alert(error.response?.data?.message || 'Failed to create student');
    }
  };

  const handleCopy = () => {
    if (newStudentCreds) {
      navigator.clipboard.writeText(`Username: ${newStudentCreds.username}\nPassword: ${newStudentCreds.plainPassword}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewStudentCreds(null);
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await apiClient.delete(`/students/${id}`);
        fetchStudents();
      } catch (error: any) {
        console.error('Failed to delete student', error);
        alert('Failed to delete student');
      }
    }
  };

  if (loading) return <div>Loading students...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Students ({students.length})</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Student
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student: any) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {student.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleDelete(student.id)} 
                    className="text-red-600 hover:text-red-900 ml-4 border border-red-200 p-2 rounded-md hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500 text-sm">
                  This kindergarten has no students yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-sm p-6 shadow-xl relative">
            
            {!newStudentCreds ? (
              <>
                <h2 className="text-xl font-bold mb-4">Add New Student</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      required
                      name="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Generate Login
                    </button>
                  </div>
                </form>
              </>
            ) : (
              // Success View for Credentials
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Student Added!</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Please securely copy the login credentials below. 
                  <br/><span className="font-bold text-red-600">The password will only be shown once!</span>
                </p>
                <div className="bg-gray-50 rounded p-4 text-left border border-gray-200 mb-4">
                  <p className="font-mono text-sm mb-2"><span className="font-semibold text-gray-600">Username:</span> {newStudentCreds.username}</p>
                  <p className="font-mono text-sm"><span className="font-semibold text-gray-600">Password:</span> {newStudentCreds.plainPassword}</p>
                </div>
                
                <div className="flex space-x-3 justify-center">
                  <button
                    onClick={handleCopy}
                    className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-50"
                  >
                    {copied ? <Check className="h-4 w-4 mr-2"/> : <Copy className="h-4 w-4 mr-2"/> }
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
