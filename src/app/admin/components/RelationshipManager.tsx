"use client";

import { toggleProjectSkill, toggleProjectResearch, toggleProjectAchievement, toggleRelatedProject } from "../actions/relationship";

interface Skill { id: string; name: string; }
interface Research { id: string; name: string; }
interface Achievement { id: string; name: string; }
interface RelatedProject { id: string; name: string; }

interface Props {
  projectId: string;
  allSkills: Skill[];
  linkedSkillIds: string[];
  allResearch: Research[];
  linkedResearchIds: string[];
  allAchievements: Achievement[];
  linkedAchievementIds: string[];
  allProjects: RelatedProject[];
  linkedProjectIds: string[];
}

function ChecklistGroup({ title, items, linkedIds, onToggle }: {
  title: string;
  items: { id: string; name: string }[];
  linkedIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="rounded-xl p-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
      <h4 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "#8888a0" }}>{title}</h4>
      <div className="space-y-1.5">
        {items.map((item) => {
          const checked = linkedIds.includes(item.id);
          return (
            <label key={item.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded cursor-pointer hover:bg-white/5 transition-colors">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(item.id)}
                className="w-3.5 h-3.5 rounded accent-[#00c8e0]"
              />
              <span className="text-sm" style={{ color: checked ? "#e8e8ec" : "#8888a0" }}>{item.name}</span>
            </label>
          );
        })}
        {items.length === 0 && <p className="text-xs py-2" style={{ color: "#55556a" }}>No items available</p>}
      </div>
    </div>
  );
}

export default function RelationshipManager({
  projectId, allSkills, linkedSkillIds, allResearch, linkedResearchIds,
  allAchievements, linkedAchievementIds, allProjects, linkedProjectIds,
}: Props) {
  return (
    <div className="space-y-4">
      <p className="text-xs" style={{ color: "#8888a0" }}>
        Connect this project to skills, research, achievements, and other projects.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChecklistGroup title="Skills" items={allSkills} linkedIds={linkedSkillIds} onToggle={(id) => toggleProjectSkill(projectId, id).then(() => window.location.reload())} />
        <ChecklistGroup title="Research" items={allResearch} linkedIds={linkedResearchIds} onToggle={(id) => toggleProjectResearch(projectId, id).then(() => window.location.reload())} />
        <ChecklistGroup title="Achievements" items={allAchievements} linkedIds={linkedAchievementIds} onToggle={(id) => toggleProjectAchievement(projectId, id).then(() => window.location.reload())} />
        <ChecklistGroup title="Related Projects" items={allProjects.filter(p => p.id !== projectId)} linkedIds={linkedProjectIds} onToggle={(id) => toggleRelatedProject(projectId, id).then(() => window.location.reload())} />
      </div>
    </div>
  );
}
