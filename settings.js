const UserSettings = {
    // DO NOT FORGET TO INCREMENT FOR BREAKING CHANGES
    version: 1,

    title: 'NSHS Schedule',
    use24h: false,
    useColors: true,
    showTimes: true,
    showNumbers: true,
    invert: false,
    north: false,
    affirmation: 'Semester 1',
};

const BlockSettings = {
    // DO NOT FORGET TO INCREMENT FOR BREAKING CHANGES
    version: 2,

    A1: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 1,
        customColor: '#ff0000',
    },
    A2: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 1,
        customColor: '#ff0000',
    },
    A3: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 1,
        customColor: '#ff0000',
    },
    B1: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 2,
        customColor: '#ff0000',
    },
    B2: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 2,
        customColor: '#ff0000',
    },
    B3: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 2,
        customColor: '#ff0000',
    },
    C1: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 3,
        customColor: '#ff0000',
    },
    C2: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 3,
        customColor: '#ff0000',
    },
    C3: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 3,
        customColor: '#ff0000',
    },
    D1: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 4,
        customColor: '#ff0000',
    },
    D2: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 4,
        customColor: '#ff0000',
    },
    D3: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 4,
        customColor: '#ff0000',
    },
    E1: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 5,
        customColor: '#ff0000',
    },
    E2: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 5,
        customColor: '#ff0000',
    },
    E3: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 5,
        customColor: '#ff0000',
    },
    F1: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 6,
        customColor: '#ff0000',
    },
    F2: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 6,
        customColor: '#ff0000',
    },
    F3: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 6,
        customColor: '#ff0000',
    },
    G1: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 7,
        customColor: '#ff0000',
    },
    G2: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 7,
        customColor: '#ff0000',
    },
    G3: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 7,
        customColor: '#ff0000',
    },
    Advisory: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 9,
        customColor: '#ff0000',
    },
    Lion: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 10,
        customColor: '#ff0000',
    },
    WIN: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 8,
        customColor: '#ff0000',
    },
};

function saveData() {
    localStorage.setItem('user', JSON.stringify(UserSettings));
    localStorage.setItem('block', JSON.stringify(BlockSettings));
}

function loadData() {
    try {
        const parsedUser = JSON.parse(localStorage.getItem('user'));
        const parsedBlock = JSON.parse(localStorage.getItem('block'));

        if (
            parsedUser?.version &&
            parsedUser?.version === UserSettings.version
        ) {
            Object.assign(UserSettings, parsedUser);
        }
        if (
            parsedBlock?.version &&
            parsedBlock?.version === BlockSettings.version
        ) {
            Object.assign(BlockSettings, parsedBlock);
        }
    } catch (e) {
        console.error('Error reading from storage', e);
    }
}

function resetData() {
    localStorage.removeItem('user');
    localStorage.removeItem('block');
}

loadData();
