import fs from 'fs/promises';
import path from 'path';
import type { Lead } from '@/types';

export async function saveLead(lead: Lead): Promise<void> {
  // Save locally as JSON in data/leads/ directory
  try {
    const leadsDir = path.join(process.cwd(), 'data', 'leads');
    await fs.mkdir(leadsDir, { recursive: true });
    
    const filePath = path.join(leadsDir, `${lead.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(lead, null, 2), 'utf-8');
  } catch (err) {
    console.error('Leadni faylga saqlashda xato:', err);
  }
}

export async function getLeads(): Promise<Lead[]> {
  try {
    const leadsDir = path.join(process.cwd(), 'data', 'leads');
    const files = await fs.readdir(leadsDir);
    
    const leads: Lead[] = [];
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(leadsDir, file), 'utf-8');
        try {
          leads.push(JSON.parse(content));
        } catch (e) {}
      }
    }
    
    // Sort by created_at descending
    return leads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (err) {
    return [];
  }
}
