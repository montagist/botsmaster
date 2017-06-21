## Why Botsmaster?

Because chat bots - like many other elements of tech & pop culture - are currently going through the dreaded hype cycle; Everyone's talking about them and plenty of people are building them, but very few have real context here. They're lacking the context of what bots used to be like years ago. They're lacking the real concrete usefulness and UX these bots had. While I'm just as excited about conversational bots as the next guy, this wave's missing out on a serious engineering legacy of using IRC or other types of chat bots to orchestrate tasks in a certain way. In this light, the aim of this project is to give you, in addition to standard offerings of most chatbot frameworks, the ability to write a multi-threaded nodejs chat bot that exists on several  

## Yea but why call it that (when there's another w/ a similar name?)

Because you shouldn't be calling your framework anything similar to Botsmaster if you haven't seen this:

[![Botsmaster Intro](https://img.youtube.com/vi/LLKYOSiW7U4/0.jpg)](https://www.youtube.com/watch?v=LLKYOSiW7U4)


But also, because I came up with this name and started thinking of the features before I noticed those other guys. Got really excited when I found it, but realized it wasn't in alignment with what I'd in mind; They're more about "hi how are you" conversational bots, this is more about the orchestration of events, and building bots that do heavy lifting (like shepherding your build process, for example); this will include many small modules and utilities that aid developers to that end. They're based on callbacks, we're based on event-dispatching, allowing the cross-service functionality's easily implemented. Webhooks, though trivially implemented, are not a core feature here. Also they've got like 9 chat service adapters and that not a single one is for IRC. I could just write one but I consider it's lacking that too bad of a smell to take it seriously, as well as some other things like "incoming middleware" vs "outgoing middleware" (so "not middle"ware then?). The youngins. In the end, I don't perceive their framework as being poorly made or anything, just that it won't help me make the kinds of bots I want to easily. 


## Features TODO

- [x] Child -> Master messages to chat
    - [x] How to specify the intended chat service?
    - [ ] What about actions outside of chat data (joining, leaving, etc)?
- [ ] Implement Plugins and Middleware
    - [ ] Middleware (& 2-3 important services through it)
    - [ ] Like long-term context chat storage & retrieval





## How it generally works

You 
