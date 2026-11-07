import fs from 'node:fs';
import path from 'node:path';

const dir = path.join('src', 'data', 'entities');

function load(slug) {
  return JSON.parse(fs.readFileSync(path.join(dir, `${slug}.json`), 'utf8'));
}
function save(slug, data) {
  fs.writeFileSync(path.join(dir, `${slug}.json`), `${JSON.stringify(data, null, 2)}\n`);
}
function injectThesisNote(section, almanac, cipher) {
  if (!section.includes('data-part="account"')) return section;
  if (section.includes(cipher.slice(0, 24))) return section;
  return section.replace(
    '</div></div><div class="account"',
    ` <span data-layer="almanac">${almanac}</span><span data-layer="cipher">${cipher}</span></div></div><div class="account"`,
  );
}

{
  const j = load('will-o-the-wisp');
  for (const p of j.plates || []) {
    if (p.name === 'lit') {
      p.cipher = 'Plate I: default lit state; day shimmer is a listed runtime state.';
    }
  }
  j.sections = j.sections.map((s) => s.replaceAll('edge of the case', 'edge of the window'));
  save('will-o-the-wisp', j);
  console.log('wisp');
}

{
  const j = load('minotaur');
  j.sections = j.sections.map((s) =>
    injectThesisNote(
      s.replaceAll('shakes its case', 'shakes against the walls'),
      'Its origin in this Registry is congenital Horizon blood-fire along a Watcher line, not a tourist craft of the maze-makers.',
      'Upgrade 5 origin: congenital Fire-Bringer thickening; contained is an interaction fallback.',
    ),
  );
  save('minotaur', j);
  console.log('minotaur');
}

{
  const j = load('orc');
  for (const p of j.plates || []) {
    if (p.name === 'pod') {
      p.almanac = 'In the soil pod, of limestone-vat descent.';
      p.cipher = 'Plate I: fungal pod grown from vat-brine chemistry.';
    }
  }
  j.sections = j.sections.map((s) =>
    injectThesisNote(
      s,
      'What the Witch mixes in the limestone vat is set into the dark soil to fruit as a pod; the fungal ground is the growth medium, not a denial of the brine.',
      'Vat-brine origin cultivated into fungal soil pod.',
    ),
  );
  save('orc', j);
  console.log('orc');
}

{
  const j = load('succubus');
  j.sections = j.sections.map((s) =>
    injectThesisNote(
      s,
      "The heavy air and low sound of the chamber are the first signs of an unguarded clause in desire; she is dismissed only by the Warlock's Counter-Contract, not by the Enchantress as answering owner.",
      'Low-sound/heavy-air bridges to clause/consent law; answering = Warlock only.',
    ),
  );
  save('succubus', j);
  console.log('succubus');
}

{
  const j = load('fae');
  j.sections = j.sections.map((s) => s.replaceAll('edge of the case', 'edge of the window'));
  save('fae', j);
  console.log('fae');
}

{
  const j = load('unicorn');
  j.sections = j.sections.map((s) =>
    injectThesisNote(
      s,
      'It walks the clean waters and the Grid, but shows its horn only inside the sky’s improbability where Paladin favour already holds.',
      'Clean-water/Grid ecology preserved; probability layer explains revelation.',
    ),
  );
  save('unicorn', j);
  console.log('unicorn');
}

console.log('pass4 migrations complete');
