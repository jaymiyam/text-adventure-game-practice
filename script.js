const textEl = document.querySelector('#text');
const locationEl = document.querySelector('#location');
const buttonsWrapperEl = document.querySelector('#buttons-wrapper');
const inventoryEl = document.querySelector('#inventory');

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

function showInventory() {
  inventoryEl.innerHTML = '';

  Object.keys(gameStates).forEach((state) => {
    if (gameStates[state]) {
      const item = document.createElement('div');
      item.classList.add('item');
      item.innerText = state;
      inventoryEl.appendChild(item);
    }
  });
}

function showNode(id) {
  const targetNode = nodes.find((node) => node.id === id);
  textEl.innerText = targetNode.text;
  locationEl.innerText = targetNode.location;

  // clear option buttons
  while (buttonsWrapperEl.firstChild) {
    buttonsWrapperEl.removeChild(buttonsWrapperEl.firstChild);
  }

  // loop through new node options and create buttons
  targetNode.options.forEach((option) => {
    if (checkIfShowOption(option)) {
      const btn = document.createElement('button');
      btn.classList.add('option-btn');
      btn.innerText = option.text;

      // add event listener to trigger the selectOption function on click
      btn.addEventListener('click', () => selectOption(option));
      buttonsWrapperEl.appendChild(btn);
    }
  });

  // update inventory display
  showInventory();
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

  // merge the option state to the existing gameStates
  gameStates = Object.assign(gameStates, option.setState);

  console.log(gameStates);

  showNode(nextId);
}

// *** Game nodes object ***
const nodes = [
  {
    id: 1,
    location: 'The Forest',
    text: 'You awaken on damp forest ground, your memories gone. Nearby lie a worn backpack and a sword paired with a battered shield.',
    options: [
      {
        text: 'Pick up the backpack',
        setState: { coins: true },
        next: 2,
      },
      {
        text: 'Arm yourself with the sword and shield',
        setState: { sword: true, shield: true },
        next: 2,
      },
    ],
  },
  {
    id: 2,
    location: 'The Forest',
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
    location: 'The Church',
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
    location: 'The Church',
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
    location: 'The Church',
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
    location: 'The Village',
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
    location: 'The Village',
    text: 'On the road, the merchant finds you again. “A gift,” she says. “You’ll need it.”',
    options: [
      {
        text: 'Accept a healing potion',
        setState: { healthPotion: true, sleepingPotion: false },
        next: 9,
      },
      {
        text: 'Accept a sleeping potion',
        setState: { sleepingPotion: true, healthPotion: false },
        next: 9,
      },
    ],
  },
  {
    id: 8,
    location: 'The Village',
    text: 'That night, a monstrous roar echoes from the castle and reached the village. By dawn, the village is silent—and so are you.',
    options: [{ text: 'Restart your fate', next: -1 }],
  },
  {
    id: 9,
    location: 'The Village',
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
    location: 'The Gate',
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
    location: 'The Gate',
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
        setState: { shield: false },
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
    location: 'The Gate',
    text: 'The glow fades. The gate stands firm. You’ll need another way in.',
    options: [
      {
        text: 'Climb the outer wall',
        setState: { healthPotion: false },
        next: (state) => (state.healthPotion ? 13 : 12),
      },
    ],
  },
  {
    id: 12,
    location: 'The Castle',
    text: 'You fall into thorns below. Wounded and helpless, darkness soon follows.',
    options: [{ text: 'Restart your fate', next: -1 }],
  },
  {
    id: 13,
    location: 'The Castle',
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
        setState: { shield: false },
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
    location: 'The Castle',
    text: 'You turn to run, but the monster is faster. Your journey ends here.',
    options: [{ text: 'Restart your fate', next: -1 }],
  },
  {
    id: 15,
    location: 'The Castle',
    text: 'The bomb erupts. The beast collapses. You stand victorious—"The Alchemist" by deed.',
    options: [{ text: 'Restart your fate', next: -1 }],
  },
  {
    id: 16,
    location: 'The Castle',
    text: 'The charm glows, then fades. The monster roars—and strikes you down.',
    options: [{ text: 'Restart your fate', next: -1 }],
  },
  {
    id: 17,
    location: 'The Castle',
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
    location: 'The Castle',
    text: 'With a final strike, the monster falls. You emerge as a "True Warrior".',
    options: [{ text: 'Restart your fate', next: -1 }],
  },
  {
    id: 19,
    location: 'The Castle',
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
    location: 'The Castle',
    text: 'Light pours from the charm. The monster kneels before you, tamed at last. You are remembered as "The Tamer".',
    options: [{ text: 'Restart your fate', next: -1 }],
  },
];

startGame();
