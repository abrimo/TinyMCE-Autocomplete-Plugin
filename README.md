AutoComplete for TinyMCE provides inline autocomplete in a style similar to Twitter or Facebook.  The text you type in tinyMCE is checked against a list of specified options; if there is a match then you will see them appear in a list underneath the caret. This plugin was originally designed for PriorityCentre, a task and meeting management application developed by Mijura (https://mijura.com).  

## Screenshot

![Screenshot of the tinymce autocomplete plugin](http://i.imgur.com/Fv4zE.png)

## Requirements
Autocomplete requires TinyMCE with the jQuery package, available for download here: http://www.tinymce.com/download/download.php

## Autocomplete options
There are four parameters that need to be specified in your tinyMCE config:

1. autocomplete_delimiters - A CSV list of delimiters (ASCII codes) on which to split text entered into tinyMCE. In most cases you will want to split text by spaces, in which case you would specify '160,32'. 32 is a normal space and 160 is &nbsp; (which is commonly used by tinyMCE). Whichever delimiter you specify first will be inserted after you select an option.  The default is '160,32' for spaces. 
2. autocomplete_options - A CSV list of autocomplete options.  For example, 'john,jane,william'.    
3. autocomplete_trigger -  You can specify a trigger character that must be type immediately before searching for options.  The default trigger is '@' 
4. autocomplete_end_option - Any text that you want to be added after the option.  The caret will be placed between the option and this ending text.  For example, you could specify 'end', in which case selecting an autocomplete option would insert: '@jane  @end' with the caret placed in between (and including the trigger before the end option).

## Configuration with TinyMCE

Copy the autocomplete folder (in src) to the plugins directory of your TinyMCE installation.  

Include the autocomplete plugin in your TinyMCE configuration, this might look like:

```
plugins : "autolink,lists,pagebreak,style,layer,advlink,emotions,advlist,autocomplete",
```

 Add the configuration options for the autocomplete plugin, e.g.:

```
autocomplete_options: "john,jane,william", 	// Required 
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
