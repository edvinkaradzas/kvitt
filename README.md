# Kvitt

A web app for splitting shared expenses in a group.

## Vision

When a group of friends has been on a trip together, different people have paid for different
things. Kvitt lets the group register who paid what, and then shows who should pay whom and how much
so that everyone is even.

No login is needed. The user opens the page, adds the group and the expenses, and gets a list of
payments.

## Requirements

| # | Requirement |
| --- | --- |
| K1 | The user can create a group with a name |
| K2 | The user can add members to a group |
| K3 | The user can register an expense split equally between selected members |
| K4 | The user can register an expense with an exact amount per member |
| K5 | The user can see every expense in the group as a list |
| K6 | The user can delete an expense that was entered by mistake |
| K7 | The user can see each member's balance, and whether they are owed money or owe money |
| K8 | The user can see a settlement plan — who pays whom and how much |
| K9 | The user can register a payment that has already been made |
| K10 | The user gets a field-specific error message when a form is filled in incorrectly |

Every requirement has at least one test case in [TEST_REPORT.md](TEST_REPORT.md). K9 is not
implemented, and K10 covers the group and member forms but not yet the expense form.

## Try it

https://kvitt-qpm2.onrender.com

The app runs on a free plan and sleeps after 15 minutes without visitors. The first visit after that can take up to a minute.

## Run locally

Requires Node.js 24.12.0 or later.

```bash
git clone https://github.com/edvinkaradzas/kvitt.git
cd kvitt
npm install
npm start
```

The application starts on <http://localhost:3000>.

## Architecture

Kvitt is one of four separate projects. The arrows show the direction of the dependencies — neither
module knows that this application exists.

```text
                 Kvitt  (this repository)
                /                         \
               v                           v
        split-ledger                 form-validation
     (my own module, L2M)        (another student's module, L3M)
               ^
               |
      split-ledger's tests
             (L2T)
```

| Part | Project | Role |
| --- | --- | --- |
| L3A | **Kvitt** — this repository | The application and its interface |
| L2M | [split-ledger](https://github.com/edvinkaradzas/split-ledger) | Balances and settlement. The main role. |
| L2T | split-ledger's test suite | Lives in the module's own repository |
| L3M | [form-validation](https://github.com/Fielifia/form-validation) | Validates the application's forms |

### Inside Kvitt

```text
src/
├── server.js             starts the app: creates every part and passes them in
├── App.js                Express setup and routes
├── GroupController.js    handles each request and picks the page to show
├── GroupRepository.js    keeps the groups in memory
├── GroupPresenter.js     turns split-ledger's objects into Swedish text for the views
├── FormValidator.js      the only class that uses form-validation
├── GroupNotFoundError.js thrown for an unknown group, shown as a 404 page
└── views/                EJS templates
vendor/
└── form-validation/      the other student's module, copied unchanged
```

**split-ledger** is installed from npm (`npm install split-ledger`). It does all the arithmetic —
shares, balances and the settlement plan. The application never calculates money itself.

**form-validation** is not published to npm, so its source code is copied unchanged into
`vendor/form-validation/`. See that directory's README for the commit it was taken from.

## What it does not do

- **Store data.** Groups are kept in memory and are lost when the server restarts — on the free
  hosting plan, that happens after 15 minutes without visitors.
- **Require a login.** Anyone with the link to a group can change it.
- **Change an expense after it is added.** An expense can be deleted and entered again.
- **Mix the two ways of splitting.** An expense is split either equally or by exact amounts. If
  some share equally and others pay set amounts, enter it as two expenses.
- **Register payments** (K9). Not implemented.
- **Handle more than one currency.** Every amount is in Swedish kronor.

## Interface language

The code, the documentation and the commit messages are in English. The text the user sees is in
Swedish, because the application is built for a Swedish audience paying in kronor.

## Development

```bash
npm run dev           # start with automatic restart
npm run lint          # check the code
npm run format        # format the code
```

## License

Released into the public domain under [the Unlicense](LICENSE).
