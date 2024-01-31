# Hosted API for Paldex

## TODO

- Store all the data on supabase.
- Use redis to cache the data gets, and rate limit users to something reasonable. (just on the off chance this explodes, supabase might get expensive)
- Getters for all the things. Pals, items, skills, crafting, droppers, etc.
- Filters for all pals / items
- Create API rate limiters - Supabase seems to have this, bless up. https://supabase.com/docs/guides/functions/examples/rate-limiting
- ????

- Lets try out appwrite, they give free pro tier for OSS - https://appwrite.io/blog/post/announcing-appwrite-pro
  - Then we have that solved for us!
