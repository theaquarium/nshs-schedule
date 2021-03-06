import React, { ChangeEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppState } from '../../state/AppStateContext';

import { useSettings } from '../../state/SettingsContext';
import { InPersonButton } from './InPersonButton';

export function MainSettings() {
    const settings = useSettings();
    const appState = useAppState();
    const history = useHistory();
    const setSettings = settings.setSettings;

    const [state, setState] = React.useState({
        userNickname: settings.value.userNickname,
        showQuotes: settings.value.showQuotes,
        inPerson: settings.value.inPerson,
        showClock: settings.value.showClock,
        use24HourClock: settings.value.use24HourClock,
        theme: settings.value.theme,
        useHttpLinks: settings.value.useHttpLinks,
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const target = event.target;

        const value =
            target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setState({
            ...state,
            [name]: value,
        });
    };

    const saveTimeout = React.useRef<number>();

    React.useEffect(() => {
        window.clearTimeout(saveTimeout.current);

        saveTimeout.current = window.setTimeout(() => {
            setSettings((settings) => {
                return {
                    ...settings,
                    ...state,
                };
            });
        }, 500);
    }, [state, setSettings]);

    return (
        <div>
            <div className="field">
                <label className="label is-medium">
                    What should I call you?
                </label>
                <div className="control">
                    <input
                        className="input is-rounded is-medium"
                        type="text"
                        placeholder="Nickname"
                        name="userNickname"
                        onChange={handleChange}
                        value={state.userNickname}
                    />
                </div>
            </div>
            <br />
            <div className="my-4">
                <span className="is-size-5 mr-3">Color Theme</span>
                <span
                    className={
                        'tag is-medium is-rounded mx-1 ' +
                        (state.theme === 'dark' ? 'is-link' : 'is-dark')
                    }
                    onClick={() => {
                        setState({
                            ...state,
                            theme: 'dark',
                        });
                        // Yeah, this ain't great
                        setTimeout(() => {
                            history.go(0);
                        }, 750);
                    }}
                    style={{
                        cursor: 'pointer',
                    }}
                >
                    Dark
                </span>
                <span
                    className={
                        'tag is-medium is-rounded mx-1 ' +
                        (state.theme === 'light' ? 'is-link' : 'is-dark')
                    }
                    onClick={() => {
                        setState({
                            ...state,
                            theme: 'light',
                        });
                        // Yeah, this ain't great
                        setTimeout(() => {
                            history.go(0);
                        }, 750);
                    }}
                    style={{
                        cursor: 'pointer',
                    }}
                >
                    Light
                </span>
            </div>
            <br />
            <div className="field">
                <input
                    id="useHttpLinksCheckbox"
                    type="checkbox"
                    name="useHttpLinks"
                    className="switch is-normal is-link is-rounded is-medium"
                    title="Are you on a Chromebook or mobile device?"
                    checked={state.useHttpLinks}
                    onChange={handleChange}
                />
                <label htmlFor="useHttpLinksCheckbox">
                    Turn on this option if you are using a Chromebook or a
                    mobile device:
                </label>
            </div>
            <span>
                If you have issues signing into meetings and this option is off,
                try turning it on.
            </span>
            <br />
            <br />
            <div className="field">
                <input
                    id="showQuotesCheckbox"
                    type="checkbox"
                    name="showQuotes"
                    className="switch is-normal is-link is-rounded is-medium"
                    title="Show Motivational Phrases?"
                    checked={state.showQuotes}
                    onChange={handleChange}
                />
                <label htmlFor="showQuotesCheckbox">
                    Show Motivational Phrases?
                </label>
            </div>
            <br />
            <div className="field">
                <input
                    id="showClockCheckbox"
                    type="checkbox"
                    name="showClock"
                    className="switch is-normal is-link is-rounded is-medium"
                    title="Show Clock?"
                    checked={state.showClock}
                    onChange={handleChange}
                />
                <label htmlFor="showClockCheckbox">Show Clock?</label>
            </div>
            {state.showClock ? (
                <div className="px-5 my-5">
                    <div className="field">
                        <input
                            id="use24HourClockCheckbox"
                            type="checkbox"
                            name="use24HourClock"
                            className="switch is-normal is-link is-rounded is-medium"
                            title="Use 24 Hour Time?"
                            checked={state.use24HourClock}
                            onChange={handleChange}
                        />
                        <label htmlFor="use24HourClockCheckbox">
                            Use 24 Hour Time?
                        </label>
                    </div>
                </div>
            ) : null}
            <br />
            <div className="field">
                <input
                    id="inPersonCheckbox"
                    type="checkbox"
                    name="inPerson"
                    className="switch is-normal is-link is-rounded is-medium"
                    title="Show Motivational Phrases?"
                    checked={state.inPerson}
                    onChange={handleChange}
                />
                <label htmlFor="inPersonCheckbox">
                    Do you attend school in person?
                </label>
            </div>
            {state.inPerson && appState.value.useAlternatingWeeks ? (
                <div className="px-5 my-4">
                    <label className="label is-medium mb-2">
                        Which days do you attend in person?
                    </label>
                    <span>Click on a day to activate it.</span>
                    <div className="my-4">
                        <span className="mr-2">Week 1</span>

                        <InPersonButton weekNum={0} weekDay="monday">
                            M
                        </InPersonButton>
                        <InPersonButton weekNum={0} weekDay="tuesday">
                            T
                        </InPersonButton>
                        <InPersonButton weekNum={0} weekDay="wednesday">
                            W
                        </InPersonButton>
                        <InPersonButton weekNum={0} weekDay="thursday">
                            Th
                        </InPersonButton>
                        <InPersonButton weekNum={0} weekDay="friday">
                            F
                        </InPersonButton>
                    </div>
                    <div className="my-2">
                        <span className="mr-2">Week 2</span>

                        <InPersonButton weekNum={1} weekDay="monday">
                            M
                        </InPersonButton>
                        <InPersonButton weekNum={1} weekDay="tuesday">
                            T
                        </InPersonButton>
                        <InPersonButton weekNum={1} weekDay="wednesday">
                            W
                        </InPersonButton>
                        <InPersonButton weekNum={1} weekDay="thursday">
                            Th
                        </InPersonButton>
                        <InPersonButton weekNum={1} weekDay="friday">
                            F
                        </InPersonButton>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
