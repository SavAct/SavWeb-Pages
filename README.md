# SavWeb-Pages
The SavAct app allows you to upload files on blockchains. This includes html files. So you can use the SavAct app to visit decentralized websites. The inclusion of styles and JavaScript in the HTML file is done as usual, but if external resources are included, some JavaScript functions are required. 

To keep the complexity and file sizes down, the browser offers some features that can be accessed from the site.

## How it works
When a decentralized website is accessed, it receives a token. This token is used for verification. The token must be sent for every request, except for a page change to another decentralized web page.

Current available requests are defined in the ***SavWebActions.ts***

Messages will be performed via ___postMessage()___.

# Examples 
In this repository are some examples of decentralised web pages which embed decentralised content as well. To preview a file before uploading it, you can drop a file in the address bar of the SavAct app browser.

### Free Speech
See the free speech page in action at https://savact.app/#savactsavact. The embedded SavAct gif image is stored on blockchain as well.

# Licence
The whole project is open source and free to use, see MIT licence. Feel free to suggest some improvements.