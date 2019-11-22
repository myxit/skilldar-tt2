# Description
Implement custom in-memory cache library/module with built-in time-to-live(ttl) feature.

It should have the following functions:
    set = (key: string, value: any) => void
    get = (key: string) => any
    purge = (key: string) => void
    purgeAll = () => void

Things to note:
    1. Watchout for memory-leak issues
    2. Write Unit tests for each of the the functions above
    3. Pay attention to function signature above. i.e input types and return types
    4. Usage of the module should be as shown below.

# How to run
1. clone repository
2. run `npm install && npm run test` in the project folder

PS: my node version `10.14.2` and npm `6.13.1`
