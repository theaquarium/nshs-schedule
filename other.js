const lionTigerBlockTitle = document.querySelector('.lion-tiger-block-title');

// Initial values
document.querySelector('.schedule-title').value = UserSettings.title;
document.querySelector('.use24h').checked = UserSettings.use24h;
document.querySelector('.north').checked = UserSettings.north;
lionTigerBlockTitle.innerHTML = UserSettings.north ? 'Tiger' : 'Lion';
document.querySelector('.useColors').checked = !UserSettings.useColors;
document.querySelector('.affirmation').value = UserSettings.affirmation;

document.querySelector('.schedule-title').addEventListener('input', () => {
    UserSettings.title = document.querySelector('.schedule-title').value;
    draw();
});

document.querySelector('.use24h').addEventListener('change', () => {
    UserSettings.use24h = document.querySelector('.use24h').checked;
    draw();
});

document.querySelector('.north').addEventListener('change', () => {
    UserSettings.north = document.querySelector('.north').checked;
    UserSettings.title = UserSettings.north ? 'NNHS Schedule' : 'NSHS Schedule';
    document.querySelector('.schedule-title').value = UserSettings.title;
    lionTigerBlockTitle.innerHTML = UserSettings.north ? 'Tiger' : 'Lion';
    draw();
});

document.querySelector('.useColors').addEventListener('change', () => {
    UserSettings.useColors = !document.querySelector('.useColors').checked;
    draw();
});

document.querySelector('.affirmation').addEventListener('input', () => {
    UserSettings.affirmation = document.querySelector('.affirmation').value;
    draw();
});

// Buttons
document.querySelector('.save-button').addEventListener('click', () => {
    saveBase64(canvasToBase64(), 'schedule.png');
});
document.querySelector('.print-button').addEventListener('click', () => {
    printBase64(canvasToBase64());
});

document.querySelector('.mobile-save-button').addEventListener('click', () => {
    shareCanvas('schedule.png');
});

const affirmations = [
    "You're doing amazing, have a great day!",
    "You're doing great today!",
    "You've got this!",
    'Have a great day!',
    "You're going to do great today!",
    'This is your moment!',
    'The sky is the limit!',
    'You are unique and wonderful.',
    'Make today your day!',
    'Be yourself!',
    'You are valid.',
    'Every day is an opportunity!',
    'You are amazing!',
    'Follow your feelings.',
    'Love yourself.',
    'Make today go how you want it.',
    'Have an amazing day!',
    'You are awesome!',
    'You are unstoppable!',
    'Today is your day!',
    "You're wonderful!",
    "Show everyone what you're made of!",
    'You are loved.',
    'Take care of yourself.',
    'Take care of yourself today.',
    'You deserve the best.',
    'You deserve the best.',
];

document.querySelector('.new-affirmation').addEventListener('click', () => {
    UserSettings.affirmation =
        affirmations[Math.floor(Math.random() * affirmations.length)];
    document.querySelector('.affirmation').value = UserSettings.affirmation;
    draw();
});
