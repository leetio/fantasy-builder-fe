## What is this repo supposed for?
It’s just a React boilerplate that implements MVVM pattern with reactivity and DI implementations. Compared to the approach with Redux/Sagas its allow to more easily to reuse logic and UI with mix of OOP and RFP approaches. The project’s architecture and approach are pretty similar to what we’re using at Flutter apps, so devs who are familiar with it will be able to start using this approach really fast.

## Why it was created?
MVVM pattern allows much easier to re-use logic as it’s abstracted from representation and knows nothing about it. For many projects, we have very similar code that works with players, rounds, countries, or just authorization. The main idea is to add more re-usable classes (Models) that process the data into boilerplate, it will allow to speed up the development process and decrease the amount of copy-paste code. Potentially it’s even possible to export such models into the NPM package and use them not only in React apps. As an additional plus, it will be much easier to jump between Web and Flutters apps development as structure and approach are almost the same.

## How to use it?

- Fork this repo to your own namespaces and rename it during form process.
- Move the fork to `geniussports/engage/f2p` workspace.
- Follow the steps described at the [SETUP.md](./SETUP.md) file.
- That’s it. Whole process for a project setup shouldn’t take more than 1-2hrs.
- It's highly recommended to use the [GSX CLI](https://gitlab.com/geniussports/engage/f2p/mobx-cli/-/tree/main) for the development, as it will save you a lot of time.