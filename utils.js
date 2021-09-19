function timeStringToMinute(timeString) {
    const [hour, minute] = timeString.split(':');

    if (hour && minute) {
        const parsedHour = parseInt(hour, 10);
        const parsedMinute = parseInt(minute, 10);

        if (!Number.isNaN(parsedHour) && !Number.isNaN(parsedMinute)) {
            // Account for PM (there are no classes before 8 am or after 8 pm)
            // if (parsedHour < 8) parsedHour += 12;

            let minute = 0;
            minute += parsedHour * 60;
            minute += parsedMinute;

            return minute;
        }
        return 0;
    }
    return 0;
}

function convertTime(timeString, use24h) {
    if (use24h) {
        return timeString;
    }

    const [hour, minute] = timeString.split(':');

    if (hour && minute) {
        let parsedHour = parseInt(hour, 10);

        if (!Number.isNaN(parsedHour)) {
            parsedHour %= 12;
            if (parsedHour === 0) parsedHour = 12;
            return `${parsedHour}:${minute}`;
        }
        return '00:00';
    }
    return '00:00';
}

function drawWrappedText(ctx, text, x, y, lineHeight, maxWidth) {
    let lines = 0;
    let remainingText = text;

    const hyphenWidth = ctx.measureText('-').width;

    while (remainingText.length > 0) {
        let lineBuffer = '';

        let lineFull = false;

        let lastSpaceIndex = -1;
        for (let i = 0; i < remainingText.length; i += 1) {
            if (remainingText[i] === ' ') {
                lastSpaceIndex = i;
            }

            const newLineBuffer = lineBuffer + remainingText[i];
            const textWidth = ctx.measureText(newLineBuffer).width;
            if (textWidth > maxWidth) {
                const bufferToLastSpace = lineBuffer.substring(
                    0,
                    lastSpaceIndex,
                );
                const bufferToLastSpaceWidth =
                    ctx.measureText(bufferToLastSpace).width;
                // There are no spaces in this line, so cut it off
                // If cutting off at last space makes line too short, don't waste the space
                if (
                    lastSpaceIndex === -1 ||
                    bufferToLastSpaceWidth < maxWidth / 2
                ) {
                    let lastCharCutForHyphen = i;
                    while (
                        ctx.measureText(
                            remainingText.substring(0, lastCharCutForHyphen) +
                                '-',
                        ).width > maxWidth
                    ) {
                        lastCharCutForHyphen -= 1;
                    }

                    lineBuffer =
                        remainingText.substring(0, lastCharCutForHyphen) + '-';
                    remainingText =
                        remainingText.substring(lastCharCutForHyphen);
                } else {
                    lineBuffer = bufferToLastSpace;
                    remainingText = remainingText.substring(lastSpaceIndex + 1);
                }
                lineFull = true;
                break;
            } else {
                lineBuffer = newLineBuffer;
            }
        }

        if (!lineFull) {
            remainingText = '';
        }
        ctx.fillText(lineBuffer, x, y + lineHeight * lines);
        lines += 1;
    }

    return lines;
}

function drawDiagRect(ctx, x, y, width, height, diagDistance) {
    ctx.lineCap = 'round';

    const semip = width + height;

    for (let i = 0; true; i += 1) {
        if (diagDistance * (i + 1) > semip) {
            break;
        }
        ctx.beginPath();
        ctx.moveTo(
            y + diagDistance * (i + 1) > y + height
                ? x + (diagDistance * (i + 1) - height)
                : x,
            Math.min(y + height, y + diagDistance * (i + 1)),
        );
        ctx.lineTo(
            Math.min(x + width, x + diagDistance * (i + 1)),
            x + diagDistance * (i + 1) > x + width
                ? y + (diagDistance * (i + 1) - width)
                : y,
        );
        ctx.stroke();
    }
}

function canvasToBase64() {
    const canvas = document.querySelector('#canvas');
    return canvas.toDataURL('image/png');
}

function saveBase64(base64, fileName) {
    var link = document.createElement('a');

    document.body.appendChild(link); // for Firefox

    link.setAttribute('href', base64);
    link.setAttribute('download', fileName);
    link.click();
}

function shareBase64(base64, fileName) {
    const file = new File([base64], fileName, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator
            .share({ files: [file] })
            .then(() => console.log('Share was successful.'))
            .catch((error) => console.log('Sharing failed', error));
    } else {
        console.log(`Your system doesn't support sharing files.`);
    }
}

function printBase64(base64) {
    printJS(base64, 'image');
}
