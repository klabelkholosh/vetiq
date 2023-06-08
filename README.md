# VetIQ

A ChatGPT app that helps you diagnose your pet!

Made with React, SASS and Server-Side Events, for streaming ChatGPT responses.

Not trained on any particular data set, just a custom prompt in the backend, but working on that next!

Demo: https://vetiq-five.vercel.app/

## Setup

This app relies on the vetiq-backend (https://github.com/klabelkholosh/vetiq-backend) to work correctly.

You'll have to define an environment variable for the backend's URL in .env, as follows:

    REACT_APP_BACKEND_URL=<url to back-end, ensuring it ends with /chat>

## License

MIT
