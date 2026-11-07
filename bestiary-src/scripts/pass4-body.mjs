/**
 * Pass 4 body-copy migrations on bestiary-src leaf JSON.
 * Idempotent exact replacements. Does not touch F/U marks or asset paths.
 */
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join('src', 'data', 'entities');

function rewrite(slug, pairs) {
  const file = path.join(dir, `${slug}.json`);
  let raw = fs.readFileSync(file, 'utf8');
  let n = 0;
  for (const [from, to] of pairs) {
    if (from === to) continue;
    if (!raw.includes(from)) {
      if (!raw.includes(to)) console.warn(`${slug}: missing phrase: ${from.slice(0, 72)}`);
      continue;
    }
    const count = raw.split(from).length - 1;
    raw = raw.split(from).join(to);
    n += count;
  }
  fs.writeFileSync(file, raw);
  console.log(`${slug}: ${n} replacement(s)`);
}

rewrite('minotaur', [
  [
    'The Minotaur is a man with the head of a bull, born of a queen\'s unnatural passion and shut by her husband in a house of passages that the craftsman Daedalus built to hold it.',
    'The Minotaur is a man with the head of a bull, thickened by congenital Horizon blood-fire along a Watcher line, and held in a house of passages when that fire will not throttle.',
  ],
  [
    'A Grafted body whose brow and frame thicken under congenital Horizon blood-fire along a Watcher line; unstable heat must be held, and contained is an interaction fallback rather than idle cosmology.',
    'A Grafted body whose brow and frame thicken under congenital Horizon blood-fire along a Watcher line. The heat must be held, and contained is a state of the house, not a sleep of the fire.',
  ],
  [
    'Upgrade 5 origin: congenital Fire-Bringer thickening; contained is an interaction fallback.',
    'Congenital Fire-Bringer thickening along a Watcher line. Contained is how the house holds the fire.',
  ],
  [
    'Of its body this much is certain: it was not meant. It was made by craft, from a passion that the gods sent, and it ran hot and wild, at war with itself.',
    'Of its body this much is certain: the heat is congenital, a Fire-Bringer thickening of Watcher-line blood, and it runs hot and wild, at war with itself. The old books give the maze to a craftsman; the maze is how the fire is held, not the making of the beast.',
  ],
  [
    'Source: neither Tier; the graft is the work of craft (Daedalus\'s device), and nothing sustains it but its own metabolism. Mechanism: the graft does not settle.',
    'Source: the Horizon; congenital Fire-Bringer blood along a Watcher line, not a craft-made graft. Nothing sustains it but its own heat. Mechanism: the thickening does not settle.',
  ],
  [
    'The Golem is also the work of a maker\'s hands, but it obeys. The Minotaur was a graft that failed, and could only be walled in.',
    'The Golem is a maker\'s clay and obeys the Necromancer\'s string. The Minotaur was not made that way: its heat is congenital, and the walls only hold it.',
  ],
  [
    'Both are human work. The Golem is obedient and stoppable; the Minotaur is unstable and must be contained.',
    'The Golem is fabricated and stoppable. The Minotaur is congenital blood-fire, unstable, and must be contained.',
  ],
  [
    'Michael Morbius is called a vampire, but he is filed with the Minotaurs, for he made himself what he is in a laboratory, out of a bat, and is not dead at all.',
    'Michael Morbius is called a vampire, but he is not dead at all. A laboratory joining of man and bat is not this specimen: the Minotaur\'s thickening is congenital Horizon blood-fire, and the name vampire is refused.',
  ],
  [
    'Michael Morbius is labelled a vampire, which names the Vampire, but he is filed as a Minotaur because he is a living graft of human and animal produced by human craft.',
    'Michael Morbius is labelled a vampire, which names the Vampire. A laboratory graft is not the Minotaur; congenital Horizon blood-fire is.',
  ],
  [
    'The Minotaur of Apollodorus is the model Minotaur because he is a graft of human and bull produced by human craft and held only by a structure built to contain him.',
    'The Minotaur of Apollodorus is the model Minotaur because bull and man are one body, held only by a house of passages. The heat is congenital Horizon blood-fire; the maze is containment.',
  ],
  [
    'Asterion is the runner-up Minotaur because he is the contained graft seen from inside his containment, which he takes for the whole world.',
    'Asterion is the runner-up Minotaur because he is the contained beast seen from inside his house, which he takes for the whole world. Contained is the held state, not the origin of the fire.',
  ],
]);

