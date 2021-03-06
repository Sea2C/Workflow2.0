# Workflow2.0

Scheduling, Billing, Payroll, More?

## Installation

    git clone git@github.com:Sea2C/Workflow2.0.git

## Setup

Create two environment variables called `FACEBOOK_ID` and `FACEBOOK_SECRET` with the corresponding application specific values provided by Facebook.

    export FACEBOOK_ID=...
    export FACEBOOK_SECRET=...

or in Windows
    
    SETX FACEBOOK_ID ...
    SETX FACEBOOK_SECRET ...

Install the [client side](https://github.com/Sea2C/Workflow2.0-Client/) source, and follow [the directions](https://github.com/Sea2C/Workflow2.0-Client/blob/master/README.md) to build it. Create a symlink to the client side project's `build` folder at the project path `lib\public\scripts\workflow`, or manually copy `Workflow2.0-Client.min.js` into it.

## Run

    cd Workflow2.0
    npm start

## Developers

Development mode will start the application, but when a file matching extension `js`, `dust`, or `less` is updated in the application source directory it will restart the `node` process automatically.

    cd Workflow2.0
    npm run-script dev

## Tests

Running the unit tests locally is a breeze.
    
    cd Workflow2.0
    npm test

Collecting code coverage metrics is just as simple. To access the results open `coverage.html` in a web browser.
    
    cd Workflow2.0
    npm run-script coverage

## License

    Copyright (c) 2013 John Mann <me@johnmann.org>, Colin Teal <the30yearswar@hotmail.com>

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.