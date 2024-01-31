Before Deploy to store:

- Need icon
- Need splash screens
- fill out more info in app.json (we might not want to alter app.json, look that up for expo first)

- start writing the Reddit post so that’s it’s ready when you are
- Just simple guerilla marketing. Post on youtube comments all over, reddit, find any game forums you can.

Stetch Goals of things we want:

- We need to implement something to read out the descriptions with the click of a button.
  - But in the voice of the original Pokedex.
  - Then we use that as our promotional video.
- We should only include the images / icons we need from the assets. They're quite large!
- Create a discord or reddit link where people can make suggestions to the app.
- Recipes for items
  - Data is there, just needs to be added.
- Add related technology to the pal page
  - Data is there, just needs to be added
- Filters on Pal list page
  - Work Suitability - Should allow for tier 1-4 for each
  - Elements
- "Needs 10 catches" - could be beneficial for users of the app, since you get more xp when you catch 10.
- Localization for supported languages.
- Map leveling zones: https://www.reddit.com/media?url=https%3A%2F%2Fi.redd.it%2Fkolujt1c1oec1.png
- Write a script to generate all the correct typings.
- Elements strong against - https://www.reddit.com/media?url=https%3A%2F%2Fi.redd.it%2F76zwfgq9omec1.jpeg
  - It seems to only take your first type if there are multiples.
  - Maybe a highlight around the spell that your Pal is, because that includes a STAB bonus.
- Map locations for things

- Other feature requests from reddit thread:
  - Not sure if it's easy to add, but maybe an asterisk or something under Gumoss. Females drop beautiful flower, which you need to build flower beds in the base.
  - Other things I'd love to see include run/glide/flying speeds, stamina, and rank up effects on partner skills. Not holding my breath though since that information isn't available anywhere else either.
  - Please add the level at which you unlock their associated technology (gun, saddle, launcher, etc.)
    - more info: Maybe? In the menu, under technology, I would love to know at what level you unlock the technology related to that Pal. Example; for Ralaxaurus Lux, it would be stellar if you could add a line under the “Drops:” section a bit like: Technology: Weapon (Lv. 46)
    - This line would let you know when you could unlock their tech. and what it did (saddle, glider, flight, weapon)
  - Not sure if this was mentioned already, but the ability to hide/show pal icons would be great. I'm really enjoying the moment of seeing a pal for the first time so I'm hesitant to use anything that has their icon. There's an app on android, "dataDex" for Pokémon, that works this way. You can show/hide all icons easily and then tap to show it fully.
  - more noticeable passives (???)
  - add parents of the pets that are only available through breeding

## Stop Gap for Android Release annoyances

- Publish on F-Droid!
- See how we can change the asset fetch depending on if we're web vs native.
- Potentially have to create a backend for the app to fetch the data from.

## Flow of Release

Note: We should really only be releasing when a big new feature drops. Otherwise the `eas update` command might cost us some money. I'm not fully sure on those details yet.

1. Make changes to the app and commit changes to main branch.
2. Are we still using `eas update`? If so, run that. You're done.
3. If not, run `eas build` and `eas submit` commands.

## Versioning

Expo has 2 versions we take care of:

- `version` - Inside of `app.json` is the version that is used for the app store.
- `version code` also known as the `buildNumber` - We don't manually configure this, as we have `eas` build commands handle it. Specifically with `"appVersionSource": "remote"` inside of `eas.json`.

## Commands and what they do

All `build:preview:{thing}` commands are for the preview channel. This is the channel that is used for testing. It is not the production channel.
<strong>NOTE:</strong> Make sure to change app.json version before building.

```bash
"build": "npx eas build"
```

We can actually run this command and it will update! Neat! Though if we get a lot of users, we'll need to stop using this since Expo charges fk tons.
For now, this can be used to push out updates without needing to rebuild and resubmit to the app store!

```bash
eas update
```

Once build is complete you can run `-p {platform}` to submit to the store.

```bash
eas submit
```

### Debugging

#### Eas Issues

"I ran `eas update` and it didn't patch.

- Docs: https://docs.expo.dev/eas-update/debug/
- TL;DR - Something is wrong between either channel, branch, or missing updates. It's a bit wonky. Read the docs :^)

#### Expo Issues

If you run into weird expo build issues, try this:

```bash
#remove node_modules -- `typically rm-rf node_modules`

yarn install
npx expo-doctor
npx expo install --fix # I manually updated the specific broken ones, but you can run this instead
```

#### Android Issues

"Version code 1 has already been used". - This is an issue with the `buildNumber` version code, not the `version` inside of app.json. Though this should be handled automatically by `eas` build commands... So not sure what happened! Uh oh you made an oopsie!

"Google Api Error: Invalid request - Only releases with status draft may be created on draft app." - Believe this just means that we aren't able to release yet for the 14 days thing. So we have to manually do it?

#### iOS Issues

"Xcode must be fully installed before you can continue"

- But i've already installed this?!
- Run `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer` to fix this.

Taking new screenshots for the app store:
Run `yarn ios`, then when the expo cli allows you, press `shift + i` to open the list of emulator devices. If you get a "theres no build" error you can simply exit out of cli and rerun `yarn ios` and it should work!

- Also note use "iPad Pro (12.9 inch) (6th generation)" for the screenshots.
