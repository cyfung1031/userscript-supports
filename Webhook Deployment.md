See this https://github.com/JasonBarnabe/greasyfork/issues/1211#issuecomment-1826291455

Reference Repos:

https://github.com/a1mersnow/aliyundrive-rename
https://github.com/Ex124OJ/Ex124OJ
https://github.com/cyfung1031/Tabview-Youtube

## Tabview-Youtube

1. Create a placeholder file `generated/Tabview-Youtube.user.js` in `[master]` branch
2. Set the `[generated-files]` branch based on `[master]` branch
3. Write the content to `generated/Tabview-Youtube.user.js` in `[generated-files]` branch
4. Trigger webhook with modified file `generated/Tabview-Youtube.user.js` in `[generated-files]` branch



## Ex124OJ

1. Set the `[build]` branch based on `[master]` branch
2. Create an empty js file `dist/ex124oj.user.js` in `[build]` branch (1st commit)
3. Write the content to `dist/ex124oj.user.js` in `[build]` branch (2nd commit)
4. Trigger webhook with modified file `dist/ex124oj.user.js` in `[build]` branch


## aliyundrive-rename

1. The js file `dist/aliyundrive-rename.user.js` exists in `[master]` branch.
2. When there is release, generate the file to dist.
4. Trigger webhook with modified file `dist/aliyundrive-rename.user.js` in `[master]` branch


