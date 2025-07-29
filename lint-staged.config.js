const path = require("path");

module.exports = {
    // this will check Typescript files
    "**/*.(ts|tsx)": () => "yarn tsc --noEmit",

    // This will lint and format TypeScript and JavaScript files
    "**/*.(ts|tsx|js)": filenames => {
        const escapedFilenames = filenames
            .map(f => `"${path.resolve(f)}"`)
            .join(" ");
        return [
            `yarn eslint --fix ${escapedFilenames}`,
            `yarn prettier --write ${escapedFilenames}`,
        ];
    },

    // this will Format MarkDown and JSON
    "**/*.(md|json)": filenames => {
        const escapedFilenames = filenames
            .map(f => `"${path.resolve(f)}"`)
            .join(" ");
        return `yarn prettier --write ${escapedFilenames}`;
    },
};
