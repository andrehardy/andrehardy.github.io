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
      'Congenital Fire-Bringer thickening along a Watcher line. Contained is how the house holds the fire.',
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
      'One cultivation: limestone-vat brine set in the dark soil to fruit as a fungal pod.',
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
      "The heavy air and low sound of the chamber are the first signs of an unguarded clause in the sleeper's desire. She is dismissed only by the Warlock's Counter-Contract. The Enchantress may bar a will by the same persuasion, and that note is a shared medium, not an answering claim.",
      "Low sound and heavy air mark an unguarded clause. Dismissal is the Warlock's Counter-Contract. Enchantress persuasion may bar the will; answering remains the Warlock.",
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
      'Clean water and the Grid remain its ground. The horn is shown only inside Vault probability, where Paladin favour already holds.',
    ),
  );
  save('unicorn', j);
  console.log('unicorn');
}

console.log('pass4 migrations complete');
