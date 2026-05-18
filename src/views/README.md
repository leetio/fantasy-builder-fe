### What is Views?

Views is a presentation and presentations logic. This folder includes ViewModels (aka ViewControllers) and pages, components.
It's a V and VM part in the M(V)(VM) pattern. There can't be any business logic, but only code related to UI, and it's behaviour.

This folder contains:
* components - it's a minimal UI building blocks that can be reused at other components or pages.
* controllers - it's a shared or commonly used view models.
* pages - it's a representations of whole page constructed with components and controllers. Each page commonly have its own view model.

Each View must use exactly one ViewModel, while each ViewModel may be used across many Views.