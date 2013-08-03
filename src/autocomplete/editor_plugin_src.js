/**
 * editor_plugin_src.js
 * 
 * Copyright 2012, Mijura Pty. Ltd. Released under The MIT License.
 * 
 * About:
 * AutoComplete for TinyMCE provides inline autocomplete in a style similar to 
 * Twitter or Facebook.  The text you type in tinyMCE is checked 
 * against a list of specified options; if there is a match then 
 * you will see them appear in a list underneath the caret.  
 * 
 * Configuration:
 * Parameters that we can use in tinyMCE config:
 * 1\ autocomplete_delimiters - A CSV list of delimiters (ASCII codes) on which 
 * 		to split text entered into tinyMCE. In most cases you will want to 
 * 		split text by spaces, in which case you would specify '160,32'. 32 is 
 * 		a normal space and 160 is &nbsp; (which is commonly used by tinyMCE). 
 * 		Whichever delimiter you specify first will be inserted after you 
 * 		select an option.  The default is '160,32' for spaces. 
 * 2\ autocomplete_options - A CSV list of autocomplete options.  For 
 * 		example, 'john,jane,jwilliam'.    
 * 3\ autocomplete_trigger -  You can specify a trigger character that must 
 * 		be type immediately before searching for options.  The default 
 * 		trigger is '@'  
 * 4\ autocomplete_end_option - Any text that you want to be added after the 
 * 		option.  The caret will be placed between the option and this ending 
 * 		text.  For example, you could specify 'end', in which case selecting 
 * 		an autocomplete option would insert: '@jane  @end' with the caret 
 * 		placed in between (and including the trigger before the end option).
 * 5\ autocomplete_min_length - The minimum number of characters a word needs to have
 *              before the autocomplete activates. Only active when autocomplete_trigger
 *              is ''. The default is 3.
 * 6\ autocomplete_on_select - A function to call after an option is selected.
 *              The default is false.
 * 7\ autocomplete_on_match - A function to call when text entered match only one option.
 *              The default is false.
 *
 * Support: 
 * You are welcome to use this plugin at your own risk.  It is currently 
 * being maintained on GitHub where you can submit issues / feature requests. 
 */

