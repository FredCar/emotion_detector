import React from "react";

const BestResult = ({bestResult}) => {
    console.log("BestResult", bestResult)
    let emoji = ""

    switch (bestResult) {
        case "amour":
            emoji = "emoji_love.png"
            break
        case "colère":
            emoji = "emoji_anger.png"
            break
        case "joie":
            emoji = "emoji_joy.png"
            break
        case "peur":
            emoji = "emoji_fear.png"
            break
        case "surprise":
            emoji = "emoji_surprise.png"
            break
        case "tristesse":
            emoji = "emoji_sadness.png"
            break
        default:
            break

    }
    return (
        <>
            <img src={`images/${emoji}`} alt={emoji}  />
        </>
    )
}

const Result = ((props) => {
    const data = JSON.parse(sessionStorage.getItem("data"))
    // data["all_results"] = JSON.parse(data["all_results"])

    // console.log("data", typeof data["all_results"])

    for (const res in data["all_results"]) {
        console.log("res", res, data["all_results"][res])
    }


    return (
        <>
            <BestResult bestResult={data["best_result"]}/>
            <br />
            <h2>{data["best_result"]}</h2>
            <h2>{data["original_text"]}</h2>
            <h2>{data["translated_text"]}</h2>
            <h2>{data["sents"]}</h2>
            {/* {data["all_results"].forEach((key) => {
                return (<h4>{key}</h4>)
            })} */}
            <p>{data["all_results"]["amour"]}</p>
        </>
    )
})

export default Result;