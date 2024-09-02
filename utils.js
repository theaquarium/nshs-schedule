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
    const canvas = document.querySelector('#canvas-paste');
    return canvas.toDataURL('image/png');
}

function saveBase64(base64, fileName) {
    var link = document.createElement('a');

    document.body.appendChild(link); // for Firefox

    link.setAttribute('href', base64);
    link.setAttribute('download', fileName);
    link.click();
}

function shareCanvas(fileName) {
    canvas.toBlob((blob) => {
        const file = new File([blob], fileName, { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator
                .share({ files: [file] })
                .then(() => console.log('Share was successful.'))
                .catch((error) => console.error('Sharing failed', error));
        } else {
            alert(`Your device doesn't support sharing files.`);
        }
    }, 'image/png');
}

function printBase64(base64) {
    printJS({
        printable: base64,
        type: 'image',
        onError: () => {
            alert(`Your device doesn't support printing.`);
        },
    });
}

function isMobile() {
    let check = false;
    (function (a, b) {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
                a,
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4),
            )
        )
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

function formatBlockName(block) {
    if (block.block === 'WIN') {
        return `${block.block}${block.number}`;
    } else if (block.block === 'Advisory' || block.block === 'Lion') {
        return `${block.block}`;
    } else {
        return `${block.block} Block`;
    }
}

function areBlockSettingsSame(block1, block2) {
    return (
        block1.hasClass === block2.hasClass &&
        block1.class === block2.class &&
        block1.room === block2.room &&
        block1.teacher === block2.teacher &&
        block1.lunch === block2.lunch &&
        block1.color === block2.color &&
        block1.customColor === block2.customColor
    );
}