(function () {
	var autocomplete_data = {};
	var DOWN_ARROW_KEY = 40;
	var UP_ARROW_KEY = 38;
	var ESC_KEY = 27;
	var ENTER_KEY = 13;

	tinymce.create('tinymce.plugins.AutoCompletePlugin', {

		init: function (ed, url) {

			autocomplete_data = {
				list: createOptionList(),
				visible: false,
				cancelEnter: false,
				delimiter: ed.getParam('autocomplete_delimiters', '160,32').split(","),
				matchingOptions: ed.getParam('autocomplete_matching_options'),
				asString: ed.getParam('autocomplete_as_string'),
				trigger: ed.getParam('autocomplete_trigger', '@')
			};

			/**
			 * Search for autocomplete options after text is entered and display the 
			 * option list if any matches are found. 
			 */
			function keyUpEvent(ed, e) {
				var keyCode = e.keyCode;
				if ((!autocomplete_data.visible && keyCode != ESC_KEY && keyCode != ENTER_KEY) || 
						(keyCode != DOWN_ARROW_KEY && keyCode != UP_ARROW_KEY && keyCode != ENTER_KEY && keyCode != ESC_KEY)) {
					var currentWord = getCurrentWord(ed);
					if (currentWord.length > 0) {
						populateList(currentWord);
					}
					else {
						hideOptionList();
					}
				}
			}

			/**
			 * Populates autocomplete list with matched words.
			 *
			 */
			function populateList(currentWord) {
				var wordLessTrigger = currentWord.replace(autocomplete_data.trigger, "");
				matches = autocomplete_data.matchingOptions(wordLessTrigger);
				if (matches.length > 0) {
					displayOptionList(matches, wordLessTrigger, ed);
					highlightNextOption();
				}
				else {
					hideOptionList();
				}
			}


			/**
			 * Prevent return from adding a new line after selecting an option. 
			 */
			function keyPressEvent(ed, e) {
				if (e.keyCode == ENTER_KEY && autocomplete_data.cancelEnter) {
					autocomplete_data.cancelEnter = false;
					return tinymce.dom.Event.cancel(e);
				}
			}

			/**
			 * Handle navigation inside the option list when it is visible. 
			 * These events should not propagate to the editor. 
			 */
			function keyDownEvent(ed, e) {
				if (autocomplete_data.visible) {
					if (e.keyCode == DOWN_ARROW_KEY) {
						highlightNextOption();
						return tinymce.dom.Event.cancel(e);
					}
					if (e.keyCode == UP_ARROW_KEY) {
						highlightPreviousOption();
						return tinymce.dom.Event.cancel(e);
					}
					if (e.keyCode == ENTER_KEY) {
						selectOption(ed);
						autocomplete_data.cancelEnter = true;
						return false; // the enter evet needs to be cancelled on keypress so 
						// it doesn't register a carriage return
					}
					if (e.keyCode == ESC_KEY) {
						hideOptionList();
						return tinymce.dom.Event.cancel(e);
					}
				}
			}

			function clickEvent(ed, e) {
				hideOptionList();
			}

			/**
			 * Add all the options to the option list and display it right beneath 
			 * the caret where the user is entering text. There didn't appear to be 
			 * an easy way to retrieve the exact pixel position of the caret inside 
			 * tinyMCE so the difficult method had to suffice. 
			 */
			function displayOptionList(matches, matchedText, ed) {
				var list = jQuery('<ul class="auto-list"></ul>');
				for (var i in matches) {
					jQuery('<li></li>').prop('data-value', matches[i]).prop('data-matched-text', matchedText).text(matches[i].description).appendTo(list);
				}
				autocomplete_data.list.replaceWith(list);
				autocomplete_data.list = list;

				// work out the position of the caret
				var container = jQuery(ed.getContainer());
				var tinymcePosition = container.offset();
				var toolbarPosition = container.find(".mceToolbar").first();
				var textareaTop = 0;
				var textareaLeft = 0;

				var range = ed.selection.getRng();
				if (jQuery.browser.msie) {
					this.range = range;
				}
				var rangeStart = range.startOffset;
				range.setStart(range.startContainer, range.startOffset - 1);
				var rects = range.getClientRects();
				range.setStart(range.startContainer, rangeStart);
				if (rects.length > 0) {
					var rect = rects[0];
					textareaTop = rect.top + rect.height;
					textareaLeft = rect.left;
				}
				var win = $(window);
				var top = tinymcePosition.top - win.scrollTop() + toolbarPosition.innerHeight() + textareaTop;
				if (top + list.height() > win.height()) {
					list.css("top", "");
					list.css("bottom", 0);
				}
				else {
					list.css("top", top);
					list.css("bottom", "");
				}
				var left = tinymcePosition.left - win.scrollLeft() + textareaLeft;
				if (left + list.width() > win.width()) {
					list.css("left", "");
					list.css("right", 0);
				}
				else {
					list.css("left", left);
					list.css("right", "");
				}
				list.css("left", left);
				list.css("display", "block");
				autocomplete_data.visible = true;
				optionListEventHandlers(ed);
			}

			function optionListEventHandlers(ed) {
				jQuery(autocomplete_data.list).find("li").hover(function () {
					jQuery(autocomplete_data.list).find("[data-selected=true]").attr("data-selected", "false");
					jQuery(this).attr("data-selected", "true");
				});
				jQuery(autocomplete_data.list).find("li").click(function () {
					selectOption(ed);
				});
			}

			function createOptionList() {
				var list = jQuery('ul.auto-list');
				if (list.length > 0) {
					return list.first();
				}
				return jQuery('<ul class="auto-list"></ul>').appendTo($(document.body));
			}

			function hideOptionList() {
				autocomplete_data.list.css("display", "none");
				autocomplete_data.visible = false;
			}

			function highlightNextOption() {
				var current = autocomplete_data.list.find("[data-selected=true]");
				if (current.size() == 0 || current.next().size() == 0) {
					autocomplete_data.list.find("li:first-child").attr("data-selected", "true");
				} else {
					current.next().attr("data-selected", "true");
				}
				current.attr("data-selected", "false");
			}

			function highlightPreviousOption() {
				var current = autocomplete_data.list.find("[data-selected=true]");
				if (current.size() == 0 || current.prev().size() == 0) {
					autocomplete_data.list.find("li:last-child").attr("data-selected", "true");
				} else {
					current.prev().attr("data-selected", "true");
				}
				current.attr("data-selected", "false");
			}

			/**
			 * Select/insert the currently selected option. The option will be inserted at the 
			 * caret position with a delimiter at the end and the option enclosing text.	If the 
			 * enclosing text has already been inserted (this would happen when you are editing 
			 * an autocompleted option), then it won't be inserted again. 
			 */
			function selectOption(ed) {
				var list = autocomplete_data.list;
				var selectedItem = list.find("[data-selected=true]");
				if (!selectedItem) {
					selectedItem = list.find("li:first-child");
				}
				var current = selectedItem.prop("data-value");
				var matchedText = autocomplete_data.trigger + selectedItem.prop("data-matched-text");
				current = autocomplete_data.asString(current);
				var delim = "";
				if (autocomplete_data.delimiter.length > 0) {
					delim = String.fromCharCode(autocomplete_data.delimiter[0]);
				}
				var text = current.toString() + delim;

				var range = null;
				if (jQuery.browser.msie) {
					range = this.range;
				}
				if (!range) {
					range = ed.selection.getRng();
				}
				range.setStart(range.startContainer, range.startOffset - matchedText.length);
				ed.selection.setRng(range);
				ed.execCommand('mceInsertContent', false, text);

				hideOptionList();
				if (jQuery.browser.webkit || jQuery.browser.mozilla) {
					ed.focus();
				}
			}

			/**
			 * Retrieves the 'word' as specified by the first occurrence of a
			 * delimiter prior to the caret position.
			 */
			function getCurrentWord(ed) {
				var sel = ed.selection.getSel();
				var nodeText = sel.focusNode == null ? "" : sel.focusNode.nodeValue;
				var positionInNode = sel.focusOffset;
				if (nodeText == null || nodeText.length == 0) {
					return "";
				}
				// var lastDelimiter = 0;
				// for (var i = 0; i < positionInNode; i++) {
				//	 if (autocomplete_data.delimiter.indexOf(nodeText.charCodeAt(i).toString()) >= 0) {
				//		 lastDelimiter = i + 1;
				//	 }
				// }
				var lastDelimiter = positionInNode;
				var delimiter = autocomplete_data.delimiter;
				while (lastDelimiter--) {
					if (delimiter.indexOf(nodeText.charCodeAt(lastDelimiter).toString()) >= 0) {
						break;
					}
				}
				var word = nodeText.substr(lastDelimiter + 1, positionInNode - lastDelimiter - 1);
				if (word.length > 0 && word.charAt(0).toString() == autocomplete_data.trigger) {
					return word;
				}
				return "";
			}

			ed.onKeyUp.addToTop(keyUpEvent);
			ed.onKeyDown.addToTop(keyDownEvent);
			ed.onKeyPress.addToTop(keyPressEvent);
			ed.onClick.add(clickEvent);
			ed.onPostRender.add(function() {
				tinymce.dom.Event.add(ed.getWin(), 'blur', function(e) {
					setTimeout(hideOptionList, 500);
				});
			});
		},

		getInfo: function () {
			return {
				longname: 'AutoComplete',
				author: 'Mijura Pty Ltd',
				authorurl: 'http://mijura.com',
				infourl: 'http://blog.mijura.com',
				version: tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});
	tinymce.PluginManager.add('autocomplete', tinymce.plugins.AutoCompletePlugin);
})();
