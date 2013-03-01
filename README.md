# Workflow2.0

Scheduling, Billing, Payroll, More?

## Installation

    git clone git@github.com:Sea2C/Workflow2.0.git

## Setup

Create an environment variable called FACEBOOK_SECRET with the application secret.

    export FACEBOOK_SECRET=...

or in Windows

    SETX FACEBOOK_SECRET ...

## Run

    cd Workflow2.0
    npm start

## Developers

Development mode will start the application, but when a file matching extension `js`, `dust`, or `less` is updated in the application source directory it will restart the `node` process automatically.

    cd Workflow2.0
    npm run-script dev

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