'use client'

import { useState } from 'react';

interface InviteModalProps {
  id: string
  onClose: () => void
}

// THIS MUST BE IN SYNC WITH YOUR API AND `project_collaborators` TABLE
const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' },
]

export default function InviteModal({ id, onClose }: InviteModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer'); // Default to least-privileged
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/projects/${id}/invites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send invite');
      }

      // Success
      setSuccess(true);
      setEmail('');
      setRole('viewer');
      // Maybe close modal after a delay?
      // setTimeout(onClose, 2000);

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-background rounded-lg shadow-lg p-6 w-96" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">Invite to Project</h2>
        
        {success ? (
          <div className="text-center">
            <p className="text-green-600">Invite sent successfully!</p>
            <button 
              onClick={() => setSuccess(false)}
              className="mt-4 px-4 py-2 w-full rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-muted-foreground mb-1">
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

            <div className="flex justify-end gap-2 mt-6">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 rounded-md text-muted-foreground hover:bg-muted"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
                disabled={isLoading || !email}
              >
                {isLoading ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}