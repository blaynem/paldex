# What is this folder?

All of this is data extracted from the game itself. All of it needs to be processed so it's usable and minified.

# What other things should we look at in the future?

Other interesting files that we might wanna look at later?

### Content/Pal/DataTable

- Incident - Seems to be about random things that can happen. This might be beneficial to help users determine how to get a monster to spawn.
- Item - ItemLottery file, Status Effect Food file.
- ITemShop - Includes shop things
- Spawner - Includes monster spawn data
- Technology - Not entirely sure, seems to be recipes?
- UI - Includes potential Respawn points and locations for monsters, etc

### Content/Pal/Model/Character/Monster

- Has the actual model for the in game monster.

## Helpful scripts

When we copy over the assets, it will also copy over the .uasset and .uexp files. These are not needed and can be removed with the following command:

```bash
find palworld_assets/ -type f \( -name "*.uasset" -o -name "*.uexp" \) -exec rm -v {} \;
```
