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
