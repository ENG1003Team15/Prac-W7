/*
 * MORSE CODE RECEIVER APP
 *------------------------------------------------------------------------------------------
 * Purpose: This file is designed to allow the web browser app Morse Code Receiver to decode camera image data, and translate the visually transmitted morse code into written words in the browser.
 * Team: 015, Prac Class Number P2
 * Authors: Aime Nicole Weffer Perez, Matthew James Sturgeon, Andy Y Cho, Rebecca Dawn Muir
 * Last Modified: 10/04/2016
 * Version: 1.2.9
 *-------------------------------------------------------------------------------------------
 */


/*
 * Morse Code receiver app information:
 *
 * Function: messageFinished(): stops the capturing process
 *
 *     You can call this function to let the app know that the 
 *     end-of-transmission signal has been received.
 *
 * -------------------------------------------------------
 *
 * ID: messageField: id of the message text area
 *
 *     This will be a textarea element where you can display
 *     the recieved message for the user.
 * 
 * -------------------------------------------------------
 *
 * ID: restartButton: id of the Restart button
 *
 *     This is a button element.  When clicked this should 
 *     cause your app to reset its state and begin recieving
 *     a new message.
 *
 */


// ADD YOUR ADDITIONAL FUNCTIONS AND GLOBAL VARIABLES HERE


// decodeCameraImage function is at the bottom


var priorMatching = 0;          // Counts the number of previous consecutive signals.

var priorActiveState = false;   // Denotes whether the previous signal was in the active state.

var tempMessage = "";           // tempMessage is transmitted to messageField and cleared after each character.

var active = false;             // For safety, active is set to false to prevent unexpected reception of on signal.

var outputMessage = "";         // This is transmitted to messageField.


// Step 2 - Lookup table for morse code: dot-dash sequence is assigned a unique letter.

var morseCode = 
    {
        "._" : "A",
        "_..." : "B",
        "_._." : "C",
        "_.." : "D",
        "." : "E",
        ".._." : "F",
        "__." : "G",
        "...." : "H",
        ".." : "I",
        ".___" : "J",
        "_._" : "K",
        "._.." : "L",
        "__" : "M",
        "_." : "N",
        "___" : "O",
        ".__." : "P",
        "__._" : "Q",
        "._." : "R",
        "..." : "S",
        "_" : "T",
        ".._" : "U",
        "..._" : "V",
        ".__" : "W",
        "_.._" : "X",
        "_.__" : "Y",
        "__.." : "Z",
        "_____" : "0",
        ".____" : "1",
        "..___" : "2",
        "...__" : "3",
        "...._" : "4",
        "....." : "5",
        "_...." : "6",
        "__..." : "7",
        "___.." : "8",
        "____." : "9",
        "_.__." : "(",
        "_.__._" : ")",
        "._.._." : '"',
        "_..._" : "=",
        ".____." : "'",
        "_.._." : "/",
        "._._." : "+",
        "___..." : ";", 
        "._._._" : ".",
        "__..__" : ",",
        "..__.." : "?",
        "_...._" : "-",
        ".__._." : "@",
        "..._.._" : "$", 
        "..__._" : "_", 
        "_._.__" : "!", 
        "._._" : "<br/>",  
    };  



// Step 3/4 - Check function: identifies whether the signal is on/off and translates signal into a temporary message, which gets moved into the message field at the signal of a character or word break.
   

// Dot: if active = true for 1-2 unit.

// Dash: if active = true for 3+ units. 

// Inter-element space: if active = false for 1-2 units, character active, word active.   

// Inter-character space: if active = false for 3-6 units, character inactive, word active, restart loop.    

// Inter-word space: if active = false for 7+ units, character inactive, word inactive, add space.


// Inter-element space resets the value of prior consecutive signals.

// Inter-character space transmits character, resets tempMessage and performs an inter-element space.

// Inter-word space transmits a space after performing an inter-character space.



if (outputMessage.substring(outputMessage.length - 2, outputMessage.length) === "SK")
    {
        messageFinished()  // Step 6 - The messageFinished function is called when the end of transmission signal is received.
    }
