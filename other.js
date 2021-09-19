const lionTigerBlockTitle = document.querySelector('.lion-tiger-block-title');

// Initial values
document.querySelector('.schedule-title').value = UserSettings.title;
document.querySelector('.use24h').checked = UserSettings.use24h;
document.querySelector('.north').checked = UserSettings.north;
lionTigerBlockTitle.innerHTML = UserSettings.north ? 'Tiger' : 'Lion';
document.querySelector('.useColors').checked = !UserSettings.useColors;

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
    lionTigerBlockTitle.innerHTML = UserSettings.north ? 'Tiger' : 'Lion';
    draw();
});

document.querySelector('.useColors').addEventListener('change', () => {
    UserSettings.useColors = !document.querySelector('.useColors').checked;
    draw();
});

// Buttons
document.querySelector('.save-button').addEventListener('click', () => {
    saveBase64(canvasToBase64(), 'schedule.png');
});
document.querySelector('.print-button').addEventListener('click', () => {
    printBase64(canvasToBase64());
});
document.querySelector('.share-button').addEventListener('click', () => {
    shareCanvas('schedule.png');
});
