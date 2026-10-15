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

## Try it

https://kvitt-qpm2.onrender.com

The app runs on a free plan and sleeps after 15 minutes without visitors. The first visit after that can take up to a minute.

## Run locally

```bash
npm install
npm start
```
