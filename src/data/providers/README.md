### What is Provider?

Provider - is a data provider, and it's part of data access layer.
Providers are components which are handling the data. If you need to save or get some data from API, DB, JSON you should create 
the provider that will do this with help of services.

**Providers must not to handle errors, store or transform response, as this is responsibility of Models.
Providers are just a bridge between Data nd Models.**

