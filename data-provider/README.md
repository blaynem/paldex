# Data Provider

This is a small tool that generates all the data needed for a PalWorld client.

Note: While we aim to maintain this data and assure its accuracy, we cannot guarantee that it is 100% accurate. If you find any issues, please open an issue or PR. Especially if you can help with localization!

## Todo:

- Assure that any transformers correctly handle the translated data. Thre should be no english value checks in the transformers.
- Find the keys that are mismatched across all non `en` locales and correctly edit the data.

## Folder Structure

- `data-provider` - The main folder for the data provider.
  - `baked-data` - The generated data that can be used by a client.
  - `baked-data/{locale}/errors.json` - Any errors that were encountered while generating the data. Not to be confused with errors for a client to consume.
  - `palworld-assets` - The raw data from Palworld.
  - `src/data` - Used to normalize and generate the data from palworld-assets into maps for easier lookup. Attempts to not morph the data too much.
  - `src/localization` - Similar to data, though for getting the specific localized strings.
  - `src/transformers` - Combines the built data and localization into usable data for clients.
  - `generate-data.ts` - The script that generates the data.

## How do I fix the errors in {locale}/errors.json?

Typically most of the errors are due to the data being malformed. This can be due to a few reasons:

- Keys are incorrect. Some examples would be:
  - `Drillgame` should be `DrillGame` or `BOSS_Anubis` should be `BossAnubis`
  - `GrapplingGun` should be `GrapplingGun_1`

## What happens when Palworld updates?

When a new update comes out, you will need to install the update, and unpack the data. See below for instructions on how to do that.

## Where did map_locations come from?!

It's just splitting the [paldex distribution data](/data-provider/palworld-assets/UI/DT_PaldexDistributionData.json) into files per Pal. We need to write a script for it again.

## Generate the data

Typically I generate the baked-data file by running the following command:

```bash
bun run data-provider/generate-data.ts
```

(I'm using bun because running a TS file is always pain.)

It will:

- Convert all the data from the palworld-assets into usable, translated data.
- Write any errors to `data-provider/errors.json`. (Note: This is not foolproof!)

## How to get latest data from Palworld pack files

I followed along inside of the PocketPair #palworld-modding channel in order to unpack the game data. I did a mix of both of Thing 1 / Thing 2. They both have similar steps, i'm just copy pasting and will edit them at a later date for more readability.

### Thing 1

Modding setup so far:

- Download https://github.com/UE4SS-RE/RE-UE4SS/releases/download/v2.5.2/UE4SS_Xinput_v2.5.2.zip

- Extract Mods, UE4SS-settings.ini, and xinput1\*3.dll to ...\Steam\steamapps\common\Palworld\Pal\Binaries\Win64

- Edit UE4SS-settings.ini and change GuiConsoleVisible to 1 (optional, enables the UE4SS console)

- Create directory UE4SS_Signatures in the Pal\Binaries\Win64 directory

- Add FName_Constructor.lua from https://gist.github.com/DRayX/2079b1398a4c0bd4271dea544f23043a to UE4SS_Signatures

- Dumping headers (CXX or UHT) can be useful to explore constants (found in the Pal\*\* CXX headers or Pal UHT header directory)

### Thing 2

Procedure to check the contents of a pak file in FModel

1. install Unreal Engine 4/5 Scripting System
   <https://github.com/UE4SS-RE/RE-UE4SS>

2. modify the configuration file as follows

```ini
[Debug]
ConsoleEnabled = 0
GuiConsoleEnabled = 1
GuiConsoleVisible = 1
```

`ConsoleEnabled` can be 0 or 1.

3. launch the game

4. output mapping file (image 1)
   Output `.usmap` from the `Dumper` tab of the `UE4SS Debugging Tool`.
   How the file is output.
   `Palworld(Game Folder Root)\Pal\Binaries\Win64\Mappings.usmap`.

At this point, the work on the game side is finished and you may exit the game. 5.

5. install FModel
   <https://github.com/4sval/FModel>

6. add reference settings for pal world in FModel (image 2)

7. add reference settings for mapping file in FModel (image 3)
   Specify the file output in step 4.
   The mapping file may need to be updated when the game version is updated. 8.

8. check any file
   Double-click `.uasset` to see the contents of the file.

- How to find it in the file tree
  Select any `pak` file from `Archives`, select any folder in the `Folders` tab, and search for any file in the `Packages` tab.

- How to search from the whole
  Select `Search` from the top menu `Packages` and enter any string to search.
