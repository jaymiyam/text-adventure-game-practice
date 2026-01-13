const textEl = document.querySelector('#text');
const buttonsWrapperEl = document.querySelector('#buttons-wrapper');

let gameStates = {};

/*
gameNode: {
    id: number,
    text: string -> description display to players,
    options: [
        {
            text: string -> option description display to players,
            nextNode: id -> identify the next step this option leads to,
            setState: stateObj -> update the gameState based on the selection of this option,
            requiredState: (state) => boolean -> if the requiredState exists in current gameStates
        }
    ]
}
*/

function startGame() {
  gameStates = {};
  showNode(1);
}

function showNode(id) {
  const targetNode = nodes.find((node) => node.id === id);
  textEl.innerText = targetNode.text;

  // clear option buttons
  while (buttonsWrapperEl.firstChild) {
    buttonsWrapperEl.removeChild(buttonsWrapperEl.firstChild);
  }

  // loop through new node options
  targetNode.options.forEach((option) => {
    if (checkIfShowOption(option)) {
      const btn = document.createElement('button');
      btn.classList.add('option-btn');
      btn.innerText = option.text;
      btn.addEventListener('click', () => selectOption(option));
      buttonsWrapperEl.appendChild(btn);
    }
  });
}

function checkIfShowOption(option) {
  return option.requiredState == null || option.requiredState(gameStates);
}

function selectOption(option) {
  const nextNode = option.next;

  if (nextNode === -1) {
    return startGame();
  }

  const nextId =
    typeof nextNode === 'function' ? nextNode(gameStates) : nextNode;
  gameStates = Object.assign(gameStates, option.setState);

  showNode(nextId);
}

