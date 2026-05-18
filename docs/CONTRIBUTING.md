### 1. Variables and Functions

#### 1.1 Use `camelCase` for variable and function names.

Reason: Conventional JavaScript

**Bad**

```
let FooVar;
function BarFunc() { }
```

**Good**

```
let fooVar;
function barFunc() { }
```

#### 1.2 Add `is` or `has` prefix to boolean variables.

Reason: It makes it simpler to read and modify code.

**Bad**

```
const player = true;
const players = true;
```

**Good**

```
const isPlayer = true;
const hasPlayers = true;
```

#### 1.3 Prefer to use `const` instead of `let`.

Reason: Using `const` by default is essentially a matter of programming style. It avoids side effects caused by involuntary reassignments.

#### 1.4 Avoid using `var`.

Reason: It decreases the chance of issues and makes code easier to support.

#### 1.5 Use `SNAKE_CASE (ALL CAPS)` for constants that used in many places and must not be changed.

Reason: It makes it simpler to read and modify code.

**Bad**

```
const bye_rounds = [11, 13];
```

**Good**

```
const BYE_ROUNDS = [11, 13];
```

* * *

### 2. Class

#### 2.1 Use `PascalCase` for class names.

Reason: This is actually fairly conventional in standard JavaScript.

**Bad**

```
class foo { }
```

**Good**

```
class Foo { }
```

#### 2.2 Use `camelCase` of class members and methods

Reason: Naturally follows from variable and function naming convention.

**Bad**

```
class Foo {
    Bar: number;
    Baz() {}
};
```

**Good**

```
class Foo {
    bar: number;
    baz() {}
}

```

* * *

### 3. Interface

#### 3.1 Use `PascalCase` for a name

Reason: Similar to class

#### 3.2 Use `camelCase` for members

Reason: Similar to class

#### 3.3 Prefix with `I`

Reason: Conventional TypeScript

**Bad**

```
interface Foo {}
```

**Good**

```
interface IFoo {}
```

#### 3.4 Split interface fields by using semicolons, not comma

Reason: Conventional TypeScript

**Bad**

```
interface IFoo {
    bar: string,
    baz: string,
}
```

**Good**

```
interface IFoo {
    bar: string;
    baz: string;
}
```

* * *

### 4. Type

#### 4.1 Use `PascalCase` for a name.

Reason: Similar to class

#### 4.2 Use `camelCase` for members.

Reason: Similar to class

#### 4.3 Prefix with `T`

Reason: Similar to interfaces naming convention.

**Bad**

```
type MyAwesomeValue = 0 | 1 | 2;
```

**Good**

```
type TMyAwesomeValue = 0 | 1 | 2;```
```

* * *

### 5. Namespace

#### 5.1 Use `PascalCase` for names

Reason: Convention followed by the TypeScript team. Namespaces are effectively just a class with static members. Class names are `PascalCase` => Namespace names are `PascalCase`

**Bad**

```
namespace foo {}
```

**Good**

```
namespace Foo {}
```

* * *

### 6. Enum

#### 6.1 Use `PascalCase` for enum names

Reason: Similar to Class. Is a Type.

**Bad**

```
enum color {}
```

**Good**

```
enum Color {}
```

#### 6.2 Use `PascalCase` for enum member

Reason: Convention followed by TypeScript team i.e. the language creators e.g SyntaxKind.StringLiteral. It also helps with translation (code generation) of other languages into TypeScript.

**Bad**

```
enum Color {
    red
}
```

**Good**

```
enum Color {
    Red
}
```

* * *

### 7. Null vs. Undefined

#### 7.1 Prefer not to use either for explicit unavailability

Reason: these values are commonly used to keep a consistent structure between values. In TypeScript, you use types to denote the structure

**Bad**

```
let foo = {
    x:123,
    y:undefined,
};
```

**Good**

```
interface IFoo {
    x:number,
    y?:number,
};

let foo: IFoo = { x:123 };
```

#### 7.2 Use `undefined` by default (i.e. if you return the object as `{ valid:boolean, value?:Foo }` value field may be `undefined`)

Please take it as: `undefined` - missing and not declared; `null` - is missing, but declared.

**Bad**

```
return null;
```

**Good**

```
return undefined;
```

#### 7.3 Use null where its a part of the API or conventional

Reason: It is conventional in NodeJS e.g. error is null for NodeJS style callbacks.

**Bad**

```
cb(undefined);
```

**Good**

```
cb(null);
```

#### 7.4 Use short check for the variable being null or undefined

**Bad**

```
if (error === null) { }
```

**Good**

```
if (error) { }
```

* * *

### 8. Formatting

#### 8.1 To negate any discussions on what is the best formatting we’re using Prettier. Please [follow the next instruction](https://fanhub.atlassian.net/wiki/spaces/FHTECH/pages/1488584811/Prettier) on how to setup the Prettier at your project.

* * *

### 9. Quotes

#### 9.1 Prefer single quotes (') unless escaping.

Reason: More JavaScript teams do this (e.g. Airbnb, standard, npm, node, google/angular, Facebook/react).  
Its easier to type (no shift needed on most keyboards). The prettier team recommends single quotes as well.

#### 9.2 Use double quotes (“) for DOM attributes.

Reason: It’s the HTML standard.

* * *

### 10. Indentations

#### 10.1 Use tabs. Not spaces.

Reason: It’s a convention applied by the Genius Sports F2P FE team.

* * *

### 11. Semicolons

#### 11.1 Use semicolons.

Reasons: Explicit semicolons helps language formatting tools give consistent results.
TC39 warning on this as well. Example teams: Airbnb, idiomatic, google/angular, Facebook/react, Microsoft/TypeScript.

* * *

### 12. Array

#### 12.1 Annotate arrays as `foos:Foo[]` instead of `foos:Array<Foo>`.

Reasons: It's easier to read. It's used by the TypeScript team. It makes it easier to know something is an array as the mind is trained to detect `[]`.

* * *

### 13. Filename

#### 13.1 Name source-code files with `sneak_case`. E.g. `accordion_item.component.tsx`, `live_updates.store.ts`, etc…

Reason: Decided by the team.

#### 13.2 If filename is `index.ts`, give a folder name according to the above conventions.

Reason: `import` from the folder will look the same as an `import` from the named file.

#### 13.3 Name assets files with `kebab-case`. E.g. `font-awesome.css`, `main-backgroud.jpg`, etc…

Reason: Decided by the team.

* * *

### 14. Type vs. Interface

#### 14.1 Use type when you might need a union or intersection:

```
type TFoo = number | { someProperty: number }
```

#### 14.2 Otherwise use interfaces

```
interface IFoo {
    x:number,
    y?:number,
};

