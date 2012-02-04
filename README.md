AutoComplete for TinyMCE provides inline autocomplete in a style similar to Twitter or Facebook.  The text you type in tinyMCE is checked against a list of specified options; if there is a match then you will see them appear in a list underneath the caret.  

## Configuration
There are three parameters that need to be specified in your tinyMCE config:

1. autocomplete_delimiters - A CSV list of delimiters (ASCII codes) on which to split text entered into tinyMCE. In most cases you will want to split text by spaces, in which case you would specify '160,32'. 32 is a normal space and 160 is &nbsp; (which is commonly used by tinyMCE). Whichever delimiter you specify first will be inserted after you select an option.  The default is '160,32' for spaces. 
2. autocomplete_options - A CSV list of autocomplete options.  For example, 'john,jane,jwilliam'.    
3. autocomplete_trigger -  You can specify a trigger character that must be type immediately before searching for options.  The default trigger is '@' 
4. autocomplete_end_option - Any text that you want to be added after the option.  The caret will be placed between the option and this ending text.  For example, you could specify 'end', in which case selecting an autocomplete option would insert: '@jane  @end' with the caret placed in between (and including the trigger before the end option).

## Support 
You are welcome to use this plugin at your own risk.  It is currently being maintained on GitHub where you can submit issues / feature requests. 
