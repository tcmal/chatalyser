import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const minutesFormat = secs => (Math.round(secs / 60).toString().padStart(2, '0')) + ":" + (secs % 60).toString().padStart(2, '0');

const trinaryGradient = (a, b, c, v) => {
    console.log(v);
    if (v < 0) {
        return a.map((x,i) => {
            let diff = b[i] - x;
            return x + Math.round(diff * (1 - Math.abs(v)));
        });
    } else if (v > 0) {
        return b.map((x,i) => {
            let diff = c[i] - x;
            return x + Math.round(diff * v);
        });
    } else {
        return b;
    }
}
const toHex = ([r,g,b]) => {
    return "#" + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
};

const VideoDisplay = ({ title, url }) => (
    <div>
        <h1 className="videoTitle">{title}</h1>
        <a href={url} className="btn videoLink" target="_blank">View on twitch</a>
    </div>
);

const MagnitudeGraph = (props) => {
    const input = props.data;
    const data = React.useMemo(
        () => Object.keys(input).map(k => ({
            "Time": k,
            "Average": (input[k].sum / input[k].count).toPrecision(2),
            "Count": input[k].count
        })),
        []
    );

    const series = React.useMemo(
        () => ({
            type: 'bar'
        }),
        []
    );
    const axes = React.useMemo(
        () => [
            { primary: true, type: 'linear', position: 'bottom' },
            { type: 'linear', position: 'left' }
        ],
        []
    );

    return (
        <div className="chartContainer">
            <ResponsiveBar data={data}
                keys={['Average']}
                minValue={-1}
                colors={d => toHex(trinaryGradient([255, 0, 0], [0, 0, 0], [0, 255, 0], d.data.Average))}
                maxValue={1}
                indexBy="Time"
                enableLabel={false}
                tooltip={({ data }) => minutesFormat(data.Time) + " - " + data.Average + " (" + data.Count + " messages)"}
                />
        </div>

    );
}

export default ({ data }) => (
    <div>
        <VideoDisplay {...data.video} />
        <MagnitudeGraph data={data.magnitudeAvgs}/>
        <p>
            Above the y axis is positive, Below is negative.
            The bigger the bar, the stronger the emotion.
            Not all messages are used.
        </p>
    </div>
);