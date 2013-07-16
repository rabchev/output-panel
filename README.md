Output Panel
============
A [Brackets](https://github.com/adobe/brackets) extension that provides a panel for displaying run-time information.
This extension is not useful on its own, but it provides convenient UI for displaying information from long running 
background tasks such as compilation or installation process. It is intended to be used in conjunction with other 
Brackets extensions.

Featuers
--------
1. Filter messages by category.
2. Clear (delete) all messages.
3. Configurable buffer size – the maximum number of messages kept in memory. 
The default value is 1000. Messages are assumed to be short.
4. Toggle display timestamp and configure timestamp format.
5. Toggle display output panel from the toolbar.
6. API for controlling output panel.

Installation
------------
1. Select Brackets > File > Extension Manager...
2. Click on Install from URL...
3. Paste [https://github.com/rabchev/output-panel](https://github.com/rabchev/output-panel) into Extension URL field.
4. Click on the Install button.

Usage
-----
```javascript
    var ExtensionLoader     = brackets.getModule("utils/ExtensionLoader"),
        output              = ExtensionLoader.getRequireContextForExtension("output-panel")("main");
    
    output.log("My Extension", "Warning: Unresolved dependency found.");
    output.setVisibility(true);
```

API Reference
-------------
#### output.log(category, message);
Appends new message to the output panel.

#### output.clear();
Deletes all buffered messages and clears the output panel.

#### output.maxLines();
Gets the maximum buffer size limit, in number of messages.

#### output.maxLines(value);
Sets the maximum buffer size limit, in number of messages.

#### output.isVisisble();
Indicates whether the output panel is currently visible or hidden.

#### output.toggleVisibility();
Toggles the visibility of the output panel.

#### output.setVisibility(isVisible);
Sets the visibility of the output panel.

#### output.timestamp.set(output.timestamp.date);
Sets the visibility and format of entry timestamps.
Values: 
    timestamp.none = "none"; // Timestamps are not displayed
    timestamp.time = "time"; // Displays time only
    timestamp.date = "date"; // Displays date and time

Default is "none".
    
#### output.filter(category);
Hides all messages except those that match the specified category. 
If "all" is passed as an argument, then all massages are displayed regardless of their category. 

License
-------
(MIT License)

Copyright (c) 2013 Boyan Rabchev <boyan@rabchev.com>. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.