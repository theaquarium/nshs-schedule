const canvas = document.getElementById('canvas-raw');
const canvasPaste = document.getElementById('canvas-paste');
const canvasClone = document.getElementById('canvas-clone');
const ctx = canvas.getContext('2d');
const pasteCtx = canvasPaste.getContext('2d');

const CanvasSizes = {
    letter: {
        width: 2550,
        height: 3300,

        leftMargin: 100,
        topMargin: 100,

        pasteWidth: 2350,
        pasteHeight: 3100,
    },
    iphone: {
        width: 1290,
        height: 2796,

        leftMargin: 92.5,
        topMargin: 838,

        pasteWidth: 1105,
        pasteHeight: 1430,
    },
    square: {
        width: 3300,
        height: 3300,

        leftMargin: 475,
        topMargin: 100,

        pasteWidth: 2350,
        pasteHeight: 3100,
    },
    oversized: {
        width: 3528 / 2.5,
        height: 8232 / 2.5,

        leftMargin: 589 / 2.5,
        topMargin: 2566 / 2.5,

        pasteWidth: 2350 / 2.5,
        pasteHeight: 3100 / 2.5,
    },
};

let SelectedSize = isMobile() ? 'iphone' : 'letter';

function copyCanvasToImg() {
    const base64 = canvasToBase64();
    canvasClone.src = base64;
}

function copyCanvasWithFormat() {
    const format = CanvasSizes[SelectedSize];
    canvasPaste.width = format.width;
    canvasPaste.height = format.height;

    pasteCtx.fillStyle = 'white';
    pasteCtx.fillRect(0, 0, format.width, format.height);

    pasteCtx.drawImage(
        canvas,
        format.leftMargin - 100,
        format.topMargin - 100,
        format.pasteWidth + 200,
        format.pasteHeight + 200,
    );
}

