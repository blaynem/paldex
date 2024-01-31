var fs = require("fs");

const fileNames= fs.readdirSync("./in_game_icons");
var strings = fileNames.map( file => {
    let name = file.split("_");
    name = name.slice(2).join("_").split(".")[0].toLowerCase();
    return `${name} : require('./${file}')`
});

const string = "const inGameIcons = {\n" + strings.join(",\n") + "\n}\n\nexport default inGameIcons;";

fs.writeFileSync("./in_game_icons/index.ts",string);