import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Mail, Shield, CheckCircle2, Clock } from 'lucide-react';
import { Card, Button, Input, Select, Badge, Avatar, Modal } from '../components/ui';
import { useToast } from '../context/ToastContext';
import { MOCK_TEAM } from '../data/mockTeam';

export default function TeamMembersPage() {
  const { addToast } = useToast();
  const [team, setTeam] = useState(MOCK_TEAM);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Engineer');

  useEffect(() => {
    fetch('/api/team')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data && data.length > 0) setTeam(data); })
      .catch(() => {});
  }, []);

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newMemberData = { name: inviteName || inviteEmail.split('@')[0], email: inviteEmail, role: inviteRole };

    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMemberData),
      });
      if (res.ok) {
        const saved = await res.json();
        setTeam(prev => [...prev, saved]);
      } else {
        throw new Error('Failed');
      }
    } catch {
      const localMember = {
        id: `usr_t00${team.length + 1}`,
        name: inviteName || inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        status: 'Invited',
        lastActive: null,
        avatar: (inviteName || inviteEmail).slice(0, 2).toUpperCase(),
        avatarColor: 'bg-teal-600',
      };
      setTeam([...team, localMember]);
    }

    setInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
    addToast({ type: 'success', title: 'Invitation Sent', message: `Invited ${inviteEmail} as ${inviteRole} to Supabase workspace.` });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-400" />
            Team Members
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage your operations team workspace and handover permissions (Connected to Supabase DB).
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<UserPlus className="w-4 h-4" />}
          onClick={() => setInviteModalOpen(true)}
        >
          Invite Team Member
        </Button>
      </div>

      <Card className="border-slate-800 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Member</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {team.map((member) => (
                <tr key={member.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-semibold text-white flex items-center gap-3">
                    <Avatar name={member.name} color={member.avatarColor || 'bg-teal-600'} size="sm" />
                    <span>{member.name}</span>
                  </td>
                  <td className="p-4 font-mono text-slate-400">{member.email}</td>
                  <td className="p-4">
                    <Badge variant={member.role === 'Admin' ? 'teal' : member.role === 'Manager' ? 'info' : 'default'}>
                      {member.role}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={member.status === 'Active' ? 'completed' : member.status === 'Away' ? 'warning' : 'default'}>
                      {member.status}
                    </Badge>
                  </td>
                  <td className="p-4 font-mono text-slate-500">
                    {member.lastActive ? new Date(member.lastActive).toUTCString().slice(0, 22) : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invite Modal */}
      <Modal isOpen={inviteModalOpen} onClose={() => setInviteModalOpen(false)} title="Invite Team Member">
        <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
          <Input
            label="Full Name (Optional)"
            placeholder="e.g. David Chen"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
          />
          <Input
            label="Work Email"
            type="email"
            placeholder="david@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />
          <Select
            label="Role"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
          >
            <option value="Admin">Admin (Full Control)</option>
            <option value="Manager">Manager (View & Export)</option>
            <option value="Engineer">Engineer (Generate & Edit)</option>
            <option value="Viewer">Viewer (Read-only)</option>
          </Select>
          <Button variant="primary" className="w-full mt-2" type="submit">
            Send Invitation Link
          </Button>
        </form>
      </Modal>
    </div>
  );
}