rewrite('golem', [
  [
    'which stops when one letter of the word is removed.</p></div></div>',
    'which stops when one letter of the word is removed.</p> <span data-layer=\\"almanac\\">The clay and the letters stay the making. The string that wakes the clay is the Necromancer\'s, and no other chair answers it.</span><span data-layer=\\"cipher\\">Clay and inscription are the fabrication. Animation is answered by the Necromancer.</span></div></div>',
  ],
  [
    'The Minotaur is also the work of human hands, but a graft that failed and was walled up. The Golem was made to serve, and serves.',
    'The Minotaur is held by walls, but its heat is congenital blood-fire, not a failed making. The Golem is river-clay and inscription, and it serves by the Necromancer\'s string.',
  ],
  [
    'Both are human work. The Golem is obedient and stoppable; the Minotaur is a failed graft that must be contained.',
    'The Golem is fabricated clay, obedient and stoppable, answered by the Necromancer. The Minotaur is congenital Horizon blood-fire and must be contained.',
  ],
]);

rewrite('fae', [
  [
    'The Fae in its room: a gilt cabinet in which the terms of a court are set under glass',
    'The Fae in its room: a gilt lattice of terms at the threshold, and no body in the window',
  ],
  [
    'and nothing in the cabinet crosses it uninvited.',
    'and nothing of the pattern crosses it uninvited.',
  ],
]);

rewrite('lich', [
  [
    'The coat lies in this case, and not the wearer.',
    'The coat is the dressed decoy, and not the wearer.',
  ],
  ['leave this case alone', 'leave the decoy alone'],
  ['the remains displayed are a decoy', 'the robed figure is a dressed decoy'],
  ['in the margin of the case.', 'in the margin beside the decoy.'],
  ['The case text is illegible', 'The reliquary script is illegible'],
  ['Dust on the case increases', 'Dust on the reliquary glass increases'],
]);

rewrite('succubus', [
  [
    "The heavy air and low sound of the chamber are the first signs of an unguarded clause in desire; she is dismissed only by the Warlock's Counter-Contract, not by the Enchantress as answering owner.",
    "The heavy air and low sound of the chamber are the first signs of an unguarded clause in the sleeper's desire. She is dismissed only by the Warlock's Counter-Contract. The Enchantress may bar a will by the same persuasion, and that note is a shared medium, not an answering claim.",
  ],
  [
    'Low-sound/heavy-air bridges to clause/consent law; answering = Warlock only.',
    'Low sound and heavy air mark an unguarded clause. Dismissal is the Warlock\'s Counter-Contract. Enchantress persuasion may bar the will; answering remains the Warlock.',
  ],
  [
    'Containment: none; the episode ends of itself, or with any small movement.',
    "Containment: the episode ends of itself, or with any small movement. The clause is voided by the Warlock's Counter-Contract. Enchantress arts may bar the will, and that remains a shared medium, not the answering law.",
  ],
]);

rewrite('unicorn', [
  [
    'Clean-water/Grid ecology preserved; probability layer explains revelation.',
    'Clean water and the Grid remain its ground. The horn is shown only inside Vault probability, where Paladin favour already holds.',
  ],
]);

rewrite('orc', [
  [
    'Vat-brine origin cultivated into fungal soil pod.',
    'One cultivation: limestone-vat brine set in the dark soil to fruit as a fungal pod.',
  ],
]);

rewrite('will-o-the-wisp', [
  [
    'sustained by the Grid in waterlogged ground',
    'sustained by the wetland Grid in waterlogged ground',
  ],
]);

console.log('pass4 body migrations applied');
