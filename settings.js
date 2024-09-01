const UserSettings = {
    // DO NOT FORGET TO INCREMENT FOR BREAKING CHANGES
    version: 1,

    title: 'NSHS Schedule',
    use24h: false,
    useColors: true,
    showTimes: true,
    showNumbers: true,
    north: false,
    affirmation: 'Semester 1',
};

const BlockSettings = {
    // DO NOT FORGET TO INCREMENT FOR BREAKING CHANGES
    version: 1,

    A1: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    A2: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    A3: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    B1: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    B2: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    B3: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    C1: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    C2: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    C3: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    D1: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    D2: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    D3: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    E1: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    E2: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    E3: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    F1: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    F2: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    F3: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    G1: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    G2: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    G3: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    Advisory: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    Lion: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
    },
    WIN: {
        hasClass: true,
        class: '',
        room: '',
        teacher: '',
        lunch: 3,
        color: 0,
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
