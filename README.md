Using ValidationHelper
---------------
A small js utility to speed up web form validation. 

**Tested with: jquery 1.7.1, should work with 1.5+**

##[Download](https://raw.github.com/rizvn/ValidationHelper/master/res/ValidationHelper.js)

## Quick Start:

    var helper = new ValidationHelper($("#myElement"));
    helper.isRequired();            //check whether element is empty 
    var result = helper.isValid();  //get result of validation

The first argument specifies the input, the second value specifies the value
that is currently in the input field. The second argument is the value on which all the validation is run.

By default the following is placed after the element if it fails validation

    <label class="error">[message]</label>

## Validation Methods
* **isRequired()** - check is not empty
* **isDigit()** - check is an integer
* **isDate()** - check is date in format dd/mm/yyyy
* **isRegExpMatch(reqEx, errorMessage)** - check if value matches regular expresion
* **isDecimal()** - check is a decimal
* **inRange(minVal, maxVall)** - check value is in range
* **isGreaterThan(val)** - check input value greater than val
* **isLessThan(val)** - check input value is less than val
* **isLongerThan(val)** - check length of input is longer than val
* **isShorterThan(val)** - check length of input is shorter than val
* **isLength(val)** - check length of input is same as val
* **isEqual(val)** - check input matches val (string comparison)
* **isNot(val)** - check input does not match val (string comparison)
* **isValidRemote(url, postData, errorMessage)** - send value to server with
  postData, will wait for server to respond with {isValid : [true or false]} to determine if validation successfull on server. This is a get request. if isValid is false then the error message will be displayed, is error is not passed as the third argument, it will look for an error property in the json response from the server, if that also does not have an error key then the default error message will be displayed
  
  
## Other Methods
* **resetAll()** - remove elements with .error on page, remove .invalid from invalid fields
* **and(result)** - performs a logical and with result and state of the object and returns the result, usefull for tracking validation, see example below
* **isValid()** - get value of valid (use after performing validation)
* **isEnd()** - does the same as isValid()

## Chaining
Validation methods can be chained 

    var helper = new ValidationHelper($("#myElement"));

    helper
      .isRequired()  //check is not empty
      .isDecimal()   //then check it is a decimal
      .inRange(2,4); //check is between 2 and 4.
    
    var result - helper.isValid(); //check the outcome of validating
    
    //--- or fewer steps ---
  
    var result = helper
                   .isRequired()
                   .isDecimal()
                   .inRange(2,4)
                   .end(); //the end method does the same as is valid, returns the outcome of the validation


    //-- or even fewer steps
    var result = new ValidationHelper($("#myElement"))
                   .isRequired()
                   .isDecimal()
                   .inRange(2,4)
                   .and(result); //the and method performs a logical and with result and current valid state and 
                                 //returns the result 

##Tracking validation state through out a function
A common design pattern for performing validation is to have a validation method which returns true if validation was sucessfull and false if validation is unsucessfull. The **and()** can be usefull for this type of validation.

    function validate(){
       var isValid = true; //variable to hold validation status
       
       isValid = new ValidationHelper($('#field1'))
                     .isRequired()
                     .isLength(9)
                     .and(isValid); //the and method will get the validation state after the above methods have completed on this field then and it with the isValid arg passed in. The result will be stored in isValid var on the first line. 

       isValid = new ValidationHelper($('#field2'))
                     .isRequired()
                     .and(isValid);

       isValid = new ValidationHelper($('#field3'))
                     .isRequired()
                     .isDigit()
                     .and(isValid);

       isValid = new ValidationHelper($('#field4'))
                     .isRequired()
                     .isDigit()
                     .and(isValid);
       
       return isValid;  //return whether all validations passed
    }

## Configuration
There are optional methods that can be used to change validation behavior 

    var helper = new ValidationHelper($('#el'))
    
    //sets container in which to write error message
    helper.setTarget($('#errContainer'));
    
    
    //set whether to continue next validation if previous validation in 
    //chain fails
    helper.setContinueOnInvalid(true);
    
    
    //whether to validate on empty field
    helper.setValidateEmpty()
    

## Override default error messages
When field validation fails the onFail() method is called, the first argument to the method is the error string. You can override this method to provide your own 
mechanism for handling errors. 

     var helper = new ValidationHelper($('#el'))
   
     //overide existing on fail implementation 
     helper.onFail = function(message){ alert(message)}
     
     helper.isRequired() //will call above implementaion on fail
     
## MIT License
Copyright (C) 2012 Rizvan Fujasuddin 
 
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
