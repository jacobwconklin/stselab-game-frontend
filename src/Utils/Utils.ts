// Useful reusable functions
export const getArchitectureCommonName = (architecture: string) => {
    if (architecture === "h") { 
        return "Entire hole"
    } else if (architecture === "ds") {
        return "Drive and Short"
    } else if (architecture === "lp") {
        return "Long and Putt"
    } else if (architecture === "dap") {
        return "Drive, Fairway, and Putt"
    }
    else return "Unknown Architecture"
}

// Scores the results of a round in the tournament (TODO will probably store score in db)
// @param customPerfomance is a percent (between 0 and 1) of the score that is associated with shots.
// 1 - customPerformance is the percent associated with cost
export const scoreRound = (round: number, shots: number, cost: number, customPerformance?: number) => {
    if (round === 6) {
        // On round 6 best performance is rewarded no matter the cost
        // 5 shots is perfect (and impossible) = score of 100
        // 50 shots is overly bad = score of 0 (highest I got was 41)
        // TODO can obviously improve these if I nail down the ranges of shots
         if (shots > 50) {
            return 0;
        } else {
            return (45 - shots - 5) * (100 / 45);
        }
    } else if (round === 7) {
        // On round 7 minimum cost is rewarded as long as the performance is <= 45 strokes (TODO too high for 5 holes)
        // This one may need to not be linear
        // Minimum cost ~ (3 specialists 60 - 90), (3 amateurs = 25), (3 professional ~ 50), 
        // Say Minimum cost is 10 = score of 100
        // Maximum cost is (1 pro, 2 spec got over 100)
        // say Maximum cost is 150 = score of 0
        if (cost > 150) {
            return 0;
        }

        const score = (140 - cost - 10) * (100 / 140); 
        if (shots > 45) {
            // divide score by amount as penalty
            return Math.floor(score / 10);
        } else {
            return score;
        }
    } else if (round === 8) {
        // use reward function to balance cost and shots
        // (will be given )
        // for now use 50 50 split
        if (shots > 50) {
            return ((140 - cost - 10) * (100 / 140)) / 2;
        } else if (cost > 150) {
            return ((45 - shots - 5) * (100 / 45)) / 2;
        } else {
            const shotScore = (45 - shots - 5) * (100 / 45);
            const costScore = (140 - cost - 10) * (100 / 140);
            return (shotScore + costScore) / 2;
        }
    } else if (round === 9 && customPerformance ) {
        // let users define custom reward function
        if (shots > 50) {
            return ((140 - cost - 10) * (100 / 140)) * (1 - customPerformance);
        } else if (cost > 150) {
            return ((45 - shots - 5) * (100 / 45)) * customPerformance;
        } else {
            const shotScore = ((45 - shots - 5) * (100 / 45)) * customPerformance;
            const costScore = ((140 - cost - 10) * (100 / 140)) * (1 - customPerformance);
            return (shotScore + costScore);
        }
    } else {
        console.log("Error invalid round")
        return -1;
    }
}