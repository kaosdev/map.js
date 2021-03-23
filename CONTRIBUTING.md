# Contributing to map.js

> Every contribution is the key to open source !

Note that we have a [code of conduct](CODE_OF_CONDUCT.md), please follow it in every interaction with the project.

## Found a Bug? :bug:

If you find any bug (or potential one) [submit an issue](https://github.com/kaosdev/map.js/issues/new) and add 'bug' label to it.

A good issue should have:

- a clear description of the problem
- minimal reproduction steps
- environment description

And maybe even a solution :wink:!

## Missing a Feature?

If you feel the project needs another feature [submit an issue](https://github.com/kaosdev/map.js/issues/new) and add 'feature' label to it.

New features should contains:

- a clear description of the feature
- why it is needed
- (optional) description of a possible implementation

## Submitting a Pull Request (PR)

Before you submit a PR, make sure to follow this steps:

- Search for an open or closed PR related to your contributing (don't duplicate effort)
- Fork the project
- Create a new branch:

  ```sh
  git checkout -b my-branch main
  ```

- Create your fix or add a new feature
- Add one or more test cases, and make sure all other tests pass.

  ```sh
  npm run test
  # or to watch for file changes
  npm run test:w
  ```

- Commit your changes to your branch, and make sure to follow [commit message guidelines](#commit-message-guidelines)
- Push the branch to GitHub:

  ```sh
  git push origin my-branch
  ```

- In GitHub, send a PR to the map.js main branch (not the forked one)
- Wait for a review and make proper changes if needed

## Commit Message Guidelines

To make commit history more readable, make sure to follow this guidelines:

### Format

Use the following format.

```
<type>(<scope>): <brief description>
<BLANK LIKE>
<description>
```

Every part, exept `(<scope>)` and `<description>` are optional.
Any line of the message cannot be longer than 100 characters.

### Type

Replace `<type>` with any of the following:

- feat: A new feature
- fix: A bug fix
- docs: Changes to documentation
- test: Add missing tests
- build: Changes to the build process or auxiliary tools

### Scope (optional)

Replace `<scope>` with anything related to the location of the change.
For example `panzoom` or `roadmap`.

### Brief description

Replace `<brief description>` with a short message that describe the change.

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize first letter
- no dot (.) at the end

### Description (optional)

If you feel like the brief description is not enough, you can integrate the message
with longer description.
Make sure to add a blank line before this description.
