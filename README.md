Using ValidationHelper
---------------
This is a small utilty that I wrought because I couldn't find a minimal js only validation utility. 

**Download from: res/ValidationHelper.js**

**Tested with: jquery 1.7.1**

## Quick Start:

    var helper = new ValidationHelper($("#myElement"), $("#myElement").val());
    helper.isRequired();            //check whether element is empty 
    var result = helper.isValid();  //get result of validation

The first argument specifies the input, the second value specifies the value
that is currently in the input field. The second argument is the value on which all the validation is run.

By default the following is placed after the element if it fails validation

    <label class="error">[message]</label>

## Validation Methods
* **isRequired()** - check is not empty
* **isDigit()** - check is an integer
* **isDate()** - check is date in format dd/mm/yyy (todo: add configurable formats)
* **isDecimal()** - check is a decimal
* **inRange(minVal, maxVall)** - check value is in range
* **isGreaterThan(val)** - check input value greater than val
* **isLessThan(val)** - check input value is less than val
* **isValidRemote(url, postData, errorMessage)** - send value to server with
  postData, will wait for server to respond with {isValid : [true or false]} to determine if validation successfull on server. This is a get request. if isValid is false then the error message will be displayed
  
  
## Other Methods
* **resetAll()** - remove elements with .error on page, remove .invalid from invalid fields
* **isValid()** - get value of valid (use after performing validation)
* **isEnd()** - does the same as isValid()

## Chaining
Validation methods can be chained 

    var helper = new ValidationHelper($("#myElement"), $("#myElement").val());

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
    var result = new ValidationHelper($("#myElement"), $("#myElement").val())
                   .isRequired()
                   .isDecimal()
                   .inRange(2,4)
                   .end(); //the end method does the same as is valid, returns      


## Configuration
There are optional configuration that can be passed as the 3rd positional argument when creating a ValidationHelper instance;

example:

    var helper = new ValidationHelper($('#el'), $('#el').val(), {
        target: $('#errContainer'), //element in error label should be placed
        validateEmpty: true, //whether to continue validation even if input is empty
        continueOnInvalid : true, //whether to continue validation chain if one rule fails
    });

## Override default error messages
When field validation fails the onFail() method is called, the first argument to the method is the error string. You can override this method to provide your own 
mechanism for handling errors. 
