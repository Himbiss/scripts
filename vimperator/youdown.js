// Vimperator Plugin: youdown 
// sends youtube videos to the que to be downloaded

// PLUGIN_INFO 
let PLUGIN_INFO = xml`
<VimperatorPlugin>
  <name>youdown</name>
  <name lang="ge">German</name>
  <description>Adds youtube videos to a que for them to be downloaded later.</description>
  <description lang="ge">Fügt youtube videos einer que hinzu um sie später herunterzuladen.</description>
  <version>0.1.0</version>
  <author mail="vincent.ortland@uni-oldenburg.de">hammy</author>
  <license>MIT License (Please read the source code comments of this plugin)</license>
  <license lang="ge">MIT Lizenz</license>
  <minVersion>2.0</minVersion>
  <updateURL>https://github.com/Himbiss/scripts/vimperator/youdown.js</updateURL>
  <detail><![CDATA[
    == Commands ==
      :youdo[wn]:
        add the current youtube video to the download queue
  ]]></detail> 
</VimperatorPlugin>`;

// youdown - send the current video to the download queue 
liberator.plugins.youdown = (function(args) { 
	var href = getBrowser().contentDocument.location.href;
	if (href.indexOf("youtube.com") >= 0) 
	{
       		var m = /v=([-_a-zA-Z0-9]+)/.exec(href);
		if (m) 
		{
		    io.system('echo "' + href + '" \\> ~/Musik/queue/' + m[1]);
        	    commandline.echo(m[1] + " queued.");
		}
	}	
});

// add commands
commands.addUserCommand(['youdo[wn]'], "Add current youtube video to download queue",liberator.plugins.youdown);