else    // If 'SK' is not detected in messageField.
    {
        function check(active)  // This function identifies the previous 'active' states [active is the variable which is told whether the image being shown is mostly red(on), or blue(off)], and uses this information to determine whether what's being transmitted is a dot, dash or a type of space. This information is then sent to the 'tempMessage' variable and is translated into words using the morse code reference contained in the 'morseCode' variable.
            {            
                if (active === priorActiveState)
                    {
                        priorMatching++   // If the state of 'active' is equal to the previous state, the variable 'priorMatching' increments by one - this counts the number of red(on) and blue(off) signals in a row. 
                    }

                if (active === false && priorActiveState === true)   // Otherwise, if the state of 'active' is false now, and was true beforehand...
                    {
                        if (priorMatching >= 1 && priorMatching <= 2)   // When priorMatching is greater than or equal to one, and less than or equal to two (when the signal has been the same for 1-2 time units):
                            {
                                tempMessage += "." ;   // Identifies a 'dot'.
                            }

                        if (priorMatching >= 3)   // When priorMatching is greater than or equal to three (when the signal has been the same for 3 or more time units):
                            {
                                tempMessage += "_" ;   // Identifies a 'dash'.
                            }

                        priorMatching = 1;   // Sets priorMatching back to one, so a new dot/dash can be decoded.
                    }

                 if (active === true && priorActiveState === false)   // Otherwise, if the state of 'active' is true now, and was false beforehand...
                    {
                        if (priorMatching >= 3 && priorMatching <= 6)   // When priorMatching is greater than or equal to three and less than or equal to six (when the signal has been the same for 3-6 time units):
                            {
                                if (tempMessage !== "")
                                    {
                                        outputMessage += morseCode[tempMessage];      // Looks up the value of tempMessage in the morseCode object and adds the corresponding value to outputMessage.
                                        document.getElementById('messageField').value = outputMessage;   // Sends the outputMessage decoded so far to the tempMessage variable.
                                    }

                                tempMessage = "" ;
                            }

                        if (priorMatching >= 7)   // Otherwise, when priorMatching is greater than seven (when the signal has  been the same for 7 or more time units):
                            {

                                if (tempMessage !== "")
                                    {
                                        outputMessage += morseCode[tempMessage] + " ";      // Looks up the value of tempMessage in the morseCode object and adds the corresponding value to outputMessage followed by a space.
                                        document.getElementById('messageField').value = outputMessage;   // Sends the outputMessage decoded so far to the tempMessage variable.
                                    }

                                tempMessage = "" ; 
                            }

                        priorMatching = 1;   // Resets the value of priorMatching to '1' in preparation for the decodeCameraImage function to be called again.
                    }

                priorActiveState = active;   // Resets the value of priorActiveState to 'active' in preparation for the decodeCameraImage function to be called again.
            };
    };

// Step 5 - clickRestart function: clears messageField and resets temporary variables.

document.getElementById('restartButton').onclick = function clickRestart()  // clickRestart function is called when user clicks restartButton.
{
    priorMatching = 1;
    priorActiveState = false;
    tempMessage = "";
    outputMessage = "";
    document.getElementById('messageField').value = "";
};



// Step 1 - decodeCameraImage function: looks at the pixels comprising the image data and determining whether the image is mostly blue/off, or mostly red/on.

/*
 * This function is called once per unit of time with camera image data.
 * 
 * Input : Image Data. An array of integers representing a sequence of pixels.
 *         Each pixel is represented by four consecutive integer values for 
 *         the 'red', 'green', 'blue' and 'alpha' values.  See the assignment
 *         instructions for more details.
 * Output: You should return a boolean denoting whether or not the image is 
 *         an 'on' (red) signal.
 */

function decodeCameraImage(data)
    {
    // ADD YOUR CODE HERE   
    var countR = 0
    var countG = 0
    var countB = 0      // These variables keep a count of how many red, green (and alpha) and blue pixels are seen in the image.
            
    for (var x = 0; x < data.length; x += 4)    // This 'for' loop analyses each pixel in the image and records the amount of mostly red, green and blue pixels seen in the image.
        {
            var r = data[x];
            var g = data[x+1];
            var b = data[x+2];      // These variables contain the amount of red, green and blue seen in each pixel in the image.
            
            if (r > b && r > g)
                {
                    countR++        // If the pixel is mostly red, plus one to the 'red' count.
                }
            else if (b > r && b > g)
                {
                    countB++        // If the pixel is mostly blue, plus one to the 'blue' count.
                }
            else // if (g > r && g > b)
                {
                    countG++        // Otherwise (if the image is neither mostly red nor blue, or mostly green) add one to the green count. This loop ignores the values for the alpha of each pixel, as we assume each pixel has an alpha value of 255 for the purposes of this assignment. However as the value of alpha is every multiple of 4 in the image data  array, we only record the multiples of 1-3 for our data.
                }
        }
        
    if (countR > countB && countR > countG)     // This 'if' loop looks to see if the image is mostly red/on or blue/off, and then calls the 'check' function with the answer.
        {
			active = true;   // The signal is active when the display detects red dominance.
            check(true);     // The check function is called with this argument.
        }
    else if (countB > countR && countB > countG)
        {
			active = false;  // The signal is inactive when the display detects blue dominance.
            check(false);    // The check function is called with this argument.
        }
    else //if (countG > countR && countG > countB)
        {
			active = false;  // The signal is also inactive if the display detects green dominance and no argument is provided to the check function.                   
        }
    
    return active;  // Returns true or false depending on the state received.
    };