import React from "react";
import { Pie } from "react-chartjs-2";

const ResultsGraph = ({detailedResults, ...props}) => {
    const labels = []
    for (const res in detailedResults[Object.keys(detailedResults)[0]]) {
        labels.push(res)
    }

    const default_colors = [
        "#ff71ce", // rose - amour
        "#e43553", // rouge - colere
        "#e6c34a", // jaune - joie
        "#420dab", // bleu - peur
        "#008000", // vert - surprise
        "#af826b", // marron - tristesse
    ]

    const data = {
        "amour": 0,
        "colere": 0,
        "joie": 0,
        "peur": 0,
        "surprise": 0,
        "tristesse": 0,
    }
    let label = ""
    let emotions = {}
    let best = 0
    for (const comment in detailedResults) {
        emotions = detailedResults[comment]
        best = 0
        for (const emo in emotions) {
            if (emotions[emo] > best) {
                best = emotions[emo]
                label = emo
            }
        }
        data[label] = data[label] + 1
    }

    return (
        <>
            <div style={{ textAlign: "center" }}>
                <h4>Émotions reconnues dans les avis analysés</h4>
                <Pie
                width={10}
                height={10}
                data={{
                    labels: labels,
                    datasets: [
                    {
                        data: Object.values(data),
                        backgroundColor: default_colors,
                    },
                    ],
                }}
                />
            </div>
        </>
    )
};

export default ResultsGraph;