function drawRaw() {
    const ppi = 300;

    // this edgeborder stuff is legacy stuff before the canvas format system was introduced
    const edgeBorder = 100;
    const canvasWidth = 8.5 * ppi;
    const canvasHeight = 11 * ppi;

    const titleHeight = (1 / 2) * ppi;
    const weekdayHeight = (1 / 3) * ppi;
    const lunchBlocksWidth = (1 / 2) * ppi;

    canvas.height = canvasHeight;
    canvas.width = canvasWidth;

    function minuteToHeight(minute) {
        const startMin = 9 * 60;
        const endMin = 15 * 60 + 45;
        const minuteDiff = minute - 9 * 60; // Minutes since 9 am

        const startPixel = edgeBorder + titleHeight + weekdayHeight;
        const endPixel = canvasHeight - edgeBorder;
        const dayRatio = minuteDiff / (endMin - startMin);
        return startPixel + dayRatio * (endPixel - startPixel);
    }

    ctx.lineWidth = 10;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.strokeRect(
        edgeBorder,
        edgeBorder,
        canvasWidth - edgeBorder * 2,
        titleHeight,
    );

    ctx.fillStyle = 'black';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = 'bold 80px Helvetica';

    ctx.fillText(
        UserSettings.title.length > 0 ? UserSettings.title : 'Your Schedule',
        canvasWidth / 2,
        edgeBorder + titleHeight / 2 - 12,
    );

    ctx.font = 'bold 40px Helvetica';

    ctx.fillText(
        UserSettings.affirmation,
        canvasWidth / 2,
        edgeBorder + titleHeight / 2 + 42,
    );

    const columnWidth = (canvasWidth - 2 * edgeBorder) / 5;

    // Start and end lines
    ctx.beginPath();
    ctx.moveTo(edgeBorder, edgeBorder + titleHeight);
    ctx.lineTo(edgeBorder, canvasHeight - edgeBorder);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth - edgeBorder, edgeBorder + titleHeight);
    ctx.lineTo(canvasWidth - edgeBorder, canvasHeight - edgeBorder);
    ctx.closePath();
    ctx.stroke();

    for (let dayNum = 0; dayNum < Schedule.length; dayNum += 1) {
        const day = Schedule[dayNum];

        if (dayNum !== 0) {
            ctx.beginPath();
            ctx.moveTo(
                edgeBorder + columnWidth * dayNum,
                edgeBorder + titleHeight,
            );
            ctx.lineTo(
                edgeBorder + columnWidth * dayNum,
                canvasHeight - edgeBorder,
            );
            ctx.closePath();
            ctx.stroke();
        }

        ctx.strokeRect(
            edgeBorder + columnWidth * dayNum,
            edgeBorder + titleHeight,
            columnWidth,
            weekdayHeight,
        );

        ctx.fillStyle = 'black';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.font = 'bold 60px Helvetica';

        ctx.fillText(
            day.dayName,
            edgeBorder + columnWidth * dayNum + columnWidth / 2,
            edgeBorder + titleHeight + weekdayHeight / 2 + 6,
        );

        for (let blockNum = 0; blockNum < day.blocks.length; blockNum += 1) {
            const block = day.blocks[blockNum];
            const thisBlockSettings =
                BlockSettings[
                    `${block.block}${
                        block.block === 'Lion' ||
                        block.block === 'Advisory' ||
                        block.block === 'WIN'
                            ? ''
                            : block.number
                    }`
                ];

            const startPixel = minuteToHeight(
                timeStringToMinute(block.startTime),
            );
            const endPixel = minuteToHeight(timeStringToMinute(block.endTime));

            if (UserSettings.useColors) {
                ctx.fillStyle = Colors[thisBlockSettings.color];
                ctx.fillRect(
                    edgeBorder + columnWidth * dayNum,
                    startPixel,
                    columnWidth,
                    endPixel - startPixel,
                );
            }

            ctx.strokeRect(
                edgeBorder + columnWidth * dayNum,
                startPixel,
                columnWidth,
                endPixel - startPixel,
            );

            // Advisory
            if (block.block === 'Advisory') {
                // Block name
                ctx.fillStyle = 'black';
                ctx.textBaseline = 'top';
                ctx.textAlign = 'left';
                ctx.font = 'bold 50px Helvetica';

                ctx.fillText(
                    `${block.block}`,
                    edgeBorder + columnWidth * dayNum + 20,
                    startPixel + 20 + 5,
                );
                const bNameWidth = ctx.measureText(`${block.block}`).width;

                // Block Length
                ctx.font = '40px Helvetica';

                if (UserSettings.showTimes) {
                    ctx.fillText(
                        `(${block.length})`,
                        edgeBorder + columnWidth * dayNum + bNameWidth + 30,
                        startPixel + 20 + 3 + 4,
                    );
                }

                // Block time
                ctx.fillStyle = 'black';
                ctx.textBaseline = 'top';
                ctx.textAlign = 'left';
                ctx.font = '45px Helvetica';

                ctx.fillText(
                    `${convertTime(
                        block.startTime,
                        UserSettings.use24h,
                    )}-${convertTime(block.endTime, UserSettings.use24h)}`,
                    edgeBorder + columnWidth * dayNum + 20,
                    startPixel + 20 + 5 + 52,
                );

                // Room Number
                ctx.fillStyle = 'black';
                ctx.textBaseline = 'top';
                ctx.textAlign = 'right';
                ctx.font = 'bold 45px Helvetica';

                ctx.fillText(
                    `${BlockSettings['Advisory'].room}`,
                    edgeBorder + columnWidth * dayNum + columnWidth - 20,
                    startPixel + 25,
                );
            } else {
                // Block Name
                ctx.fillStyle = 'black';
                ctx.textBaseline = 'top';
                ctx.textAlign = 'left';
                ctx.font = 'bold 100px Helvetica';

                ctx.fillText(
                    `${
                        // If they go to north, it's called a tiger block
                        block.block === 'Lion' && UserSettings.north
                            ? 'Tiger'
                            : block.block
                    }${
                        block.block === 'Lion' || !UserSettings.showNumbers
                            ? ''
                            : block.number
                    }`,
                    edgeBorder + columnWidth * dayNum + 20,
                    startPixel + 20 + 10,
                );

                const bNameWidth = ctx.measureText(
                    `${
                        // If they go to north, it's called a tiger block
                        block.block === 'Lion' && UserSettings.north
                            ? 'Tiger'
                            : block.block
                    }${
                        block.block === 'Lion' || !UserSettings.showNumbers
                            ? ''
                            : block.number
                    }`,
                ).width;

                // Block length
                ctx.font = '60px Helvetica';

                if (UserSettings.showTimes) {
                    ctx.fillText(
                        `(${block.length})`,
                        edgeBorder + columnWidth * dayNum + bNameWidth + 30,
                        startPixel + 20 + 5 + 6,
                    );
                }

                // Block times
                ctx.fillStyle = 'black';
                ctx.textBaseline = 'top';
                ctx.textAlign = 'left';
                ctx.font = '50px Helvetica';

                ctx.fillText(
                    `${convertTime(
                        block.startTime,
                        UserSettings.use24h,
                    )}-${convertTime(block.endTime, UserSettings.use24h)}`,
                    edgeBorder + columnWidth * dayNum + 20,
                    startPixel + 20 + 10 + 100,
                );

                // Block info
                if (
                    block.block !== 'Lion' &&
                    block.block !== 'WIN' &&
                    thisBlockSettings.hasClass
                ) {
                    // Determine maximum line width
                    const maxWidth =
                        block.lunch.length > 0
                            ? columnWidth - 40 - lunchBlocksWidth
                            : columnWidth - 40;

                    // Class type
                    ctx.fillStyle = 'black';
                    ctx.textBaseline = 'top';
                    ctx.textAlign = 'left';
                    ctx.font = 'bold 50px Helvetica';

                    const classNameLines =
                        thisBlockSettings.class.length > 0
                            ? drawWrappedText(
                                  ctx,
                                  `${thisBlockSettings.class}`,
                                  edgeBorder + columnWidth * dayNum + 20,
                                  startPixel + 20 + 10 + 100 + 80,
                                  60,
                                  maxWidth,
                              )
                            : 0;

                    // Room number
                    ctx.font = '50px Helvetica';
                    const roomNumLines =
                        thisBlockSettings.room.length > 0
                            ? drawWrappedText(
                                  ctx,
                                  `Room ${thisBlockSettings.room}`,
                                  edgeBorder + columnWidth * dayNum + 20,
                                  startPixel +
                                      20 +
                                      10 +
                                      100 +
                                      80 +
                                      60 * classNameLines,
                                  60,
                                  maxWidth,
                              )
                            : 0;

                    // Teacher
                    drawWrappedText(
                        ctx,
                        `${thisBlockSettings.teacher}`,
                        edgeBorder + columnWidth * dayNum + 20,
                        startPixel +
                            20 +
                            10 +
                            100 +
                            80 +
                            60 * (classNameLines + roomNumLines),
                        60,
                        maxWidth,
                    );
                } else if (block.block !== 'Lion' && block.block !== 'WIN') {
                    // It's a free block!
                    ctx.fillStyle = 'black';
                    ctx.textBaseline = 'top';
                    ctx.textAlign = 'left';
                    ctx.font = 'bold 60px Helvetica';

                    ctx.fillText(
                        `Free`,
                        edgeBorder + columnWidth * dayNum + 20,
                        startPixel + 20 + 10 + 100 + 80,
                    );
                }

                // Lunches
                if (block.lunch.length > 0) {
                    ctx.beginPath();
                    ctx.moveTo(
                        edgeBorder +
                            columnWidth * dayNum +
                            (columnWidth - lunchBlocksWidth),
                        startPixel,
                    );
                    ctx.lineTo(
                        edgeBorder +
                            columnWidth * dayNum +
                            (columnWidth - lunchBlocksWidth),
                        endPixel,
                    );
                    ctx.closePath();
                    ctx.stroke();

                    for (
                        let lunchNum = 0;
                        lunchNum < block.lunch.length;
                        lunchNum += 1
                    ) {
                        const lunch = block.lunch[lunchNum];

                        const lunchStartPixel = minuteToHeight(
                            timeStringToMinute(lunch.startTime),
                        );
                        const lunchEndPixel = minuteToHeight(
                            timeStringToMinute(lunch.endTime),
                        );

                        if (
                            lunchNum !== thisBlockSettings.lunch &&
                            thisBlockSettings.lunch !== 3
                        ) {
                            // ctx.fillStyle = '#ffffff';
                            // ctx.fillRect(
                            //     edgeBorder +
                            //         columnWidth * dayNum +
                            //         (columnWidth - lunchBlocksWidth),
                            //     lunchStartPixel,
                            //     lunchBlocksWidth,
                            //     lunchEndPixel - lunchStartPixel,
                            // );

                            ctx.strokeStyle = '#00000055';
                            drawDiagRect(
                                ctx,
                                edgeBorder +
                                    columnWidth * dayNum +
                                    (columnWidth - lunchBlocksWidth),
                                lunchStartPixel,
                                lunchBlocksWidth,
                                lunchEndPixel - lunchStartPixel,
                                60,
                            );
                            ctx.strokeStyle = '#000000';
                        }

                        ctx.strokeRect(
                            edgeBorder +
                                columnWidth * dayNum +
                                (columnWidth - lunchBlocksWidth),
                            lunchStartPixel,
                            lunchBlocksWidth,
                            lunchEndPixel - lunchStartPixel,
                        );

                        ctx.fillStyle = 'black';
                        ctx.textBaseline = 'top';
                        ctx.textAlign = 'left';
                        ctx.font = 'bold 45px Helvetica';

                        ctx.fillText(
                            `${lunch.name}`,
                            edgeBorder +
                                columnWidth * dayNum +
                                (columnWidth - lunchBlocksWidth) +
                                20,
                            lunchStartPixel + 28,
                        );

                        ctx.font = '40px Helvetica';

                        ctx.fillText(
                            `${convertTime(
                                lunch.startTime,
                                UserSettings.use24h,
                            )}-`,
                            edgeBorder +
                                columnWidth * dayNum +
                                (columnWidth - lunchBlocksWidth) +
                                15,
                            lunchStartPixel + 30 + 60,
                        );
                        ctx.fillText(
                            `${convertTime(
                                lunch.endTime,
                                UserSettings.use24h,
                            )}`,
                            edgeBorder +
                                columnWidth * dayNum +
                                (columnWidth - lunchBlocksWidth) +
                                15,
                            lunchStartPixel + 30 + 60 + 50,
                        );
                    }
                }
            }
        }
    }

    ctx.fillStyle = 'black';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.font = 'bold 45px Helvetica';

    const footnoteOffsetY = 22;
    const footnoteOffsetX = 67;

    ctx.fillText(
        `Made with`,
        edgeBorder + columnWidth * 1 + footnoteOffsetX,
        canvasHeight - 220 + footnoteOffsetY,
    );

    const madeWithLength = ctx.measureText('Made with').width;

    ctx.fillStyle = 'red';
    ctx.font = 'bold 50px Helvetica';

    ctx.fillText(
        `❤️`,
        edgeBorder + columnWidth * 1 + 10 + footnoteOffsetX + madeWithLength,
        canvasHeight - 222 + footnoteOffsetY,
    );

    ctx.fillStyle = 'black';
    ctx.font = 'bold 45px Helvetica';

    ctx.fillText(
        `using nshs.site`,
        edgeBorder + columnWidth * 1 + footnoteOffsetX,
        canvasHeight - 170 + footnoteOffsetY,
    );

    copyCanvasWithFormat();
    copyCanvasToImg();
}

// Initial draw! + debounce
const debounceInterval = 250;
let timeout = setTimeout(drawRaw, debounceInterval);

function draw() {
    clearTimeout(timeout);
    timeout = setTimeout(drawRaw, debounceInterval);
}
