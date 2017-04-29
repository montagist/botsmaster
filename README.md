## Why Botsmaster?

Because chat bots - like many other elements of tech & pop culture - are currently going through the dreaded hype cycle; Everyone's talking about them and plenty of people are building them, but very few have real context here. They're lacking the context of what bots used to be like years ago. They're lacking the real concrete usefulness and UX these bots had. Companies w/ serious engineering in their DNA often use IRC bots for their deployment and continuous integration processes. 

## Yea but why call it that (when there's another w/ a similar name?)

Because you shouldn't be calling your framework anything similar to Botsmaster if you haven't seen this:

[![Botsmaster Intro](https://img.youtube.com/vi/LLKYOSiW7U4/0.jpg)](https://www.youtube.com/watch?v=LLKYOSiW7U4)


But also, because I came up with this name and started thinking of the features before I noticed those other guys. Got really excited that it already existed, but found it wasn't really what I wanted and actually seemed a little over-engineered. Also it's got like 9 chat service adapters and that not a single one is for IRC. I could just write one but I consider it's lacking that that too bad of a smell to seriously do it


## Features TODO

- [ ] Child -> Master messages to chat
    - [ ] How to specify the intended chat service?
    - [ ] What about actions outside of chat data (joining, leaving, etc)?
- [ ] Implement Plugins and Middleware
    - [ ] Middleware (& 2-3 important services through it)
    - [ ] Like long-term context chat storage & retrieval