const nodes = [
  {
    id: 1,
    text: 'You awaken on damp forest ground, your memories gone. Nearby lie a worn backpack and a sword paired with a battered shield.',
    options: [
      {
        text: 'Pick up the backpack',
        setState: { coins: true },
        next: 2,
      },
      {
        text: 'Arm yourself with the sword and shield',
        setState: { sword: true },
        next: 2,
      },
    ],
  },
  {
    id: 2,
    text: 'You follow a narrow trail until a lone merchant appears, her cart creaking softly in the wind.',
    options: [
      {
        text: 'Spend coins on fresh fruit',
        requiredState: (currentState) => currentState.coins,
        setState: { coins: false },
        next: 3,
      },
      {
        text: 'Buy a strange jar of shimmering goo',
        requiredState: (currentState) => currentState.coins,
        setState: { coins: false, goo: true },
        next: 3,
      },
      {
        text: 'Move on quietly with empty pockets',
        requiredState: (currentState) => !currentState.coins,
        next: 3,
      },
    ],
  },
  {
    id: 3,
    text: 'An old church stands ahead. Inside, a frail priest offers warmth—and a riddle—for a divine reward: “1=3, 2=3, 3=5, 4=4, 5=4. What is 6?”',
    options: [
      { text: 'Answer: 1', next: 4 },
      { text: 'Answer: 2', next: 4 },
      { text: 'Answer: 3', next: 5 },
      { text: 'Answer: 4', next: 4 },
    ],
  },
  {
    id: 4,
    text: 'The priest smiles gently. “Wisdom comes with time,” he says, turning away.',
    options: [
      {
        text: 'Leave the church and seek rest elsewhere',
        next: 6,
      },
    ],
  },
  {
    id: 5,
    text: 'The priest’s eyes brighten. He presses a golden charm into your palm. “May it guide you,” he whispers.',
    options: [
      {
        text: 'Thank him and continue your journey',
        setState: { charm: true },
        next: 6,
      },
    ],
  },
  {
    id: 6,
    text: 'Villagers gather around you, fear in their voices. A cursed castle looms nearby, and they beg for your help.',
    options: [
      {
        text: 'Accept their plea and head for the castle',
        next: 7,
      },
      {
        text: 'Refuse politely and walk away',
        next: 8,
      },
    ],
  },
  {
    id: 7,
    text: 'On the road, the merchant finds you again. “A gift,” she says. “You’ll need it.”',
    options: [
      {
        text: 'Accept a healing potion',
        setState: { healthPotion: true },
        next: 9,
      },
      {
        text: 'Accept a sleeping potion',
        setState: { sleepingPotion: true },
        next: 9,
      },
    ],
  },
  {
    id: 8,
    text: 'That night, a monstrous roar echoes from the castle and reached the village. By dawn, the village is silent—and so are you.',
    options: [{ text: 'Restart your fate', next: -1 }],
  },
  {
    id: 9,
    text: 'A wandering alchemist stops you. “Any substances worth refining?” he asks with a grin.',
    options: [
      {
        text: 'Have him turn the goo into a deadly bomb',
        requiredState: (currentState) => currentState.goo,
        setState: { goo: false, poisonousBomb: true },
        next: 10,
      },
      {
        text: 'Decline and continue onward',
        requiredState: (currentState) => !currentState.goo,
        next: 10,
      },
    ],
  },
  {
    id: 10,
    text: 'You reach the castle gates, sealed by magic. Strange letters glow on a lock: “ENTQ. One step forward reveals the truth.”',
    options: [
      { text: 'Press the number 9', next: 11 },
      { text: 'Press the number 4', next: 21 },
      { text: 'Press the number 0', next: 11 },
      { text: 'Press the number 5', next: 11 },
    ],
  },
  {
    id: 21,
    text: 'The lock shatters with a flash of light, you enter and venture forth. Deep inside the castle, a massive shadow stirs—it has found you.',
    options: [
      { text: 'Turn and flee', next: 14 },
      {
        text: 'Hurl the poisonous bomb',
        requiredState: (currentState) => currentState.poisonousBomb,
        setState: { poisonousBomb: false },
        next: 15,
      },
      {
        text: 'Raise the magical charm',
        requiredState: (currentState) => currentState.charm,
        setState: { charm: false },
        next: 16,
      },
      {
        text: 'Charge with sword and shield',
        requiredState: (currentState) => currentState.sword,
        setState: { sword: false },
        next: 17,
      },
      {
        text: 'Throw the sleeping potion',
        requiredState: (currentState) => currentState.sleepingPotion,
        setState: { sleepingPotion: false },
        next: 19,
      },
    ],
  },
  {
    id: 11,
    text: 'The glow fades. The gate stands firm. You’ll need another way in.',
    options: [
      {
        text: 'Climb the outer wall',
        next: (state) => (state.healthPotion ? 13 : 12),
      },
    ],
  },
  {
    id: 12,
    text: 'You fall into thorns below. Wounded and helpless, darkness soon follows.',
    options: [{ text: 'Restart your fate', next: -1 }],
  },
  {
    id: 13,
    text: 'Pain surges as you land, but you manage to heal yourself. Deep within the castle, a monstrous guardian awaits.',
    options: [
      { text: 'Try to escape', next: 14 },
      {
        text: 'Throw the poisonous bomb',
        requiredState: (currentState) => currentState.poisonousBomb,
        setState: { poisonousBomb: false },
        next: 15,
      },
      {
        text: 'Use the magical charm',
        requiredState: (currentState) => currentState.charm,
        setState: { charm: false },
        next: 16,
      },
      {
        text: 'Fight with sword and shield',
        requiredState: (currentState) => currentState.sword,
        setState: { sword: false },
        next: 17,
      },
      {
        text: 'Throw the sleeping potion',
        requiredState: (currentState) => currentState.sleepingPotion,
        setState: { sleepingPotion: false },
        next: 19,
      },
    ],
  },
  {
    id: 14,
    text: 'You turn to run, but the monster is faster. Your journey ends here.',
    options: [{ text: 'Restart your fate', next: -1 }],
  },
  {
    id: 15,
    text: 'The bomb erupts. The beast collapses. You stand victorious—"The Alchemist" by deed.',
    options: [{ text: 'Restart your fate', next: -1 }],
  },
  {
    id: 16,
    text: 'The charm glows, then fades. The monster roars—and strikes you down.',
    options: [{ text: 'Restart your fate', next: -1 }],
  },
  {
    id: 17,
    text: 'Steel clashes with claw. You are wounded, your shield shattered.',
    options: [
      {
        text: 'Drink health potion and fight back',
        requiredState: (currentState) => currentState.healthPotion,
        setState: { healthPotion: false },
        next: 18,
      },
      {
        text: 'Attempt to flee',
        next: 14,
      },
    ],
  },
  {
    id: 18,
    text: 'With a final strike, the monster falls. You emerge as a "True Warrior".',
    options: [{ text: 'Restart your fate', next: -1 }],
  },
  {
    id: 19,
    text: 'The potion takes effect. The monster sways, barely conscious.',
    options: [
      {
        text: 'Use the magical charm',
        requiredState: (currentState) => currentState.charm,
        setState: { charm: false },
        next: 20,
      },
      {
        text: 'Finish it with your sword',
        requiredState: (currentState) => currentState.sword,
        setState: { sword: false },
        next: 18,
      },
      {
        text: 'Throw the poisonous bomb',
        requiredState: (currentState) => currentState.poisonousBomb,
        setState: { poisonousBomb: false },
        next: 15,
      },
    ],
  },
  {
    id: 20,
    text: 'Light pours from the charm. The monster kneels before you, tamed at last. You are remembered as "The Tamer".',
    options: [{ text: 'Restart your fate', next: -1 }],
  },
];

