
/**
 * The class that handles the reading and writing of files
 */
FileIO = {

/////////////////////////////////////////////////////// Public Methods ///////////////////////////////////////////////////

    readFile : function(fileName) {
    
        var homeDirFile = FileIO.getHomeDirectory();

        var file = homeDirFile;
        file.append(fileName);
        alert("FileIO reading file" + file.path);
        //alert("making input stream");
        // open an input stream from the file
        var istream = Components.classes["@mozilla.org/network/file-input-stream;1"].
                      createInstance(Components.interfaces.nsIFileInputStream);
        //alert("reading point 2");
        istream.init(file, 0x01, 0444, 0);
        //alert("reading point 3");
         
         var converter = Components.classes["@mozilla.org/intl/converter-input-stream;1"].
                createInstance(Components.interfaces.nsIConverterInputStream);
        //alert("reading point 4");
        converter.init(istream, "UTF-8", 0, 0);
        //alert("reading point 5");
        var stringContents = "";
        var tempString = {};
        while (converter.readString(4096, tempString) != 0) {
            stringContents += tempString.value;
        }

        //data = converter.readString();
        //alert("reading point 6");
        converter.close(); // this closes foStream

        // do something with read data
        //alert("filecontents = " + stringContents);
        return stringContents;
    },
    
    writeFile : function(fileName, stringData, append) {
        homeDirFile = FileIO.getHomeDirectory();

        var file = homeDirFile;
        file.append(fileName);
        //alert("writing file " + file.path);
        
        var data = stringData
        // file is nsIFile, data is a string
        var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].
                       createInstance(Components.interfaces.nsIFileOutputStream);
        //alert("writing files part 1");
         
        // use 0x02 | 0x10 to open file for appending.
        /*
        File_io_flags 	
            0�01 	Read only
	        0�02 	Write only
            0�04    Read and Write
	        0�08 	Create File
	        0�10 	Append
	        0�20 	Truncate
	        0�40 	Sync
	        0�80 	Exclude
	        */
	    if (append)
            foStream.init(file, 0x02 | 0x08 | 0x10, 0666, 0);
        else
            foStream.init(file, 0x02 | 0x08 | 0x20, 0666, 0);
        
        // write, create, truncate
        // In a c file operation, we have no need to set file mode with or operation,
        // directly using "r" or "w" usually.
         
        // if you are sure there will never ever be any non-ascii text in data you can
        // also call foStream.writeData directly
        //alert("writing files part 2");
        var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].
                        createInstance(Components.interfaces.nsIConverterOutputStream);
        //alert("writing files part 3");
        converter.init(foStream, "UTF-8", 0, 0);
        //alert("writing files part 4");
        converter.writeString(data);
        //alert("writing files part 5");
        converter.close(); // this closes foStream

        //alert("done writing file " + fileName);
    },
/////////////////////////////////////////////////////// Private Methods ///////////////////////////////////////////////////

    getHomeDirectory : function() {
        // This will choose the user's home directory
        var dirService = Components.classes["@mozilla.org/file/directory_service;1"].
                         getService(Components.interfaces.nsIProperties);
        var homeDirFile = dirService.get("Home", Components.interfaces.nsIFile); // returns an nsIFile object
        return homeDirFile;
        
        /* // If we can determine the correct path, we can use this
        alert("homedir part 1");
        var path = "c:\\Users\\gastoj3";
        //var path = "chrome://bluejay/content";
        var homeDir = Components.classes["@mozilla.org/file/local;1"]
           .createInstance(Components.interfaces.nsILocalFile);
        alert("homedir part 2");
        //homeDir.initWithPath(path);
        //alert("homedir path = " + homeDir.path);
        return homeDir;
        */
    }
/////////////////////////////////////////////////////// Member Variables ///////////////////////////////////////////////////

};

function message(text) {
    // append the text to the end of the output file
    FileIO.writeFile("output.txt", text, 1);

    // don't bother showing a blank message
    //if (text != "\r\n")
    //    alert(text);
};