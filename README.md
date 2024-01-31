# Paldex

Welcome to Paldex. A Palworld companion.

The most comprehensive source of Palworld data, directly from the source. Including translations for all Palworld supported languages (WIP).

## Background

Originally we started off making a React Native Android / iOS app for Palworld, but that was absolute pain and misery. The stores do everything in their power to make solo devs miserable. So rather than letting all our hard work go to waste, we decided to make an open source.

We aim to have the most up to date and accurate information of Palworld on the web. We're not sure what the future holds, but we're excited to see where this goes.

## What will we find here?

This is an Nx mono repo, so you'll find a few things throughout. The main parts are as follows:

1. Server - The API for Paldex
2. Web - The frontend for Paldex
3. Data Provider - A tool to transform unpacked Palworlds data to JSON.

### [Server](/server/README.md)

This is the code for Paldex's API.

### [Web](/web/README.md)

This is where Paldex's frontend will live.

### [Data Provider](/data-provider/README.md)

The data provider acts as a way to go from the Palworld Data into our Transformed and Localized Data. All you need to do is unpack the game files, copy the `DataTable` / `L10N` folders, then run the generator command.

This will create the [baked-data](/data-provider/baked-data) folder, which contains the transformed data that can then be used to seed a database, display on a webpage, etc.

While we do our best to make sure we fix up the data, there are things that slip through the cracks.
