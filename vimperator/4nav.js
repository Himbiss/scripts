// Vimperator Plugin: 4nav
// adds commands to browse 4chan to the vimperator plugin

// PLUGIN_INFO 
let PLUGIN_INFO = xml`
<VimperatorPlugin>
  <name>4nav</name>
  <name lang="ge">German</name>
  <description>For 4chan add commands to navigate between pages.</description>
  <description lang="ge">Fügt Kommandos hinzu um in 4chan schnell zwischen den Seiten zu wechseln.</description>
  <version>0.33.2</version>

  <author mail="vincent.ortland@uni-oldenburg.de">hammy</author>
  <license>MIT License (Please read the source code comments of this plugin)</license>
  <license lang="ja">MIT Lizenz</license>
  <minVersion>2.0</minVersion>
  <updateURL>https://github.com/Himbiss/scripts/vimperator/4nav.js</updateURL>
  <detail><![CDATA[
    == Commands ==
      :fn[ext]:
        go to the next page of the current board
      :fp[rev]:
        go to the previous page of the current board
      :fc[atalog]:
        open the catalog of the current board
      :fo[pen]:
	open a 4chan board
  ]]></detail> 
</VimperatorPlugin>`;

// validate the url
function validateURL(value)
{
	return /((http|https):\/\/)?(4chan).org/i.test(value);   
}

// validate the board
function validateBoard(value)
{
	return /\b(a|b|c|d|e|f|g|gif|h|hr|k|m|o|p|r|s|t|u|v|vg|vr|w|wg|i|ic|r9k|s4s|cm|hm|lgbt|y|3|adv|an|asp|biz|cgl|ck|co|diy|fa|fit|gd|hc|int|jp|lit|mlp|mu|n|out|po|pol|sci|soc|sp|tg|toy|trv|tv|vp|wsg|x)\b/.test(value);
}

// validate the page
function validatePage(value) {
	return /(10|[0-9])/.test(value);
}

// decrement or increment the page and open it
function goToPage(page, board, increment)
{
	if(validatePage(page) && validateBoard(board)) {
		var realPage = parseInt(page);
		realPage = increment ? realPage+1 : realPage-1;
	
		liberator.open("boards.4chan.org/"+board+"/"+realPage.toString());
	} else {
		liberator.echoerr("Wrong page or board", commandline.APPEND_TO_MESSAGES);	
	}
}

// fopen - open a board
liberator.plugins.fopen = (function(args) {
	var board = args[0];
	if(board && validateBoard(board)) {
		liberator.open("boards.4chan.org/"+board);	
	} else {
		liberator.echoerr("Please specify a valid board", commandline.APPEND_TO_MESSAGES);
	}
});

// fnext - go to the next page
liberator.plugins.fnext = (function(args) { 
	var currentURL = buffer.URL;
	if(validateURL(currentURL)) {
		var split = currentURL.split("/");
		var page = split[split.length-1];
		var board = split[split.length-2];
		if(!page) // page 1 on 4chan is page 0 or just blank 
			page = '1';
		
		goToPage(page,board,true);
	} else {
		liberator.echoerr("You are not on 4chan", commandline.APPEND_TO_MESSAGES);
	}
});

// fprev - go to the previous page
liberator.plugins.fprev = (function(args) {
	var currentURL = buffer.URL;
	if(validateURL(currentURL)) {
		var split = currentURL.split("/");
		var page = split[split.length-1];
		var board = split[split.length-2];
		if(!page)
			return;
		if(page=='2') // 4chan only accepts page 0 or a blank as page 1
			page='1';

		goToPage(page,board,false);
	} else {
		liberator.echoerr("You are not on 4chan", commandline.APPEND_TO_MESSAGES);
	}
});

// fcatalog - go to the catalog of the board
liberator.plugins.fcatalog = (function(args) { 
	var currentURL = buffer.URL;
	if(validateURL(currentURL)) {
		var split = currentURL.split("/");
		var page = split[split.length-1];
		var board = split[split.length-2];
		if(validateBoard(board)) {
			liberator.open("boards.4chan.org/"+board+"/catalog");
		} else {
			liberator.echoerr("Please go to the board first", commandline.APPEND_TO_MESSAGES);
		}
	} else {
		liberator.echoerr("You are not on 4chan", commandline.APPEND_TO_MESSAGES);
	}
});

// add commands
commands.addUserCommand(['fn[ext]'], "Go to the next page",liberator.plugins.fnext);
commands.addUserCommand(['fp[rev]'], "Go to the previous page",liberator.plugins.fprev);
commands.addUserCommand(['fc[atalog]'], "Go to the catalog",liberator.plugins.fcatalog);
commands.addUserCommand(['fo[pen]'], "Go to a 4chan board",liberator.plugins.fopen);
