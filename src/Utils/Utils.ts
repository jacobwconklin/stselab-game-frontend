// Tells other parts of the application if we are in dev mode, could allow for speedier procession through game (such as no min char for reasoning)
export const inDevMode = () => {
    return process.env.NODE_ENV !== 'production';
}

// When updating round numbers do so here to not break application
export enum RoundNames {
    WaitRoom = 0,
    PracticeHArchPro = 1,
    PracticeHArchAmateur = 2,
    PracticeHArchAll = 3,
    Experimental = 4,
    ExperimentalSurvey = 5,
    TournamentStage1 = 6,
    TournamentStage2 = 7,
    TournamentStage3 = 8,
    TournamentStage4 = 9,
    FinalResults = 10,
    ArmExperiment = 11,
    ArmGame1 = 12,
    ArmGame2 = 13,
    ArmGame3 = 14,
    ArmGame4 = 15,
    ArmFinalResults = 16
}

// Gives the round # that should be displayed to the user
export const getDisplayRound = (round: number) => {
    if (round < RoundNames.TournamentStage1) {
        return round;
    } else if (round < RoundNames.FinalResults) {
        return round - RoundNames.TournamentStage1 + 1;
    } else { // if (round < RoundNames.ArmFinalResults) {
        return round - RoundNames.ArmGame1 + 1;
    }
}

// get suffix for ordinal numbers ie 1st 2nd 3rd 4th
// credit: https://stackoverflow.com/a/13627586
export const ordinal_suffix = (i: number) => {
    let j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}

// Saves an object to browser storage. Saves it to both local and session storage under the same key given.
// This is useful so that if a player refreshes their information can be preserved. Session storage is specific
// to each tab, so checking session storage first allows a player to run the game with multiple tabs open. (good for dev and testing)
// local storage persists even after the browser is closed, so if a player closes the browser and reopens it, their information will still be there
// and they can continue in their session even if they accidentally close a tab or their browser. 
export const saveObjectToStorage = (key: string, obj: any) => {
    const objString = JSON.stringify(obj);
    localStorage.setItem(key, objString);
    sessionStorage.setItem(key, objString);
}

// Retreives an object from browser storage, first it checks if it exists in session storage and retreives that
// version. If it doesn't exist, it checks local storage and retreives that version. If neither exists it returns null
export const getObjectFromStorage = (key: string) => {
    const sessionItem = sessionStorage.getItem(key);
    if (sessionItem) {
        return JSON.parse(sessionItem);
    } else {
        const localItem = localStorage.getItem(key);
        if (localItem) {
            return JSON.parse(localItem);
        } else {
            return null;
        }
    }
}

// Clear object from both local and session storage
export const clearObjectFromStorage = (key: string) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
}

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

// adjustable const for tournament stage 2
export const tournamentStage2MaximumShots = 25;

// Scores the results of a round in the tournament 
// @param customPerfomance is a percent (between 0 and 1) of the score that is associated with shots.
// 1 - customPerformance is the percent associated with cost
export const scoreRound = (round: number, shots: number, cost: number, customPerformance?: number | null) => {
    if (round === RoundNames.TournamentStage1) {
        // On round 6 best performance is rewarded no matter the cost
        // 5 shots is perfect (and impossible) = score of 100
        // 50 shots is overly bad = score of 0 (highest I got was 41)
        // TODO can obviously improve these if I nail down the ranges of shots
         if (shots > 50) {
            return 0;
        } else {
            return (55 - shots - 5) * (100 / 55);
        }
    } else if (round === RoundNames.TournamentStage2) {
        // On round 7 minimum cost is rewarded as long as the performance is <= tournamentStage2MaximumShots
        // This one may need to not be linear
        // Minimum cost ~ (3 specialists 60 - 90), (3 amateurs = 25), (3 professional ~ 50), 
        // Say Minimum cost is 0 = score of 100
        // Maximum cost is 150 (1 pro, 2 spec got over 100)
        // say Maximum cost is 150 = score of 0
        if (cost > 150) {
            return 0;
        }

        const score = (150 - cost) * (100 / 150); 
        if (shots > tournamentStage2MaximumShots) {
            // divide score by amount as penalty
            return Math.floor(score / 10);
        } else {
            return score;
        }
    } else if (round === RoundNames.TournamentStage3) {
        // use reward function to balance cost and shots
        // (will be given )
        // for now use 50 50 split
        if (shots > 50) {
            return ((150 - cost) * (100 / 150)) / 2;
        } else if (cost > 150) {
            return ((55 - shots - 5) * (100 / 55)) / 2;
        } else {
            const shotScore = (55 - shots - 5) * (100 / 55);
            const costScore = (150 - cost) * (100 / 150);
            return (shotScore + costScore) / 2;
        }
    } else if (round === RoundNames.TournamentStage4 && customPerformance ) {
        // let users define custom reward function
        if (shots > 50) {
            return ((150 - cost) * (100 / 150)) * (1 - customPerformance);
        } else if (cost > 150) {
            return ((55 - shots - 5) * (100 / 55)) * customPerformance;
        } else {
            const shotScore = ((55 - shots - 5) * (100 / 55)) * customPerformance;
            const costScore = ((150 - cost) * (100 / 150)) * (1 - customPerformance);
            return (shotScore + costScore);
        }
    } else {
        // console.error("Error invalid round")
        return null;
    }
}

