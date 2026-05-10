import { useMemo, useState } from 'react';
import { useAppContext } from '../context/DataContext';
import { Button, Badge } from '../components/ui/Primitives';

export default function ActionsPage() {
  const { data, actions, persona, createAction, updateAction } = useAppContext();
  const [selectedOwner, setSelectedOwner] = useState('all');
  const pendingActions = useMemo(
    () => actions.filter((action) => action.status !== 'Done' && (selectedOwner === 'all' || action.ownerName === selectedOwner)),
    [actions, selectedOwner],
  );
  const owners = Array.from(new Set(actions.map((action) => action.ownerName)));

  return (
    <div className="scroll-y h-full">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-slate-900">Action Tracker</h1>
        <p className="text-sm text-slate-500 mt-1">Manage and escalate actions linked to study performance, risks, and decision outcomes.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select className="input" value={selectedOwner} onChange={(event) => setSelectedOwner(event.target.value)}>
          <option value="all">All owners</option>
          {owners.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
        </select>
        <div className="text-xs text-slate-500">{pendingActions.length} active actions</div>
        <Button variant="ghost" onClick={() => createAction({ title: 'New follow-up', description: 'Review current clinical queries and site resourcing', studyId: data.studies[0].id, ownerName: persona.name })}>Add action</Button>
      </div>

      <div className="space-y-3">
        {pendingActions.length === 0 ? (
          <div className="tile p-6 text-slate-500">No outstanding actions for the selected owner.</div>
        ) : (
          pendingActions.map((action) => (
            <div key={action.id} className="tile p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-lg font-semibold text-slate-900">{action.title}</div>
                  <div className="text-xs text-slate-500 mt-1">{action.studyId} • owner: {action.ownerName}</div>
                </div>
                <Badge>{action.status}</Badge>
              </div>
              <div className="mt-3 text-sm text-slate-700">{action.description}</div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="chip">Due {action.dueDate}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => updateAction(action.id, { status: 'Done' })}>Mark done</Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
