export const stages = ['Idea', 'Validation', 'Building', 'Operating'];
export function businessInput(name, stage) {
  name = String(name || '').trim();
  if (!name || name.length > 120 || !stages.includes(stage)) throw Error('Enter a business name and a valid stage.');
  return {name, stage};
}
export function taskInput(title) {
  title = String(title || '').trim();
  if (!title || title.length > 300) throw Error('Enter a task of up to 300 characters.');
  return title;
}
export function passwordMatches(password, confirmation) {
  if (password.length < 12 || password.length > 128) throw Error('Use a password of 12–128 characters.');
  if (password !== confirmation) throw Error('The passwords do not match.');
}
export function connectionReady(config) {
  return Boolean(config && /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.supabaseUrl) &&
    /^(sb_publishable_|eyJ)/.test(config.publishableKey));
}
export function mayOpenWorkspace(aal) { return aal === 'aal2'; }


export const pilotTasks = Object.freeze([
  'Week 1: Define one customer, their problem and one offer.',
  'Week 2: Speak with potential customers and record their feedback.',
  'Week 3: Build the smallest usable pilot for the agreed outcome.',
  'Week 4: Demonstrate the pilot and record willingness to pay.',
  'Week 5: Deliver a scoped trial and record time, costs and results.',
  'Week 6: Review the evidence and choose to continue, change or pause.'
]);
export function missingPilotTasks(existing = []) {
  const titles = new Set(existing.map(task => task.title));
  return pilotTasks.filter(title => !titles.has(title));
}

export const ventureTemplates = Object.freeze({
 'AI Agent': {purpose:'Help businesses plan ventures and scope useful automation.',audience:'Choose one customer group to validate.',offer:'A scoped business-workspace or automation pilot; pricing to validate.',milestone:'Interview potential customers and agree one pilot outcome.'},
 'BestPlaced': {purpose:'Develop a matching experience using quizzes and detailed filters.',audience:'Define the first user group and its matching needs.',offer:'A matching app; business model and pricing to validate.',milestone:'Test a small quiz and filter prototype with potential users.'},
 'Purposed Endeavours': {purpose:'Empower people with knowledge, skills, opportunities and networks aligned with ethical, sustainable and community-focused growth.',audience:'Choose one community or beneficiary group to work with.',offer:'A collaborative social enterprise testing and refining interventions.',milestone:'Choose one community need and test a small intervention.'}
});
export function templateBrief(name) {
 return {...(ventureTemplates[name]||{purpose:'',audience:'',offer:'',milestone:''})};
}

export function validShortlist(raw, catalogue) {
 let values;try{values=JSON.parse(raw||'[]');}catch{return [];}
 if(!Array.isArray(values))return [];
 const allowed=new Set(catalogue);
 return [...new Set(values.filter(v=>typeof v==='string'&&allowed.has(v)))].slice(0,50);
}

export function taskExists(title, tasks) {
 const normal=String(title||'').trim().toLocaleLowerCase();
 return tasks.some(task=>String(task.title||'').trim().toLocaleLowerCase()===normal);
}

export function friendlyError(error) {
 const message=String(error?.message||'');
 if(/failed to fetch|network|load failed/i.test(message))return 'Connection interrupted. Check your internet connection, then retry.';
 if(/invalid login credentials/i.test(message))return 'Email or password was not recognised. Try again or reset your password.';
 if(/email not confirmed/i.test(message))return 'Verify your email using the link in your inbox, then sign in.';
 if(/rate limit|too many requests/i.test(message))return 'Too many attempts. Please wait before trying again.';
 if(/row.level security|permission denied|JWT expired|PGRST116/i.test(message))return 'This action could not be verified. Refresh or sign in again before retrying.';
 return message||'Unable to complete that action. Please retry.';
}

export function taskCsv(tasks) {
 const cell=value=>{
  let text=String(value??'');if(/^[\s]*[=+\-@]/.test(text))text="'"+text;
  return '"'+text.replaceAll('"','""')+'"';
 };
 return [['Task','Status'],...tasks.map(t=>[t.title,t.done?'Completed':'Open'])].map(row=>row.map(cell).join(',')).join('\r\n');
}
