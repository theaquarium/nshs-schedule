import React from 'react';

import { useRouteMatch } from 'react-router-dom';
import { useAppState } from '../../state/AppStateContext';
import { useSettings } from '../../state/SettingsContext';
import { ScheduleCard } from './ScheduleCard';

import { getWeek, getDay } from '../../schedule';
import { weekdayNameToNum, weekdayNumToName } from '../../utils';
import { FlexScheduleCard } from './FlexScheduleCard';

export function ScheduleCards() {
    const appState = useAppState();
    const settings = useSettings();

    const routeMatch = useRouteMatch<{ weeknum: string; weekday: string }>(
        '/:weeknum/:weekday',
    );

    const routeMatchNoWeekNum = useRouteMatch<{ weekday: string }>('/:weekday');

    let weeknum = 0;
    let weekday: number | undefined = 1;
    if (appState.value.useAlternatingWeeks) {
        weekday = weekdayNameToNum(routeMatch?.params?.weekday);
        weeknum = routeMatch?.params?.weeknum === 'w1' ? 0 : 1;
    } else {
        weekday = weekdayNameToNum(routeMatchNoWeekNum?.params?.weekday);
    }

    const scheduleWeek = getWeek(
        weeknum,
        appState.value.isMCASTime,
        appState.value.yearWeekNumber,
    );
    const day = getDay(scheduleWeek, weekday);

    if (!day) {
        return <h1 className="title has-text-centered">No classes today.</h1>;
    }

    // Don't render blocks as past if it's not on today's page
    let isPast =
        appState.value.hasSchoolToday === true &&
        weekday === appState.value.weekday &&
        (appState.value.useAlternatingWeeks === false ||
            weeknum === appState.value.weekNum);

    const cards = day.map((block) => {
        let blockSettings = settings.value.blockSettings[block.blockType];

        // Set block settings to default just in case settings are corrupted
        if (blockSettings === undefined) blockSettings = { hasClass: true };

        if (
            block.blockType === appState.value.activeBlock ||
            block.blockType === appState.value.nextBlock
        ) {
            isPast = false;
        }

        const dayName = weekdayNumToName(weekday);
        const inPerson = appState.value.useAlternatingWeeks
            ? settings.value.inPerson &&
              appState.value.weekNum !== undefined &&
              dayName !== undefined &&
              settings.value.inPersonDays[appState.value.weekNum]?.[dayName]
            : settings.value.inPerson;
        if (block.blockType === 'flex') {
            return (
                <FlexScheduleCard
                    key={`${weekday}-${block.blockType}-${block.startTime}-${block.endTime}`}
                    block={block}
                    flexSettings={settings.value.flexSettings}
                    isActive={
                        appState.value.hasSchoolToday === true &&
                        block.blockType === appState.value.activeBlock &&
                        weeknum === appState.value.weekNum &&
                        weekday === appState.value.weekday
                    }
                    isPast={isPast}
                    inPerson={inPerson}
                    flexBlockInPersonSettings={
                        settings.value.flexBlockInPersonSettings
                    }
                />
            );
        }

        return (
            <ScheduleCard
                key={`${weekday}-${block.blockType}-${block.startTime}-${block.endTime}`}
                block={block}
                blockSettings={blockSettings}
                isActive={
                    appState.value.hasSchoolToday === true &&
                    block.blockType === appState.value.activeBlock &&
                    (weeknum === appState.value.weekNum ||
                        appState.value.useAlternatingWeeks === false) &&
                    weekday === appState.value.weekday
                }
                activeLunchBlock={
                    // Don't show active lunch block on other days
                    appState.value.hasSchoolToday === true &&
                    weekday === appState.value.weekday
                        ? appState.value.activeLunch
                        : -1
                }
                isPast={isPast}
                inPerson={inPerson}
            />
        );
    });

    return <React.Fragment>{cards}</React.Fragment>;
}
