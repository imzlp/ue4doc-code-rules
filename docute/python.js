!function(){"use strict";var e=function(e){var n={className:"meta",begin:/^(>>>|\.\.\.) /},a={className:"string",contains:[e.BACKSLASH_ESCAPE],variants:[{begin:/(u|b)?r?'''/,end:/'''/,contains:[n],relevance:10},{begin:/(u|b)?r?"""/,end:/"""/,contains:[n],relevance:10},{begin:/(u|r|ur)'/,end:/'/,relevance:10},{begin:/(u|r|ur)"/,end:/"/,relevance:10},{begin:/(b|br)'/,end:/'/},{begin:/(b|br)"/,end:/"/},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},s={className:"number",relevance:0,variants:[{begin:e.BINARY_NUMBER_RE+"[lLjJ]?"},{begin:"\\b(0o[0-7]+)[lLjJ]?"},{begin:e.C_NUMBER_RE+"[lLjJ]?"}]},i={className:"params",begin:/\(/,end:/\)/,contains:["self",n,s,a]};return{aliases:["py","gyp"],keywords:{keyword:"and elif is global as in if from raise for except finally print import pass return exec else break not with class assert yield try while continue del or def lambda async await nonlocal|10 None True False",built_in:"Ellipsis NotImplemented"},illegal:/(<\/|->|\?)|=>/,contains:[n,s,a,e.HASH_COMMENT_MODE,{variants:[{className:"function",beginKeywords:"def"},{className:"class",beginKeywords:"class"}],end:/:/,illegal:/[${=;\n,]/,contains:[e.UNDERSCORE_TITLE_MODE,i,{begin:/->/,endsWithParent:!0,keywords:"None"}]},{className:"meta",begin:/^[\t ]*@/,end:/$/},{begin:/\b(print|exec)\(/}]}};hljs.registerLanguage("python",e)}();
