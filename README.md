## Version Control Guidelines

### ***Commit Message Guidelines***
When writing commit messages, follow these categories:

- **feature!** `{brief description}`  
  Use this for adding new test cases, methods, or features.

- **fix!** `{brief description}`  
  Use this for fixing any test-related issues.

- **refactor!** `{brief description}`  
  Use this for modifying an existing test or refactoring code.

---

### ***Branch Naming Convention***

For branch names, follow this structure:

- **feature/module/owner**  
  Example: `feature/buzz-post/Waed`

- **fix/module/owner**  
  Example: `fix/login-page/Waed`

- **refactor/module/owner**  
  Example: `refactor/submit-post/Waed`

---

### ***PR Naming Convention***

When naming your Pull Requests (PR), use the following format:

```text
[Refactor][Login Page]: {description of changes}
```
---
### ***Page Object Model (POM) Conversion Guide***

See how to upgrade from old to new POM style with function helpers [here](https://excalidraw.com/#json=xEEBgT4JsHKhHgkjCvbYR,HvrHhX12iwzhyfzQqgxsDw).

---
## Cypress Notes

### 1. `.should()` Behavior
- Any value returned from the `.should()` callback function will be ignored.
- In most cases, `.should()` yields the same subject it was given from the previous command.
- **Important:** You cannot invoke Cypress commands inside a `.should()` callback.  
  Instead, use Cypress commands **before or after**, or use `.then()`.

### 2. Test Hooks Execution Order
- In a test file, `before()` always runs first and `after()` always runs last, no matter where they are placed.
- The execution order is:
```text
before() → beforeEach() → it() → afterEach() → after()
```
### 3. Querying Behavior with Negative Index
- The querying behavior matches how `.eq()` works in jQuery.
- If the index is negative, it will count backwards from the last element.

### 4. `.contains()` Case Sensitivity
- By default, the `.contains()` method is case-sensitive.
- To make it case-insensitive, use the option `{ matchCase: false }`.

### 5. `.its()` Command
- The `.its()` command is used to access properties of the subject.
- If trying to access a non-existent property (e.g., index `-1`), it will return `undefined`.

### 6. Assertion Behavior with Multiple Elements
- For `be.visible`: it retries until **at least one** element becomes visible.
- For `not.be.visible`: it retries until **every** element becomes invisible.

### 7. `.as()` Command (Aliasing)
- The `.as()` command is used to store the value of the previous command.
- You can access the alias value using the `this` keyword.
- **Note:** `this` is not available inside arrow functions.
- All aliases are reset before each test, so it's better to set aliases inside a `beforeEach` hook.

### 8. `.invoke()` Method
- `.invoke()` behaves differently when chained with other commands.
- For example, invoking `addToStack(4)` might push `4` to the stack array **twice** depending on how it’s chained.

### 9. `.go()` Method (Browser History)
- `.go()` is used to navigate through the browser’s history.
- You can use `'back'`, `'forward'`, or numeric values like `-1` and `1`.

### 10. Cross-Origin Testing
- A test will fail if you visit two different superdomains in the same test.
- To handle cross-origin issues, use `cy.origin()` and refer to Cypress Cross-Origin Testing documentation.

### 11. Type Conversion in Cypress
- Cypress automatically converts values to `Number` or `Boolean` wherever possible.
- In JavaScript, `typeof NaN` is `"number"`, so Cypress will log it as a number.

---

***The information in this document is based on [Cypress Quiz](https://cypressquiz.com/?fbclid=IwY2xjawJ6AHRleHRuA2FlbQIxMQABHvVGwMbHbbKVvG0nMCUWVUpEJ3DabIleBr_FEVwJqZM2XEh8X2yxjopSK3h-_aem_OuGGzLmso6GoTIxLNlHpCQ)***