interface IFooBar extends IFoo {bar: string;}

class X implements IFooBar {
    foo: string;
    bar: string;
}

let foo: IFoo = { x: 1 };
```

* * *

### 15. Imports

#### 15.1 Explicitly import what you need from a module

Reason: It allows the compiler to do a better tree shake and optimization.

**Bad**

```
import * as _ from 'lodash';
import * as React from 'react';
```

**Good**

```
import { get } from 'lodash';
import React, { Fragment, useEffect, useContext } from 'react';
```

#### 15.2 Prefer to use lazy load import for page components, instead of static import.

Reason: It increases site load speed and provides a better experience for users.

**Bad**

```
import Home from ('pages/Home');
```

**Good**

```
const Home = lazy(() => import('pages/Home'));
```

#### 15.3 Use absolute and not relative paths for import.

Reason: It makes the code much easier to understand and refactor.

**Bad**

```
import { Foo } from ('../../Foo');
```

**Good**

```
import { Foo } from ('components/Foo');
import { Bar } from ('./Bar');
```

* * *

### 16. Any

#### 16.1 Try to avoid any until it's really required to use

Reason: it makes it much harder to support code. Also, code completion doesn’t work when `any` type is used.

* * *

### 17. React

#### 17.1 Mark functional components with React.FC interface

Reason: it makes it much easier to support code, also code completion works better.

**Bad**

```
const Foo = () => (
  <div>Foo</div>
);
```

**Good**

```
const Foo: React.FC = () => (
  <div>Foo</div>
);

interface IBarProps {
  msg: string;
};

const Bar: React.FC<IBarProps> = ({ msg }) => (
  <div>{msg}</div>
);
```

#### 17.2 Try to use functional components as often as you can.

Reason: it’s the React team recommendation. Also, it allows the use of modern React API, like hooks.

#### 17.3 Try to avoid using class-based components.

Reason: Same as above.

#### 17.4 Keep components as simple as you can. Split components into small chunks. A component shouldn't be more than 100 lines of code.

Reason: it makes it much easier to support code.

#### 17.5 Use vanilla CSS to apply global styles (e.g. fonts, style-resets, etc...).

Reason: it allows us to load of critical styles first.

#### 17.6 Avoid using `</>` as a shortcut of `React.Fragment`. Use `<Fragment/>` component instead.

Reason: it makes it much easier to support code.

**Bad**

```
const Foo: React.FC = ({ children }) => (
    <>
    {children}
    </>
);
```

**Good**

```
const Foo: React.FC = ({ children }) => (
    <Fragment>
        {children}
    <Fragment/>
);

const Bar: React.FC = ({ children }) => (
    <React.Fragment>
        {children}
    <React.Fragment/>
);
```

* * *

### 18. Linter

#### 18.1 Use ESlint rules pre-configured at [MVVM Boilerplate](https://gitlab.com/geniussports/engage/f2p/mvvm-mobx-fe-boilerplate/-/blob/main/eslint.config.mjs?ref_type=heads) for all React projects.

The following rules are most important,and their values should meet following agreements:  
`complexity` rule value **MUST** be equal or less to 7.  
`sonarjs/cognitive-complexity` rule value **MUST** be equal or less to 15.

* * *

FAQ
---

**Q:** I can’t commit my changes, because they do not meet the linter’s requirements. May I change the rules list by myself?  
**A:** No, you shouldn't do this, until you have really serious reasons. If you are not sure what are other options, please check with project lead.

**Q:** So what should I do in this case?  
**A:** First of all, you should define what exactly is wrong, and try to fix the error and not just ignore it. Usually, when lint errors ignored, it leads to issues. If by any reason you can’t fix it, you may disable the rule by putting  
`// eslint:disable-next-line:{rule name}` comment right before the line where the issue is happening. **Please also leave the comment on why you have disabled the rule**.  
These comments would be considered as tech debt and may be fixed in the future. Or, a Lead dev could explain to you how to fix the issue while doing the code review.

**Q:** Ok, I disabled some rules very often. Does it really make sense to have such rules, if I disable it all the time?  
**A:** You’re not the only dev in a team, and other devs may successfully meet such requirements. Also, one of the goals of these rules is to raise the questions in a dev’s mind: Am I doing everything right? How I can do it better? Will it make the code better if I refactor the code?

**Q:** I really need to update the lint rule settings and I know what I do!  
**A:** Ok, there may be a really rare cases when you need to do this, but in such a case please notify your project lead about changes.

**Q:** Some rules make me and other devs in a team go crazy. We really want to change them.  
**A:** We have the corporative standard and all should follow it, but if you think the standard is too complex for a specific project or in general, please raise this question to the project lead and discuss possible changes.