// const nodes = [
//   {
//     id: 1,
//     text: 'You wake up in the woods not remembering anything, there is a backpack and a pair of sword and shield near of you',
//     options: [
//       {
//         text: 'Take the backpack with coins inside',
//         setState: { coins: true },
//         next: 2,
//       },
//       {
//         text: 'Take the sword and shield',
//         setState: { sword: true },
//         next: 2,
//       },
//     ],
//   },
//   {
//     id: 2,
//     text: 'You venture forth in the trails to where you are when you come across a merchant.',
//     options: [
//       {
//         text: 'Use coins to buy fruits and eat them',
//         requiredState: (currentState) => currentState.coins,
//         setState: { coins: false },
//         next: 3,
//       },
//       {
//         text: 'Use coins to buy a mysterious jar of goo',
//         requiredState: (currentState) => currentState.coins,
//         setState: { coins: false, goo: true },
//         next: 3,
//       },
//       {
//         text: 'Move on, you have no money to buy',
//         requiredState: (currentState) => !currentState.coins,
//         next: 3,
//       },
//     ],
//   },
//   {
//     id: 3,
//     text: 'As you keep walking, a small old church come into sight, you go inside to seek shelter and warmth. An old priest invites you to solve a riddle for a small gift: “1 = 3, 2 = 3, 3 = 5, 4 = 4, 5 = 4” 6 = ?',
//     options: [
//       {
//         text: '1',
//         next: 4,
//       },
//       {
//         text: '2',
//         next: 4,
//       },
//       {
//         text: '3',
//         next: 5,
//       },
//       {
//         text: '4',
//         next: 4,
//       },
//     ],
//   },
//   {
//     id: 4,
//     text: 'The old priest smiled lightly and said “maybe next time.”',
//     options: [
//       {
//         text: 'Go on to get some food and rest',
//         next: 6,
//       },
//     ],
//   },
//   {
//     id: 5,
//     text: 'The old priest smiled brightly and gifted you with a shiny golden charm, saids that it is a gift from god',
//     options: [
//       {
//         text: 'Go on to get some food and rest',
//         setState: { charm: true },
//         next: 6,
//       },
//     ],
//   },
//   {
//     id: 6,
//     text: 'Some villagers in the church approached you and asked you to go investigate a nearby old castle that said to have been haunted',
//     options: [
//       {
//         text: 'Agree to go explore the castle',
//         next: 7,
//       },
//       {
//         text: 'Refuse to go and apologize',
//         next: 8,
//       },
//     ],
//   },
//   {
//     id: 7,
//     text: 'On your way to the castle you meet the same merchant again. She wants to gift you something for your adventure',
//     options: [
//       {
//         text: 'Take the health potion',
//         setState: { healthPotion: true },
//         next: 9,
//       },
//       {
//         text: 'Take the sleeping potion',
//         setState: { sleepingPotion: true },
//         next: 9,
//       },
//     ],
//   },
//   {
//     id: 8,
//     text: 'At night, a horrible monster broke out of the castle and killed you and everyone in the village.',
//     options: [
//       {
//         text: 'Restart',
//         next: -1,
//       },
//     ],
//   },
//   {
//     id: 9,
//     text: 'As you walk again, an alchemist approached you and offered to enhance whatever chemical substance you have.',
//     options: [
//       {
//         text: 'Make poisonous bomb from goo',
//         requiredState: (currentState) => currentState.goo,
//         setState: { goo: false, poisonousBomb: true },
//         next: 10,
//       },
//       {
//         text: 'Move on, you have nothing for him',
//         requiredState: (currentState) => !currentState.goo,
//         next: 10,
//       },
//     ],
//   },
//   {
//     id: 10,
//     text: 'Finally, you reached the castle, gate is locked by mysterious spell, with scribbles on a lock: “ENTQ, one step forward reveals the truth”. It seems like you have to pick a number on the lock',
//     options: [
//       {
//         text: '9',
//         next: 11,
//       },
//       {
//         text: '4',
//         next: 21,
//       },
//       {
//         text: '0',
//         next: 11,
//       },
//       {
//         text: '5',
//         next: 11,
//       },
//     ],
//   },
//   {
//     id: 21,
//     text: 'The lock shines briefly and broke open. You entered the castle, after a long walk down to the deepest hall you encountered a horrible monster.',
//     options: [
//       {
//         text: 'Try to run',
//         next: 14,
//       },
//       {
//         text: 'Throw poisonous bomb at monster',
//         requiredState: (currentState) => currentState.poisonousBomb,
//         setState: { poisonousBomb: false },
//         next: 15,
//       },
//       {
//         text: 'Use the magical charm on monster',
//         requiredState: (currentState) => currentState.charm,
//         setState: { charm: false },
//         next: 16,
//       },
//       {
//         text: 'Use sword to attack monster',
//         requiredState: (currentState) => currentState.sword,
//         setState: { sword: false },
//         next: 17,
//       },
//       {
//         text: 'Throw sleeping potion at monster',
//         requiredState: (currentState) => currentState.sleepingPotion,
//         setState: { sleepingPotion: false },
//         next: 19,
//       },
//     ],
//   },
//   {
//     id: 11,
//     text: 'The light of the plate faded and the gate remained shut. You have to find another way to enter the castle',
//     options: [
//       {
//         text: 'Jump over the wall',
//         next: (state) => (state.healthPotion ? 13 : 12),
//       },
//     ],
//   },
//   {
//     id: 12,
//     text: 'You landed on a patch of spiky plants and were hurt badly, without any health potion you could not heal your self and bled to death.',
//     options: [
//       {
//         text: 'Restart',
//         next: -1,
//       },
//     ],
//   },
//   {
//     id: 13,
//     text: 'You landed on a patch of spiky plants and were hurt badly, luckily you had health potion with you and healed. You entered the castle, after a long walk down to the deepest hall you encountered a horrible monster.',
//     options: [
//       {
//         text: 'Try to run',
//         next: 14,
//       },
//       {
//         text: 'Throw poisonous bomb at monster',
//         requiredState: (currentState) => currentState.poisonousBomb,
//         setState: { poisonousBomb: false },
//         next: 15,
//       },
//       {
//         text: 'Use the magical charm on monster',
//         requiredState: (currentState) => currentState.charm,
//         setState: { charm: false },
//         next: 16,
//       },
//       {
//         text: 'Use sword to attack monster',
//         requiredState: (currentState) => currentState.sword,
//         setState: { sword: false },
//         next: 17,
//       },
//       {
//         text: 'Throw sleeping potion at monster',
//         requiredState: (currentState) => currentState.sleepingPotion,
//         setState: { sleepingPotion: false },
//         next: 19,
//       },
//     ],
//   },
//   {
//     id: 14,
//     text: 'Your attempts to run are in vain and the monster easily catches.',
//     options: [
//       {
//         text: 'Restart',
//         next: -1,
//       },
//     ],
//   },
//   {
//     id: 15,
//     text: 'The monster groans and fell onto the ground. Congratulations! You killed the monster with poisonous dart, Earned title of “Alchemist”',
//     options: [
//       {
//         text: 'Restart',
//         next: -1,
//       },
//     ],
//   },
//   {
//     id: 16,
//     text: 'Monster rants and the charm seemed to do nothing to it, you were killed by monster.',
//     options: [
//       {
//         text: 'Restart',
//         next: -1,
//       },
//     ],
//   },
//   {
//     id: 17,
//     text: 'The monster groans and fights back. You took a big hit and your shield is broken.',
//     options: [
//       {
//         text: 'Heal with potion and attack again',
//         requiredState: (currentState) => currentState.healthPotion,
//         setState: { healthPotion: false },
//         next: 18,
//       },
//       {
//         text: 'Try to run',
//         next: 14,
//       },
//     ],
//   },
//   {
//     id: 18,
//     text: 'The monster groans and fell onto the ground. Congratulations! You killed the monster with sword and shield, Earned title of “Warrior”',
//     options: [
//       {
//         text: 'Restart',
//         next: -1,
//       },
//     ],
//   },
//   {
//     id: 19,
//     text: 'The monster stumbles and dropped to its feet, the sleeping potion worked.',
//     options: [
//       {
//         text: 'Use the magical charm on monster',
//         requiredState: (currentState) => currentState.charm,
//         setState: { charm: false },
//         next: 20,
//       },
//       {
//         text: 'Use sword to attack monster',
//         requiredState: (currentState) => currentState.sword,
//         setState: { sword: false },
//         next: 18,
//       },
//       {
//         text: 'Throw poisonous bomb at monster',
//         requiredState: (currentState) => currentState.poisonousBomb,
//         setState: { poisonousBomb: false },
//         next: 15,
//       },
//     ],
//   },
//   {
//     id: 20,
//     text: 'The charm gives out enormous light, the monster wakes and lower its body in front of you. Congratulations! You tamed the monster with the magical charm, Earned title of "Tamer"',
//     options: [
//       {
//         text: 'Restart',
//         next: -1,
//       },
//     ],
//   },
// ];

startGame();
