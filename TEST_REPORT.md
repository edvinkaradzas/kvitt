# Test Report

## Summary

Kvitt was tested manually, requirement by requirement, by filling in its forms and reading the
resulting pages. During development I used the app in the browser after each step. The final test
run below was made against a local server (`npm start`) by sending the same form data the browser
sends, with `curl`, and reading the HTML that came back, so that every input and outcome could be
recorded exactly.

To repeat the tests, start the app, open <http://localhost:3000> (or the deployed app at
<https://kvitt-qpm2.onrender.com>) and follow the inputs in the table from top to bottom: they
build on each other, starting with a group called "Fjällen" with the members Anna, Bo and Cia.

The hardest part to test was the money. A wrong balance still looks like a reasonable amount, so
each expected outcome was worked out by hand first: for example, a 3 000 kr cabin split three ways
means Anna, who paid, is owed 2 000 kr. All balances in a group must also add up to zero, which was
checked for every result.

## Test Results

| Test case | Requirement | Input | Expected outcome | Actual outcome |
| --- | --- | --- | --- | --- |
| Create a group | K1 | On the start page, typed "Fjällen" and clicked "Skapa grupp". | The page for the group "Fjällen" is shown. | ✅ As expected. |
| Add members | K2 | On the group page, added "Anna", then "Bo", then "Cia". | All three are listed under "Medlemmar". | ✅ As expected. |
| Expense split equally | K3 | "Nytt utlägg": "Stugan", 3000, paid by Anna, "Alternativ 1" with Anna, Bo and Cia checked. | The expense is added; each member's share is 1 000 kr. | ✅ As expected. |
| Expense with exact amounts | K4 | "Nytt utlägg": "Middag", 450, paid by Bo, "Alternativ 2" with Anna 200, Bo 250, Cia empty. | The expense is added with Anna and Bo as participants; Cia is not part of it. | ✅ As expected. |
| List expenses | K5 | Opened the group page after the two expenses above. | A table with "Stugan 3 000,00 kr, Anna, Anna, Bo, Cia" and "Middag 450,00 kr, Bo, Anna, Bo". | ✅ As expected. |
| Show balances | K7 | Read "Saldon" on the group page. | Anna ska få 1 800,00 kr, Bo ska betala 800,00 kr, Cia ska betala 1 000,00 kr (sum zero). | ✅ As expected. |
| Show settlement plan | K8 | Read "Vem betalar vem" on the group page. | "Bo betalar Anna 800,00 kr" and "Cia betalar Anna 1 000,00 kr". | ✅ As expected. |
| Delete an expense | K6 | Clicked "Ta bort" on the "Middag" row. | "Middag" disappears from the table and the balances no longer include it. | ✅ As expected. |
| Register a payment | K9 | — | A payment can be registered and the balances update. | ❌ Not implemented. split-ledger supports it (`recordPayment`), but the form and route in Kvitt were not built in time. |
| Empty group name | K10 | On the start page, left the name empty and clicked "Skapa grupp". | "Gruppen måste ha ett namn." under the name field; no group is created. | ✅ As expected (HTTP 400). |
| Empty member name | K10 | On the group page, left the name empty and clicked "Lägg till medlem". | "Medlemmen måste ha ett namn." under the name field; no member is added. | ✅ As expected (HTTP 400). |
| Expense without an amount | K10 | "Nytt utlägg" with the amount left empty. | A message under the amount field. | ❌ A generic "Något gick fel" page (HTTP 500). The expense form is not validated yet. |
| Member name already used | K10 | Added "Anna" a second time. | A message that the name is taken. | ❌ A generic "Något gick fel" page (HTTP 500). split-ledger rejects the name, but the error is not shown in the form. |
| Unknown group | — | Opened `/groups/99`. | A page saying the group does not exist. | ✅ "Gruppen finns inte" (HTTP 404). |

## Known Issues in Third-Party Modules

Issues found in [form-validation](https://github.com/Fielifia/form-validation), commit `7db3255`:

- **Crashes on lists.** `RequiredRule.validate` calls `value.trim()`. A field whose value is a
  list, such as several checked checkboxes, throws `TypeError: value.trim is not a function`.
  Kvitt works around it by never passing lists to the module.
- **No decimal comma.** `MinValueRule` uses `Number(value)`, so a Swedish amount like `"150,50"` is
  treated as not a number. This would have to be handled before validating the expense form.
- **Wrong clone URL in the README.** The README says to clone `Fielifia/1dv610-laboration-2`, but
  the repository is called `form-validation`.
- **Cannot be installed.** The module is not on npm and its `package.json` has no `main`, so it is
  copied unchanged into `vendor/form-validation/`.
