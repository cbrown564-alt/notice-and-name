// The data module. The library is editorial content baked into the build
// (content.ts); the only thing kept on the device is the person's own field
// notes, in one JSON file under the app's private data folder. Nothing here
// talks to a network: the grants below are the whole of what the app can reach.
import type { Answer, Result, Sources, Storage } from './app.contract.d.ts';
import { chapters, concepts, pathways, prompts } from './content.ts';

const FILE = 'app:/data/notes.json';
export const grants = `fs.read ${FILE}\nfs.write ${FILE}`;

type Note = Result<'loadNotes'>[number];

const load = (storage: Storage): Promise<Note[]> => storage.fs.readFile(FILE).then(
  (bytes) => JSON.parse(new TextDecoder().decode(bytes)) as Note[],
  (e) => { if (e.code === 'ENOENT' || e.code === 'bake') return []; throw e; });

const save = async (storage: Storage, notes: Note[]): Promise<Result<'addNote'>> => {
  await storage.fs.atomicWriteFile(FILE, new TextEncoder().encode(JSON.stringify(notes)));
  return { ok: true };
};

const sources: Sources = {
  library: (): Result<'library'> => ({ chapters, concepts, pathways, prompts }),
  loadNotes: (_args, _store, storage) => load(storage),
  // Newest first. The id is the largest so far plus one, so a deleted note's id is never reused.
  addNote: async ([conceptId, text, day], _store, storage) => {
    const all = await load(storage);
    const next = all.reduce((most, n) => Math.max(most, Number(n.id)), 0) + 1;
    return save(storage, [{ id: String(next), conceptId, text, day }, ...all]);
  },
  removeNote: async ([id], _store, storage) => save(storage, (await load(storage)).filter((n) => n.id !== id)),
};

export const answer: Answer = (source, args, store, storage, native) =>
  sources[source](args, store, storage, native);