// Animate player ball going into the hole
export const animateBallIntoHole = (callBack: () => void) => {
    const ball = document.getElementById("player-ball");
    // calculate start and end pixels based on screen width
    // const startPixels = 0.1 * window.innerWidth - 16;
    // const endPixels = 0.9 * window.innerWidth - 40;
    // const startBottomPixels = 62;
    // const endBottomPixels = 30;
    // let ballBottomPixels = 62;
    // let ballHitDownPixels = 0.5 * window.innerWidth;
    // let ballPosition = startPixels;
    // Uses JS animation:
    // if (ball) ball.style.display = 'block';
    // const animationInterval = setInterval(() => {
    //     if (ballPosition > endPixels) {
    //         // make ball dissapear
    //         if (ball) ball.style.display = 'none';
    //         clearInterval(animationInterval);
    //     } else if (ball) {
    //         ballPosition += 1;
    //         ball.style.left = `${ballPosition}px`;
    //         // go up for 25% of screen
    //         if (ballPosition < window.innerWidth * 0.25) {
    //             ballBottomPixels += 1;
    //             ball.style.bottom = `${ballBottomPixels}px`
    //         } else if (ballPosition < window.innerWidth * 0.28) {
    //             // Do nothing
    //         } else if (ballPosition < window.innerWidth * 0.5) {
    //             // go down for next 25%
    //             ballBottomPixels -= 2;
    //             if (ballBottomPixels < startBottomPixels) {
    //                 ballHitDownPixels = ballPosition;
    //                 ball.style.bottom = `${startBottomPixels}px`
    //             } else {
    //                 ball.style.bottom = `${ballBottomPixels}px`
    //             }
    //         } else {
    //             // go down into hole
    //             ball.style.bottom = `${startBottomPixels - Math.floor(((ballPosition - ballHitDownPixels) / (endPixels - ballHitDownPixels))*(startBottomPixels - endBottomPixels))}px`;
    //         }
    //         ball.style.rotate = `rotate(${360 * ballPosition}deg)`
    //     }
    // }, 1);

    const topPointX = 0.4 * window.innerWidth - (Math.random() * 100);
    const topPointY = 0.5 * window.innerHeight + (Math.random() * 100);
    // const floatPointX = 0.45 * window.innerWidth;
    // const floatPointY = 0.45 * window.innerHeight;
    const hitDownPointX = 0.5 * window.innerWidth;
    const hitDownPointY = 62;
    const inHoleX = 0.9 * window.innerWidth - 40;
    const inHoleY = 30;

    // Use CSS transition: 
    // define movement points and place the ball there after timeout intervals, let css make smooth transition
    if (ball) {
        setTimeout(() => {
            // first move to top point
            ball.style.transition = "all 1s ease-out"; // time to rist to top point
            ball.style.left = topPointX + 'px';
            ball.style.bottom = topPointY + "px";
            ball.style.transform = "rotate(360deg)";
            // setTimeout(() => {
            //     // move to float point
            //     ball.style.transition = "all 0.3s ease-out"; // time at float point 
            //     ball.style.left = floatPointX + 'px';
            //     ball.style.bottom = floatPointY + "px";
            //     ball.style.transform = "rotate(560deg)";
                setTimeout(() => {
                    // move to hitDownPoint 
                    ball.style.transition = "all 0.5s ease-in"; // time falling onto hit point
                    ball.style.left = hitDownPointX + 'px';
                    ball.style.bottom = hitDownPointY + "px";
                    ball.style.transform = "rotate(720deg)";
                    setTimeout(() => {
                        // move to inHolePoint
                        ball.style.transition = "all 1.2s ease-out"; // time to roll into hole  
                        ball.style.left = inHoleX + 'px';
                        ball.style.bottom = inHoleY + "px";
                        ball.style.transform = "rotate(1800deg)"; 
                        setTimeout(() => {
                            ball.style.transition = "all 0.5s ease-out"; // time to fade away ball 
                            ball.style.opacity = "0";
                            setTimeout(() => {
                                callBack();
                            }, 0.5)
                        }, 1200) // time to roll ball into hole 
                    }, 500); // time falling onto hit point
                // }, 300); // time at float point
            }, 1000); // time to rise to top point
        }, 100);
    }
}