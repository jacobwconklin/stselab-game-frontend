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