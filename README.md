## Lab Server

To start the server,
1. Make sure that you already have `lab-client` built on your computer. Otherwise,
    1. Go to the parent directory of this folder.
    2. Run `git clone https://github.com/Chen-Ze/lab-client`.
    3. Run `cd lab-client`.
    4. Run `npm i`.
    5. Run `npm run build`.
2. Make sure that the `BUILD_LOCATION` entry correctly points to the `lab-client` build. If you followed the instruction in the last step, then the `BUILD_LOCATION` should be already correct. Otherwise, you may have to manually revise it to the correct location.
3. Run `npm i` in this folder.
4. Run `npm run build` in this folder.
5. Run `node .` to start the server.
6. Open [localhost](http://localhost) from your browser.