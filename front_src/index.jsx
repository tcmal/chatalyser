import React from 'react';
import { render } from 'react-dom';

import App from './App.jsx';

const root = document.querySelector('#app');
render( <div>
            <App />
            <span>Developed by <a href="https://tcmal.xyz">tcmal</a> for <a href="https://2021.hacktheburgh.com/">Hack The Burgh 2021</a></span>
        </div>, root)