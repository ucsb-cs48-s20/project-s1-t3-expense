# project-s1-t3-expense

# Housing Expenses Splitter

- A web application to keep track of bills and owed money, can support payments such as rent or one time fees. Users can choose to split the bills evenly or customize by themselves.
- Will support the users creating additional expenses in the following categories: groceries, food, etc.
- Support quick calculations & PDF receipts

* Quick Calculations: do not need to sign in

- A budget system will be provided.
- Tech stack is Javascript.

# Users

- Bill Owner (Anyone can be the bill owner): create a new bill, put in the amount and description, add members of this bill and the amount correspondingly (does not need to be everyone), keep track of the payment status
- Bill Member: agree/disagree with the payment

# Project Members

- Kobe Shavolian, KobeShav
- Roberto Gutierrez, robg1638
- Helen Huang, helenziyihuang
- Kaylee Nguyen, kayleenguyen
- Dylan Lin, DylanLin29
- Greg Baroni, gbaroni888

# Deployment

- [Deployment Instructions](./docs/DEPLOY.md)
- [Video](https://drive.google.com/open?id=1RYRhRH_2tTJ5RGw2EEmhO3AEBZGAFRpJ) (View with UCSB Google account)
- Note: The files you need to change for localhost/heroku deployment are different than from the video, please refer to the written instructions for the correct files

# Commands

These likely will not work until initial configuration is done per instructions below.

| Command                   | Description                                           |
| ------------------------- | ----------------------------------------------------- |
| `npm install`             | Install Dependencies                                  |
| `npm run dev`             | Runs locally in development mode                      |
| `npm run start`           | Runs in production mode (requires `PORT` env var)     |
| `npm run test`            | Runs entire test suite                                |
| `npm run test:cypress`    | Runs Cypress integration tests                        |
| `npm run test:cypress`    | Runs `prettier` format tests                          |
| `npm run fix:format`      | Reformats all project files using `prettier`          |
| `npm run storybook`       | Run React Storybook (made available at localhost:6006 |
| `npm run build-storybook` | Create static react storybook for GitHub Pages        |

Note that while no environment variables are required to run
`npm run dev`, running `npm run start` requires that the `PORT` environment
variable be set first, e.g.

```
export PORT=3000
```

# React Storybook

A storybook for the React components of this project is published here on GitHub pages

- <https://ucsb-cs48-s20.github.io/project-s1-t3-expense-storybook>

# How to update the Storybook on GitHub pages

First, you must understand that there are two repos for this project:

| Purpose          | Repo                                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| Source Code      | [project-s1-t3-expense](https://github.com/ucsb-cs48-s20/project-s1-t3-expense)                     |
| Static Storybook | [project-s1-t3-expense-storybook](https://github.com/ucsb-cs48-s20/project-s1-t3-expense-storybook) |

The Static Storybook repo exists only for the purpose of publishing the storybook, and
should be updated only using this process:

First, inside `project-s1-t3-expense`, use `npm run storybook` and then
visit the storybook on <http://localhost:6006> to ensure that the storybook is building properly.

Then, when you are ready to update the static storybook published to GitHub pages:

- Clone both repos as siblings under the same parent directory
- Inside `project-s1-t3-expense`, run the command:

  ```
  npm run build-storybook
  ```

  This will wipe out the directory `../project-s1-t3-expense-storybook/docs` in the other repo, and populate
  it with new content based on the current source code.
