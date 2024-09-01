const clock = document.querySelector('#clock');
const weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

function updateClock() {
    const now = new Date(2024, 8, 2, 12, 45, 0);
    // const now = new Date();

    if (now.getDay() === 0 || now.getDay() === 6) {
        clock.style.display = 'none';
        return;
    } else {
        clock.style.display = 'block';
    }

    const timeStr = `${now.getHours()}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

    let ampm = '';
    if (!UserSettings.use24h) {
        ampm = now.getHours() < 12 ? 'AM' : 'PM';
    }

    clock.querySelector('#clock-time').innerText = `${
        weekday[now.getDay()]
    }, ${convertTime(timeStr, UserSettings.use24h)}${ampm}`;

    const daySched = Schedule[now.getDay() - 1].blocks;

    const nowMinute = timeStringToMinute(timeStr);

    const dayStart = timeStringToMinute(daySched[0].startTime);
    const dayEnd = timeStringToMinute(daySched[daySched.length - 1].endTime);
    if (nowMinute < dayStart || nowMinute > dayEnd) {
        clock.style.display = 'none';
        return;
    } else {
        clock.style.display = 'block';
    }

    const currentBlock = daySched.find((block) => {
        const startTime = timeStringToMinute(block.startTime);
        const endTime = timeStringToMinute(block.endTime);

        return startTime <= nowMinute && endTime > nowMinute;
    });

    // Find next block
    let nextBlock = undefined;
    for (let i = 0; i < daySched.length; i++) {
        const block = daySched[i];

        const startTime = timeStringToMinute(block.startTime);

        if (startTime > nowMinute) {
            nextBlock = block;
            break;
        }
    }

    if (currentBlock) {
        clock.querySelector('#clock-block').innerText =
            formatBlockName(currentBlock);

        clock.querySelector('#clock-block-time').innerText = `(${convertTime(
            currentBlock.startTime,
            UserSettings.use24h,
        )}-${convertTime(currentBlock.endTime, UserSettings.use24h)})`;

        const minDiff = timeStringToMinute(currentBlock.endTime) - nowMinute;
        const minutesWord = minDiff === 1 ? 'minute' : 'minutes';

        clock.querySelector(
            '#clock-block-remaining',
        ).innerText = `${minDiff} ${minutesWord} remaining in block`;
    } else {
        clock.querySelector('#clock-block-time').innerText = '';

        if (nextBlock) {
            clock.querySelector('#clock-block').innerText = 'Passing Time';

            const minDiff = timeStringToMinute(nextBlock.startTime) - nowMinute;
            const minutesWord = minDiff === 1 ? 'minute' : 'minutes';

            clock.querySelector(
                '#clock-block-remaining',
            ).innerText = `${minDiff} ${minutesWord} until ${formatBlockName(
                nextBlock,
            )}`;
        }
    }

    // Lunches
    if (currentBlock === undefined || currentBlock.lunch.length === 0) {
        clock.querySelector('#clock-lunch').style.display = 'none';
        return;
    } else {
        clock.querySelector('#clock-lunch').style.display = 'block';
    }

    const activeLunchBlock = currentBlock.lunch.find((block) => {
        const startTime = timeStringToMinute(block.startTime);
        const endTime = timeStringToMinute(block.endTime);

        return startTime <= nowMinute && endTime > nowMinute;
    });

    if (activeLunchBlock) {
        clock.querySelector(
            '#clock-lunch-name',
        ).innerText = `${activeLunchBlock.name} Lunch`;

        clock.querySelector('#clock-lunch-time').innerText = `(${convertTime(
            activeLunchBlock.startTime,
            UserSettings.use24h,
        )}-${convertTime(activeLunchBlock.endTime, UserSettings.use24h)})`;

        const minDiff =
            timeStringToMinute(activeLunchBlock.endTime) - nowMinute;
        const minutesWord = minDiff === 1 ? 'minute' : 'minutes';

        clock.querySelector(
            '#clock-lunch-remaining',
        ).innerText = `${minDiff} ${minutesWord} remaining in lunch`;
    } else {
        const nextLunchBlock = currentBlock.lunch.find((block) => {
            const startTime = timeStringToMinute(block.startTime);

            return startTime > nowMinute;
        });

        clock.querySelector('#clock-lunch-time').innerText = '';

        if (nextLunchBlock) {
            clock.querySelector(
                '#clock-lunch-name',
            ).innerText = `Between lunches`;

            const minDiff =
                timeStringToMinute(nextLunchBlock.startTime) - nowMinute;
            const minutesWord = minDiff === 1 ? 'minute' : 'minutes';

            clock.querySelector(
                '#clock-lunch-remaining',
            ).innerText = `${minDiff} ${minutesWord} until ${nextLunchBlock.name} Lunch`;
        }
    }
}

updateClock();
setInterval(updateClock, 15 * 1000);
