var fs = require("fs");

const fileNames= fs.readdirSync(".");
var strings = fileNames.map( file => {
    let name = file.split("_");
    name = name.slice(3).join("_").split(".")[0].toLowerCase();
    return `${name} : require('./${file}')`
});

const string = "const inGameIcons = {\n" + strings.join(",\n") + "\n}\n\nexport default inGameIcons;";

fs.writeFileSync("./index.ts",string);