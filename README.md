This fork merged all other known forks into one. Then all noticed bugs were fixed to work with recent JQuery (1.8.2).

This plugin now has: Ajax and all words completion support (not only the ones preceding with '@' or some other character).

Example code for .NET MVC 3 controller method for getting Ajax autocompletion words list:
```
		public JsonResult GetWordCompletion(string q)
		{
				var jsonObj = new
				{
					ok = 1,
					DATA = new List<object>
						{
							new { name = "autocomplete item 1" },
							new { name = "autocomplete item 2" },
							new { name = "autocomplete item 3" }
						},
					ERRORS = new int[0]
				};

			return Json(jsonObj, JsonRequestBehavior.AllowGet);
		}
```

Below you can find original readme...
			
AJAX AutoComplete for TinyMCE provides inline autocomplete in a style similar to Twitter or Facebook.  The text you type in tinyMCE is checked against a list of specified options; if there is a match then you will see them appear in a list underneath the caret. This plugin was originally designed for PriorityCentre, a task and meeting management application developed by Mijura (https://mijura.com).  

This fork has been updated to provide generation of autocomplete list on-the-fly with AJAX. Use at your own risk. Also you can visit my page: http://www.sib.li :-)

Server should return data in this format:
```
{
	"ok":1,
	"DATA":
	[
		{"name":"autocomplete item 1"},
		{"name":"autocomplete item 2"},
		{"name":"autocomplete item 3"}
	],
	"ERRORS":[]
}
```

To configure use autocomplete_options_url setting (without autocomplete_options):
```
autocomplete_options_url: "/path/to/my/ajax.php",
```

This plugin has been tested in Firefox, Chrome, Safari and Internet Explorer 9. It currently does not support IE7/8. 

## Screenshot

![Screenshot of the tinymce autocomplete plugin](http://i.imgur.com/riKIZ.png)

## Requirements
Autocomplete requires TinyMCE with the jQuery package, available for download here: http://www.tinymce.com/download/download.php

## Autocomplete options
There are four parameters that need to be specified in your tinyMCE config:

1. autocomplete_delimiters - A CSV list of delimiters (ASCII codes) on which to split text entered into tinyMCE. In most cases you will want to split text by spaces, in which case you would specify '160,32'. 32 is a normal space and 160 is &amp;nbsp; (which is commonly used by tinyMCE). Whichever delimiter you specify first will be inserted after you select an option.  The default is '160,32' for spaces. 
2. autocomplete_options - A CSV list OR Javascript Object "options". 
   1. A CSV List like "john,jane,william"
   2. JSON-like "options" array of objects havaing a key and a description ( both visible to user key and description, key is only used for autocomplete features ) 
      "options": [
                  {
                        "key": "Attila",
                        "description": "- The <i>Great</i> Hun"
                  }
               ]
3. autocomplete_trigger -  You can specify a trigger character that must be type immediately before searching for options.  The default trigger is '@' 
4. autocomplete_end_option - Any text that you want to be added after the option.  The caret will be placed between the option and this ending text.  For example, you could specify 'end', in which case selecting an autocomplete option would insert: '@jane  @end' with the caret placed in between (and including the trigger before the end option).
5. autocomplete_min_length - The minimum number of characters a word needs to have before the autocomplete activates. Only active when autocomplete_trigger is ''. The default is 3.
6. autocomplete_on_select - A function to call after an option is selected. The default is false.
7. autocomplete_on_match - A function to call when text entered match only one option. The default is false.

## Configuration with TinyMCE

Copy the autocomplete folder (in src) to the plugins directory of your TinyMCE installation.  

Include the autocomplete plugin in your TinyMCE configuration, this might look like:

```
plugins : "autolink,lists,pagebreak,style,layer,advlink,emotions,advlist,autocomplete",
```

 Add the configuration options for the autocomplete plugin, e.g.:

```
// Required
autocomplete_options: "john,jane,william", 

OR (if you prefer showing description along the keys)

autocomplete_options: {
						"options": [
							{
								"key": "Attila",
								"description": "- The <i>Great</i> Hun <hr /> <iframe src=\"http://farm4.staticflickr.com/3451/3233621766_e4f6db7a22_m.jpg\"></iframe>"
							},
							{
								"key": "Kattila",
								"description": "/ The Great B<b>um</b>"
							},
							{
								"key": "JustKey",
								"description": "* Just a <a href=\"http://twitter.com/enersizetech\">link</a>"
							}
						]
 					  },
// Optional
autocomplete_delimiters: "160,32",		// Optional and this is the default 
autocomplete_trigger: "@",			// Optional and this is the default
autocomplete_end_option: "end",			// Optional and by default no ending text is inserted
```

Include (and customize) the CSS in src/styles/autocomplete.css on the page with your TinyMCE installation. 

## Support 
You are welcome to use this plugin at your own risk.  It is currently being maintained on GitHub where you can submit issues / feature requests. 

## License
Open Source Initiative OSI - The MIT License (MIT):Licensing

The MIT License (MIT)
Copyright (c) 2012 Mijura Pty. Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
